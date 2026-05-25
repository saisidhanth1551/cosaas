const Seat = require('../models/Seat');
const Room = require('../models/Room');
const Ticket = require('../models/Ticket');

// @desc    Retrieve aggregated chronologically-sorted operational timeline events
// @route   GET /api/activity
// @access  Private
const getActivityFeed = async (req, res) => {
  try {
    const filter = {};

    // Role-based filtering: Non-admins are restricted strictly to their assigned branch
    if (req.user.role !== 'admin') {
      filter.branch = req.user.branch.toLowerCase();
    }

    // 1. Gather active seat bookings
    const activeSeats = await Seat.find({ ...filter, status: { $ne: 'available' } });
    const seatEvents = activeSeats.map(seat => ({
      type: 'seat_booking',
      message: `Seat ${seat.seatNumber} reserved for ${seat.assignedTo || 'Client'}`,
      branch: seat.branch,
      timestamp: seat.updatedAt || seat.createdAt || new Date()
    }));

    // 2. Gather room bookings
    const rooms = await Room.find(filter);
    const roomEvents = [];
    rooms.forEach(room => {
      if (room.bookings && room.bookings.length > 0) {
        room.bookings.forEach(booking => {
          roomEvents.push({
            type: 'room_booking',
            message: `Room '${room.name}' booked by ${booking.organizer} (${booking.timeSlot})`,
            branch: room.branch,
            timestamp: booking.createdAt || room.updatedAt || new Date()
          });
        });
      }
    });

    // 3. Gather ticket activities
    const tickets = await Ticket.find(filter);
    const ticketEvents = tickets.map(ticket => {
      let actionText = 'raised';
      if (ticket.status === 'in progress') actionText = 'marked in progress';
      if (ticket.status === 'resolved') actionText = 'resolved';

      return {
        type: 'ticket_update',
        message: `Support Ticket "${ticket.title}" ${actionText} (Priority: ${ticket.priority})`,
        branch: ticket.branch,
        timestamp: ticket.updatedAt || ticket.createdAt || new Date()
      };
    });

    // 4. Flatten, Sort & Limit
    const allActivities = [...seatEvents, ...roomEvents, ...ticketEvents];
    
    // Sort descending (newest activities first)
    allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Limit to latest 15 for lightweight hackathon performance
    const feedResponse = allActivities.slice(0, 15);

    console.log(`📈 Activity feed generated for: ${req.user.email} (${feedResponse.length} items, Scope: ${req.user.role === 'admin' ? 'Global' : req.user.branch})`);

    res.status(200).json(feedResponse);
  } catch (error) {
    console.error(`❌ getActivityFeed controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to compile operational activity feed.' });
  }
};

module.exports = {
  getActivityFeed
};
