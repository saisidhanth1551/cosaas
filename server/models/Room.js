const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  organizer: {
    type: String,
    required: [true, 'Please provide the organizer/client name'],
    trim: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: [true, 'Please specify the booking date']
  },
  timeSlot: {
    type: String, // e.g. "10:00 AM - 11:00 AM"
    required: [true, 'Please select a booking time slot']
  },
  duration: {
    type: String,
    required: [true, 'Please specify the duration']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a conference room name'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please specify room capacity']
  },
  branch: {
    type: String,
    required: [true, 'Please assign to a branch location'],
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['available', 'maintenance'],
    default: 'available'
  },
  amenities: {
    type: [String],
    default: []
  },
  bookings: [bookingSchema]
}, {
  timestamps: true
});

// Compound index for fast branch queries and unique names per branch
roomSchema.index({ branch: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
