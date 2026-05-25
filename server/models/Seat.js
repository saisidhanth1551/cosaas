const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: [true, 'Please specify a seat label (e.g. A1, A2)'],
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  },
  branch: {
    type: String,
    required: [true, 'Please specify a branch location'],
    trim: true,
    lowercase: true
  },
  assignedTo: {
    type: String,
    default: ''
  },
  bookingDate: {
    type: String,
    default: ''
  },
  bookingTime: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to guarantee seat uniqueness per branch
SeatSchema.index({ seatNumber: 1, branch: 1 }, { unique: true });

module.exports = mongoose.model('Seat', SeatSchema);
