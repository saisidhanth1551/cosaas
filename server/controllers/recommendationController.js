const Seat = require('../models/Seat');
const Room = require('../models/Room');
const Ticket = require('../models/Ticket');
const Client = require('../models/Client');
const { fitLinearRegression, trainLogisticRegression } = require('../utils/mlEngine');

// Pre-train Logistic Regression Model
const mlModel = trainLogisticRegression();

const BRANCH_MAPPING = {
  'hyderabad': 'Hyderabad HITEC',
  'bangalore': 'Bangalore Koramangala',
  'chennai': 'Chennai OMR',
  'indiranagar': 'Bengaluru Indiranagar',
  'mumbai-bkc': 'Mumbai BKC',
  'gurugram-cyber-city': 'Gurugram Cyber City'
};

const SEED_BRANCHES = ['hyderabad', 'bangalore', 'chennai', 'indiranagar', 'mumbai-bkc', 'gurugram-cyber-city'];

// Helper to calculate score and statistics per branch and generate advisory items
const generateRecommendationsForBranch = async (branchKey) => {
  const branchLower = branchKey.toLowerCase();
  const branchName = BRANCH_MAPPING[branchLower] || (branchKey.charAt(0).toUpperCase() + branchKey.slice(1));
  const list = [];

  // --- SOURCE 1: Occupancy Forecasting ---
  const totalSeats = await Seat.countDocuments({ branch: branchLower });
  const occupiedCount = await Seat.countDocuments({ branch: branchLower, status: 'occupied' });
  const reservedCount = await Seat.countDocuments({ branch: branchLower, status: 'reserved' });
  const occupiedSeats = occupiedCount + reservedCount;
  const occupancyRate = totalSeats > 0 ? (occupiedSeats / totalSeats) * 100 : 0;

  // Fit OLS Linear Regression over 30-day simulated occupancy bounds
  const points = [];
  for (let day = 1; day <= 30; day++) {
    const variance = Math.sin(day / 2) * 5 + (day % 7 === 0 || day % 7 === 6 ? -12 : 6);
    const simulatedOccupancy = Math.max(10, Math.min(100, occupancyRate + variance));
    points.push({ x: day, y: simulatedOccupancy });
  }
  const regression = fitLinearRegression(points);
  const tomorrowForecast = regression.predict(31);

  if (tomorrowForecast > 90) {
    list.push({
      type: 'capacity',
      priority: 'high',
      title: 'High Occupancy Forecast',
      recommendation: 'High demand expected. Open additional hot desks.',
      branch: branchName
    });
  }

  // --- SOURCE 2: Smart Load Scoring ---
  const totalRooms = await Room.countDocuments({ branch: branchLower });
  const roomsWithBookings = await Room.countDocuments({ 
    branch: branchLower, 
    'bookings.0': { $exists: true } 
  });
  const roomUtilizationRate = totalRooms > 0 ? (roomsWithBookings / totalRooms) * 100 : 0;

  const totalTickets = await Ticket.countDocuments({ branch: branchLower });
  const openTickets = await Ticket.countDocuments({ 
    branch: branchLower, 
    status: { $in: ['open', 'in progress'] } 
  });
  const ticketLoad = totalTickets > 0 ? (openTickets / totalTickets) * 100 : 0;

  const rooms = await Room.find({ branch: branchLower });
  let totalRoomBookings = 0;
  if (rooms) {
    rooms.forEach(r => {
      totalRoomBookings += r.bookings ? r.bookings.length : 0;
    });
  }
  const activeBookingsRate = Math.min(100, totalSeats > 0 ? ((occupiedSeats + totalRoomBookings) / totalSeats) * 100 : 0);

  const loadScore = Math.round(
    (occupancyRate * 0.50) + 
    (roomUtilizationRate * 0.25) + 
    (ticketLoad * 0.15) + 
    (activeBookingsRate * 0.10)
  );

  if (loadScore > 85) {
    list.push({
      type: 'capacity',
      priority: 'high',
      title: 'Critical Load Advisory',
      recommendation: 'Branch approaching capacity. Redirect bookings.',
      branch: branchName
    });
  } else if (loadScore < 50) {
    list.push({
      type: 'operations',
      priority: 'low',
      title: 'Low Utilization Alert',
      recommendation: 'Underutilized branch. Launch promotions.',
      branch: branchName
    });
  }

  // --- SOURCE 3: Renewal Intelligence (Logistic Regression inference churn risk below 50) ---
  const clients = await Client.find({ branch: branchLower });
  for (const client of clients) {
    const features = [
      client.occupancyDuration / 100,
      client.bookingFrequency / 100,
      client.roomUsage / 100,
      client.ticketSatisfaction / 100,
      client.recentActivity / 100
    ];
    
    const renewalProbability = Math.round(mlModel.predict(features) * 100);

    if (renewalProbability < 50) {
      list.push({
        type: 'retention',
        priority: 'high',
        title: `High Churn Risk: ${client.company}`,
        recommendation: 'Retention intervention recommended.',
        branch: branchName
      });
    }
  }

  // --- SOURCE 4: Support Ticket Queue backlog ---
  if (openTickets > 3) {
    list.push({
      type: 'support',
      priority: 'medium',
      title: 'Support Queue Backlog',
      recommendation: 'Allocate additional support resources.',
      branch: branchName
    });
  }

  // Always return some standard operations tasks if nothing else triggered
  if (list.length === 0) {
    list.push({
      type: 'operations',
      priority: 'low',
      title: 'Optimized Workspace Schedule',
      recommendation: 'Maintain standard workspace maintenance routines.',
      branch: branchName
    });
  }

  return list;
};

// @desc    Retrieve dynamic operations recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    let targetBranches = [];

    if (req.user.role === 'admin') {
      if (req.query.branch && req.query.branch.toLowerCase() !== 'all') {
        targetBranches = [req.query.branch.toLowerCase()];
      } else {
        targetBranches = SEED_BRANCHES;
      }
    } else if (req.user.role === 'manager' || req.user.role === 'receptionist') {
      if (!req.user.branch) {
        return res.status(400).json({ error: 'Access Denied: Assigned branch is missing from user profile.' });
      }
      const assignedBranch = req.user.branch.toLowerCase();
      targetBranches = [assignedBranch];

      if (req.query.branch && req.query.branch.toLowerCase() !== assignedBranch) {
        return res.status(403).json({
          error: `Access Forbidden: Scope restricted to your assigned branch: ${req.user.branch}.`
        });
      }
    } else {
      return res.status(403).json({ error: 'Access Forbidden: Unauthorized role access.' });
    }

    const results = await Promise.all(
      targetBranches.map(branch => generateRecommendationsForBranch(branch))
    );

    const flattened = results.flat();

    const priorityWeight = { 'high': 3, 'medium': 2, 'low': 1 };
    flattened.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

    console.log(`🤖 AI recommendations generated for user: ${req.user.email} (Count: ${flattened.length})`);
    res.status(200).json(flattened);
  } catch (error) {
    console.error(`❌ getRecommendations controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to compile AI recommendations feed.' });
  }
};

module.exports = {
  getRecommendations
};
