const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please provide client contact name'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide client company name'],
    trim: true
  },
  branch: {
    type: String,
    required: [true, 'Please specify an assigned branch location'],
    trim: true,
    lowercase: true
  },
  contractStartDate: {
    type: Date,
    required: [true, 'Please provide contract start date']
  },
  contractEndDate: {
    type: Date,
    required: [true, 'Please provide contract end date']
  },
  email: {
    type: String,
    required: [true, 'Please provide client email address'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide client phone number'],
    trim: true
  },
  // Individual dynamic score parameters (0 - 100)
  occupancyDuration: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 75
  },
  bookingFrequency: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 75
  },
  roomUsage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 75
  },
  ticketSatisfaction: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 75
  },
  recentActivity: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 75
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', ClientSchema);
