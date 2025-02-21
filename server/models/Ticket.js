const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    default: 'Shivam Gupta'
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: 'Not Provided'
  },

  // Ticket Information
  type: {
    type: String,
    required: true,
    enum: ['Adult', 'Child', 'Senior', 'Student']
  },
  price: {
    type: Number,
    required: true
  },
  ageRange: {
    type: String,
    required: true,
    enum: ['18+ years', '5-17 years', '60+ years', 'Valid Student ID']
  },
  ageDescription: {
    type: String,
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: 1
  },

  // Payment Information
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