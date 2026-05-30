const Seat = require('../models/Seat');
const Room = require('../models/Room');
const Ticket = require('../models/Ticket');

const BRANCH_MAPPING = {
  'hyderabad': 'Hyderabad HITEC',
  'bangalore': 'Bangalore Koramangala',
  'chennai': 'Chennai OMR',
  'indiranagar': 'Bengaluru Indiranagar',
  'mumbai-bkc': 'Mumbai BKC',
  'gurugram-cyber-city': 'Gurugram Cyber City'
};

const SEED_BRANCHES = ['hyderabad', 'bangalore', 'chennai', 'indiranagar', 'mumbai-bkc', 'gurugram-cyber-city'];

// Helper to compute dynamic metrics per branch
const calculateBranchLoad = async (branchKey) => {
  const branchLower = branchKey.toLowerCase();
  
  // 1. Occupancy Percentage (50% Weight)
  const totalSeats = await Seat.countDocuments({ branch: branchLower });
  const occupiedCount = await Seat.countDocuments({ branch: branchLower, status: 'occupied' });
  const reservedCount = await Seat.countDocuments({ branch: branchLower, status: 'reserved' });
  const occupiedSeats = occupiedCount + reservedCount;
  const occupancyRate = totalSeats > 0 ? (occupiedSeats / totalSeats) * 100 : 0;

  // 2. Room Utilization Percentage (25% Weight)
  const totalRooms = await Room.countDocuments({ branch: branchLower });
  const roomsWithBookings = await Room.countDocuments({ 
    branch: branchLower, 
    'bookings.0': { $exists: true } 
  });
  const roomUtilizationRate = totalRooms > 0 ? (roomsWithBookings / totalRooms) * 100 : 0;

  // 3. Open Ticket Load Percentage (15% Weight)
  const totalTickets = await Ticket.countDocuments({ branch: branchLower });
  const openTickets = await Ticket.countDocuments({ 
    branch: branchLower, 
    status: { $in: ['open', 'in progress'] } 
  });
  const ticketLoad = totalTickets > 0 ? (openTickets / totalTickets) * 100 : 0;

  // 4. Active Bookings Density Percentage (10% Weight)
  const rooms = await Room.find({ branch: branchLower });
  let totalRoomBookings = 0;
  if (rooms && rooms.length > 0) {
    rooms.forEach(r => {
      totalRoomBookings += r.bookings ? r.bookings.length : 0;
    });
  }
  const activeBookingsRate = Math.min(100, totalSeats > 0 ? ((occupiedSeats + totalRoomBookings) / totalSeats) * 100 : 0);

  // 5. Final Load Score calculation
  const score = Math.round(
    (occupancyRate * 0.50) + 
    (roomUtilizationRate * 0.25) + 
    (ticketLoad * 0.15) + 
    (activeBookingsRate * 0.10)
  );

  // Assign load status based on score thresholds
  let status = 'Low Load';
  let recommendation = 'Low occupancy detected. Consider promotional campaigns.';

  if (score > 80) {
    status = 'High Load';
    recommendation = 'Branch approaching capacity. Consider redirecting bookings.';
  } else if (score > 50) {
    status = 'Medium Load';
    recommendation = 'Healthy utilization levels.';
  }

  const displayName = BRANCH_MAPPING[branchLower] || (branchKey.charAt(0).toUpperCase() + branchKey.slice(1));

  return {
    branch: displayName,
    branchKey: branchLower,
    score,
    status,
    recommendation,
    metrics: {
      occupancy: Math.round(occupancyRate),
      roomUtilization: Math.round(roomUtilizationRate),
      ticketLoad: Math.round(ticketLoad),
      bookingDensity: Math.round(activeBookingsRate)
    }
  };
};

// @desc    Retrieve dynamic smart branch load scores
// @route   GET /api/load-score
// @access  Private
const getBranchLoadScore = async (req, res) => {
  try {
    let targetBranches = [];

    // 1. RBAC and Scope Filtering Logic
    if (req.user.role === 'admin') {
      if (req.query.branch && req.query.branch.toLowerCase() !== 'all') {
        const queryBranch = req.query.branch.toLowerCase();
        // Allow querying a specific branch
        targetBranches = [queryBranch];
      } else {
        // Default to all known branches for Admin comparison view
        targetBranches = SEED_BRANCHES;
      }
    } else if (req.user.role === 'manager' || req.user.role === 'receptionist') {
      if (!req.user.branch) {
        return res.status(400).json({ error: 'Access Denied: Your user account profile does not specify an assigned branch.' });
      }
      const assignedBranch = req.user.branch.toLowerCase();
      targetBranches = [assignedBranch];

      // If they try to request a different branch via query parameter, block access
      if (req.query.branch && req.query.branch.toLowerCase() !== assignedBranch) {
        return res.status(403).json({
          error: `Access Forbidden: Your role is restricted to your assigned branch: ${req.user.branch}. You are not authorized to view loads for other branches.`
        });
      }
    } else {
      return res.status(403).json({ error: 'Access Forbidden: Unauthorized role access.' });
    }

    // 2. Query and compute load scores concurrently
    const results = await Promise.all(
      targetBranches.map(branch => calculateBranchLoad(branch))
    );

    // 3. Admin features: Sort by highest score first
    if (req.user.role === 'admin') {
      results.sort((a, b) => b.score - a.score);
    }

    console.log(`🧠 Smart Load scores compiled for user: ${req.user.email} (Role: ${req.user.role}, Count: ${results.length} branches)`);

    res.status(200).json(results);
  } catch (error) {
    console.error(`❌ getBranchLoadScore controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to process branch load scoring analytics.' });
  }
};

module.exports = {
  getBranchLoadScore
};
