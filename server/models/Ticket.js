const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a ticket title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a ticket description'],
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'in progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  branch: {
    type: String,
    required: [true, 'Please specify the reporting branch location'],
    trim: true,
    lowercase: true
  },
  reportedBy: {
    type: String,
    required: [true, 'Please provide reporter name'],
    trim: true
  },
  assignedStaff: {
    type: String,
    default: 'Unassigned',
    trim: true
  },
  resolutionNotes: {
    type: String,
    default: '',
    trim: true
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
