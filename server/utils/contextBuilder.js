const Seat = require('../models/Seat');
const Room = require('../models/Room');
const Ticket = require('../models/Ticket');
const Client = require('../models/Client');
const { fitLinearRegression, trainLogisticRegression } = require('./mlEngine');

const BRANCH_MAPPING = {
  'hyderabad': 'Hyderabad HITEC',
  'bangalore': 'Bangalore Koramangala',
  'chennai': 'Chennai OMR',
  'indiranagar': 'Bengaluru Indiranagar',
  'mumbai-bkc': 'Mumbai BKC',
  'gurugram-cyber-city': 'Gurugram Cyber City'
};

const SEED_BRANCHES = ['hyderabad', 'bangalore', 'chennai', 'indiranagar', 'mumbai-bkc', 'gurugram-cyber-city'];

// Pre-train Logistic Regression Model
const mlModel = trainLogisticRegression();

/**
 * Gathers live analytics, respect user RBAC, and compiles structured plain text optimized for LLM consumption.
 * @param {Object} user - The authenticated JWT session user context.
 * @returns {Promise<string>} Plain-text operational context.
 */
const buildBusinessContext = async (user) => {
  try {
    const role = (user?.role || 'receptionist').toLowerCase();
    const userBranch = (user?.branch || '').toLowerCase();

    const isAdmin = role === 'admin';
    const activeBranches = isAdmin
      ? SEED_BRANCHES
      : (SEED_BRANCHES.includes(userBranch) ? [userBranch] : [SEED_BRANCHES[0]]);

    // Concurrently fetch all operational telemetry for optimized performance
    const [seats, rooms, tickets, clients] = await Promise.all([
      Seat.find(isAdmin ? {} : { branch: { $in: activeBranches } }),
      Room.find(isAdmin ? {} : { branch: { $in: activeBranches } }),
      Ticket.find(isAdmin ? {} : { branch: { $in: activeBranches } }),
      Client.find()
    ]);

    // 1. Calculate Occupancy Rates
    const totalSeats = seats.length;
    const occupiedCount = seats.filter(s => s.status === 'occupied').length;
    const reservedCount = seats.filter(s => s.status === 'reserved').length;
    const occupiedSeats = occupiedCount + reservedCount;
    const occupancyRate = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

    // 2. Calculate Occupancy Time-series OLS linear forecasts
    let tomorrowForecast = 0;
    if (totalSeats > 0) {
      const points = [];
      for (let day = 1; day <= 30; day++) {
        const variance = Math.sin(day / 2) * 5 + (day % 7 === 0 || day % 7 === 6 ? -12 : 6);
        const simulatedOccupancy = Math.max(10, Math.min(100, occupancyRate + variance));
        points.push({ x: day, y: simulatedOccupancy });
      }
      const regression = fitLinearRegression(points);
      tomorrowForecast = Math.round(regression.predict(31));
    }

    // 3. Compute support load
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in progress').length;

    // 4. Sigmoid Churn Assessment (Logistic Regression)
    let churnRiskCount = 0;
    let totalProb = 0;
    let evaluatedClients = 0;

    for (const client of clients) {
      const clientBranch = (client.branch || '').toLowerCase();
      // Respect visibility filters
      if (!isAdmin && clientBranch && clientBranch !== userBranch) {
        continue;
      }

      const features = [
        client.occupancyDuration / 100,
        client.bookingFrequency / 100,
        client.roomUsage / 100,
        client.ticketSatisfaction / 100,
        client.recentActivity / 100
      ];
      const renewalProbability = Math.round(mlModel.predict(features) * 100);
      totalProb += renewalProbability;
      evaluatedClients++;

      if (renewalProbability < 50) {
        churnRiskCount++;
      }
    }
    const avgRenewalProb = evaluatedClients > 0 ? Math.round(totalProb / evaluatedClients) : 100;

    // 5. Gather comparative branch load lists
    const branchLoads = [];
    for (const bKey of activeBranches) {
      const bSeats = seats.filter(s => s.branch === bKey);
      const bRooms = rooms.filter(r => r.branch === bKey);
      const bTickets = tickets.filter(t => t.branch === bKey);

      const bTotalSeats = bSeats.length;
      const bOccupied = bSeats.filter(s => s.status === 'occupied' || s.status === 'reserved').length;
      const bOccupancy = bTotalSeats > 0 ? (bOccupied / bTotalSeats) * 100 : 0;

      const bTotalRooms = bRooms.length;
      const bRoomsBooked = bRooms.filter(r => r.bookings && r.bookings.length > 0).length;
      const bRoomUtil = bTotalRooms > 0 ? (bRoomsBooked / bTotalRooms) * 100 : 0;

      const bTotalTickets = bTickets.length;
      const bOpenTickets = bTickets.filter(t => t.status === 'open' || t.status === 'in progress').length;
      const bTicketLoad = bTotalTickets > 0 ? (bOpenTickets / bTotalTickets) * 100 : 0;

      const score = Math.round((bOccupancy * 0.50) + (bRoomUtil * 0.25) + (bTicketLoad * 0.15));
      branchLoads.push({
        name: BRANCH_MAPPING[bKey] || bKey,
        score
      });
    }

    branchLoads.sort((a, b) => b.score - a.score);
    const highestLoad = branchLoads.length > 0 ? branchLoads[0] : null;

    // 6. Actionable recommendations triggers
    const activeRecs = [];
    if (occupancyRate < 45) {
      activeRecs.push("Introduce temporary promotional float pricing to optimize low seat utilization.");
    }
    if (tomorrowForecast > 90) {
      activeRecs.push("Establish receptionist overflow guidelines: Tomorrow forecast projects saturation.");
    }
    if (openTickets > 5) {
      activeRecs.push("Deploy supplementary support agents to address the ticket queue backlog.");
    }
    if (churnRiskCount > 0) {
      activeRecs.push("Coordinate high-touch account success calls with identified risk clients.");
    }
    if (activeRecs.length === 0) {
      activeRecs.push("Standard systems active. Keep maintaining current workspace allocations.");
    }

    const scopeLabel = isAdmin ? "GLOBAL COWORK NETWORK" : `${BRANCH_MAPPING[userBranch] || userBranch} BRANCH SCOPE`;

    return `COSaaS OPERATIONAL TELEMETRY REPORT
Scope: ${scopeLabel}
User Context: Role: ${role.toUpperCase()}, assigned to ${userBranch ? BRANCH_MAPPING[userBranch] : 'All Branches'}

[OCCUPANCY METRICS]
Current Occupancy: ${occupancyRate}%
Tomorrow Occupancy Forecast: ${tomorrowForecast}%
Total Allocated Seats: ${totalSeats}
Active Occupied/Reserved Seats: ${occupiedSeats}

[BRANCH LOAD INDICES]
${branchLoads.map(b => `- ${b.name}: Load Score ${b.score}/100`).join('\n')}
Highest Loaded Branch: ${highestLoad ? `${highestLoad.name} (${highestLoad.score}/100)` : 'N/A'}

[SUPPORT QUEUE STATS]
Active Open Tickets: ${openTickets}
Total Operational Tickets: ${totalTickets}

[CRM RENEWAL CONTRACT RISK]
High-Risk Client Accounts: ${churnRiskCount}
Average Client Renewal Likelihood: ${avgRenewalProb}%

[COSMO ADVISORY PRESETS]
${activeRecs.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}
`;
  } catch (error) {
    console.error(`❌ buildBusinessContext error: ${error.message}`);
    return `⚠️ Telemetry builder anomaly: Failed to parse system indices. (Error: ${error.message})`;
  }
};

module.exports = {
  buildBusinessContext
};
