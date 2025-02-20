const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { generateTicketPDF } = require('../utils/pdfGenerator');
const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');

// Initialize Razorpay only after ensuring environment variables are loaded
let razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not found in environment variables');
  }
  
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} catch (error) {
  console.error('Razorpay initialization error:', error);
}

// Create order
router.post('/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      throw new Error('Razorpay not initialized');
    }

    const { amount, receipt, email } = req.body;
    
    if (!amount || !email) {
      return res.status(400).json({ error: 'Amount and email are required' });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt,
      notes: { email }
    };

    const order = await razorpay.orders.create(options);

    // Save payment details
    await Payment.create({
      orderId: order.id,
      amount: amount,
      email: email,
      status: 'created'
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment and send email
router.post('/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      ticketDetails,
      email 
    } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Update payment status
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          paymentId: razorpay_payment_id,
          status: 'paid'
        }
      );

      // Create ticket record
      const ticket = await Ticket.create({
        ...ticketDetails,
        email,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'confirmed'
      });

      // Generate ticket PDF
      const pdfBuffer = await generateTicketPDF(ticket);
      
      // Send email with ticket
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Museum Ticket Confirmation',
        html: `
          <h1>Thank you for your purchase!</h1>
          <p>Your ticket details:</p>
          <ul>
            <li>Ticket Type: ${ticketDetails.type}</li>
            <li>Price: ₹${ticketDetails.price}</li>
            <li>Valid for: ${ticketDetails.ageRange}</li>
          </ul>
          <p>Please find your ticket attached.</p>
        `,
        attachments: [{
          filename: 'museum-ticket.pdf',
          content: pdfBuffer
        }]
      };

      await req.app.locals.emailTransporter.sendMail(mailOptions);
      
      res.json({ 
        verified: true,
        message: 'Payment verified and ticket sent to email'
      });
    } else {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'failed' }
      );
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router; 