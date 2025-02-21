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
      
      // Enhanced email template
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🎫 Your Museum Visit Confirmation',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(to right, #3B82F6, #10B981); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
              .ticket-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #666; }
              .button { background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
              .qr-note { background: #e9ecef; padding: 10px; border-radius: 6px; margin-top: 20px; font-size: 0.9em; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Your Purchase!</h1>
                <p>Your museum visit is confirmed</p>
              </div>
              <div class="content">
                <h2>🎫 Ticket Details</h2>
                <div class="ticket-details">
                  <p><strong>Ticket Type:</strong> ${ticketDetails.type}</p>
                  <p><strong>Price:</strong> ₹${ticketDetails.price}</p>
                  <p><strong>Valid for:</strong> ${ticketDetails.ageRange}</p>
                  <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
                  <p><strong>Purchase Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                
                <div class="qr-note">
                  📱 Your ticket is attached to this email. Please show it at the entrance.
                </div>

                <h3>📍 Museum Location</h3>
                <p>123 Museum Avenue, Art District<br>Opening Hours: 9:00 AM - 6:00 PM</p>

                <h3>📞 Need Help?</h3>
                <p>Contact us at:<br>
                Email: info@museum.com<br>
                Phone: +1 (555) 123-4567</p>

                <div class="footer">
                  <p>Thank you for choosing our museum. We look forward to your visit!</p>
                  <small>This is an automated email. Please do not reply.</small>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        attachments: [{
          filename: `museum-ticket-${razorpay_order_id}.pdf`,
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