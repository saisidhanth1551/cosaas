const Room = require('../models/Room');

// Aligned response formatter helper
const formatRoomResponse = (room) => ({
  _id: room._id,
  name: room.name,
  capacity: room.capacity,
  branch: room.branch,
  status: room.status,
  amenities: room.amenities,
  bookings: room.bookings.map(b => ({
    _id: b._id,
    organizer: b.organizer,
    date: b.date,
    timeSlot: b.timeSlot,
    duration: b.duration
  }))
});

// @desc    Retrieve all rooms optionally filtered by branch (restricted by role)
// @route   GET /api/rooms
// @access  Private
const getRooms = async (req, res) => {
  try {
    const { branch } = req.query;
    const filter = {};

    let queryBranch = branch ? branch.toLowerCase() : null;

    // Role Lock: Non-admins are locked to their profile's assigned branch
    if (req.user.role !== 'admin') {
      queryBranch = req.user.branch.toLowerCase();
    }

    if (queryBranch) {
      filter.branch = queryBranch;
    }

    const rooms = await Room.find(filter).sort({ name: 1 });
    const formattedRooms = rooms.map(formatRoomResponse);
    res.status(200).json(formattedRooms);
  } catch (error) {
    console.error(`❌ getRooms controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve conference rooms.' });
  }
};

// @desc    Add a slot booking to a room with collision protection
// @route   POST /api/rooms/:id/book
// @access  Private
const bookRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizer, bookedBy, date, timeSlot, duration } = req.body;
    const finalOrganizer = organizer || bookedBy;

    if (!finalOrganizer || !date || !timeSlot || !duration) {
      return res.status(400).json({ error: 'Please provide organizer or bookedBy, date, time slot, and duration.' });
    }

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: 'Conference room not found.' });
    }

    if (room.status === 'maintenance') {
      return res.status(400).json({ error: 'This room is currently under maintenance.' });
    }

    // Role Lock: Non-admins can only book rooms at their assigned branch
    if (req.user.role !== 'admin' && room.branch.toLowerCase() !== req.user.branch.toLowerCase()) {
      return res.status(403).json({
        error: `Access Forbidden: You are only authorized to book rooms at your branch '${req.user.branch}'.`
      });
    }

    // Booking Collision Check
    const isColliding = room.bookings.some(
      (b) => b.date === date && b.timeSlot.toLowerCase() === timeSlot.toLowerCase()
    );

    if (isColliding) {
      return res.status(400).json({
        error: `Scheduling Collision: '${timeSlot}' on ${date} is already reserved for this room.`
      });
    }

    // Push new booking
    room.bookings.push({
      organizer: finalOrganizer,
      date,
      timeSlot,
      duration
    });

    await room.save();
    console.log(`📅 Room '${room.name}' (${room.branch}) successfully booked for ${organizer} on ${date} @ ${timeSlot}`);

    res.status(200).json(formatRoomResponse(room));
  } catch (error) {
    console.error(`❌ bookRoom controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to schedule room reservation.' });
  }
};

module.exports = {
  getRooms,
  bookRoom
};
