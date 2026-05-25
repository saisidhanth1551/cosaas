const Seat = require('../models/Seat');
const Ticket = require('../models/Ticket');
const Room = require('../models/Room');

// @desc    Retrieve dynamic analytical statistics for dashboard overview
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const filter = {};
    const ticketFilter = {};
    const roomFilter = {};

    let selectedBranch = 'all';

    // Role-based filtering: Non-admins are strictly locked to their assigned branch
    if (req.user.role !== 'admin') {
      if (!req.user.branch) {
        return res.status(400).json({ error: 'User profile does not specify an assigned branch.' });
      }
      selectedBranch = req.user.branch.toLowerCase();
      filter.branch = selectedBranch;
      ticketFilter.branch = selectedBranch;
      roomFilter.branch = selectedBranch;
    } else {
      // Admins can query specific branches dynamically via query parameter
      if (req.query.branch && req.query.branch.toLowerCase() !== 'all') {
        selectedBranch = req.query.branch.toLowerCase();
        filter.branch = selectedBranch;
        ticketFilter.branch = selectedBranch;
        roomFilter.branch = selectedBranch;
      }
    }

    // 1. Coworking Seats Metrics
    const totalSeats = await Seat.countDocuments(filter);
    const occupiedCount = await Seat.countDocuments({ ...filter, status: 'occupied' });
    const reservedCount = await Seat.countDocuments({ ...filter, status: 'reserved' });
    const occupiedSeats = occupiedCount + reservedCount;
    const availableSeats = await Seat.countDocuments({ ...filter, status: 'available' });
    const occupancyRate = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

    // 2. Support Tickets Metrics
    const openTickets = await Ticket.countDocuments({ ...ticketFilter, status: { $in: ['open', 'in progress'] } });
    const resolvedTickets = await Ticket.countDocuments({ ...ticketFilter, status: 'resolved' });

    // 3. Conference Rooms & Bookings Metrics
    const totalRooms = await Room.countDocuments(roomFilter);
    const rooms = await Room.find(roomFilter);
    let activeRoomBookings = 0;
    if (rooms && rooms.length > 0) {
      rooms.forEach(room => {
        activeRoomBookings += room.bookings ? room.bookings.length : 0;
      });
    }

    console.log(`📊 Dashboard stats generated for user: ${req.user.email} (Scope: ${req.user.role === 'admin' ? 'Global' : req.user.branch})`);

    res.status(200).json({
      totalSeats,
      occupiedSeats,
      availableSeats,
      occupancyRate,
      openTickets,
      resolvedTickets,
      totalRooms,
      activeRoomBookings,
      branch: selectedBranch
    });
  } catch (error) {
    console.error(`❌ getDashboardStats controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to compile dashboard analytics.' });
  }
};

module.exports = {
  getDashboardStats
};
