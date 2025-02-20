const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  ageRange: String,
  description: String,
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Ticket', ticketSchema); 