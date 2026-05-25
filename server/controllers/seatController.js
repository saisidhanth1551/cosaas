const mongoose = require('mongoose');
const Seat = require('../models/Seat');

// Aligned response formatter helper
const formatSeatResponse = (seat) => ({
  _id: seat._id,
  id: seat.seatNumber, // maps to React frontend expectations
  seatNumber: seat.seatNumber,
  status: seat.status,
  branch: seat.branch,
  assignedTo: seat.assignedTo || '',
  bookingDate: seat.bookingDate || '',
  bookingTime: seat.bookingTime || '',
  duration: seat.duration || ''
});

const getSeats = async (req, res) => {
  try {
    const { branch } = req.query;
    const filter = {};

    let queryBranch = branch ? branch.toLowerCase() : null;
    
    // Role Lock: Non-admins are restricted to only viewing their assigned branch
    if (req.user.role !== 'admin') {
      queryBranch = req.user.branch.toLowerCase();
    }

    if (queryBranch) {
      filter.branch = queryBranch;
    }

    const seats = await Seat.find(filter).sort({ seatNumber: 1 });
    
    // Map to frontend-friendly structure
    const formattedSeats = seats.map(formatSeatResponse);
    res.status(200).json(formattedSeats);
  } catch (error) {
    console.error(`❌ getSeats controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve coworking seats layout.' });
  }
};

// @desc    Assign client or update booking information for a seat
// @route   PUT /api/seats/:id
// @access  Private
const updateSeat = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, bookingDate, bookingTime, duration, branch } = req.body;

    let seat;

    // Resilient lookup: first try Mongoose ObjectId, then fallback to semantic seat label (e.g. A1)
    if (mongoose.Types.ObjectId.isValid(id)) {
      seat = await Seat.findById(id);
    }

    if (!seat) {
      const query = { seatNumber: id.toUpperCase() };
      
      let queryBranch = branch;
      if (req.user.role !== 'admin') {
        queryBranch = req.user.branch;
      }

      if (queryBranch) {
        query.branch = queryBranch.toLowerCase();
      }
      seat = await Seat.findOne(query);
    }

    if (!seat) {
      return res.status(404).json({ error: `Seat with reference '${id}' not found.` });
    }

    // Role Lock: Non-admins cannot modify bookings for seats belonging to other branches
    if (req.user.role !== 'admin' && seat.branch.toLowerCase() !== req.user.branch.toLowerCase()) {
      return res.status(403).json({
        error: `Access Forbidden: You are only authorized to modify seat bookings at your branch '${req.user.branch}'.`
      });
    }

    // Hydrate fields
    if (status !== undefined) seat.status = status;
    
    if (status === 'available') {
      // Clear allocation details
      seat.assignedTo = '';
      seat.bookingDate = '';
      seat.bookingTime = '';
      seat.duration = '';
    } else {
      if (assignedTo !== undefined) seat.assignedTo = assignedTo;
      if (bookingDate !== undefined) seat.bookingDate = bookingDate;
      if (bookingTime !== undefined) seat.bookingTime = bookingTime;
      if (duration !== undefined) seat.duration = duration;
    }

    await seat.save();
    console.log(`💺 Seat ${seat.seatNumber} in ${seat.branch} updated to status: ${seat.status} (Client: ${seat.assignedTo || 'Unassigned'})`);

    res.status(200).json(formatSeatResponse(seat));
  } catch (error) {
    console.error(`❌ updateSeat controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to update seat booking reservation details.' });
  }
};

module.exports = {
  getSeats,
  updateSeat
};
