const Ticket = require('../models/Ticket');

// Helper response formatter
const formatTicketResponse = (t) => ({
  _id: t._id,
  title: t.title,
  description: t.description,
  status: t.status,
  priority: t.priority,
  branch: t.branch,
  reportedBy: t.reportedBy,
  assignedStaff: t.assignedStaff,
  resolutionNotes: t.resolutionNotes,
  resolvedAt: t.resolvedAt,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt
});

// @desc    Retrieve all tickets optionally filtered by branch (role restricted)
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    const { branch } = req.query;
    const filter = {};

    let queryBranch = branch ? branch.toLowerCase() : null;

    // Role Lock: Non-admins can only view their branch tickets
    if (req.user.role !== 'admin') {
      queryBranch = req.user.branch.toLowerCase();
    }

    if (queryBranch) {
      filter.branch = queryBranch;
    }

    const tickets = await Ticket.find(filter).sort({ updatedAt: -1 });
    res.status(200).json(tickets.map(formatTicketResponse));
  } catch (error) {
    console.error(`❌ getTickets controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve support tickets.' });
  }
};

// @desc    Raise a new support ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  try {
    const { title, description, priority, reportedBy, branch } = req.body;

    if (!title || !description || !reportedBy) {
      return res.status(400).json({ error: 'Please provide ticket title, description, and reporter.' });
    }

    let ticketBranch = branch;
    if (req.user.role !== 'admin') {
      ticketBranch = req.user.branch;
    }

    if (!ticketBranch) {
      return res.status(400).json({ error: 'Reporting branch is required.' });
    }

    const newTicket = new Ticket({
      title,
      description,
      priority: priority || 'medium',
      reportedBy,
      branch: ticketBranch.toLowerCase(),
      assignedStaff: 'Unassigned'
    });

    await newTicket.save();
    console.log(`🎟️ New Ticket raised: "${title}" at ${newTicket.branch} (Reported by: ${reportedBy})`);

    res.status(201).json(formatTicketResponse(newTicket));
  } catch (error) {
    console.error(`❌ createTicket controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to submit support ticket.' });
  }
};

// @desc    Update support ticket details or resolve it
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedStaff, resolutionNotes } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Support ticket not found.' });
    }

    // Role Lock: Non-admins can only modify tickets belonging to their branch
    if (req.user.role !== 'admin' && ticket.branch.toLowerCase() !== req.user.branch.toLowerCase()) {
      return res.status(403).json({
        error: `Access Forbidden: You are only authorized to manage support tickets at your branch '${req.user.branch}'.`
      });
    }

    // Update details
    if (status !== undefined) {
      ticket.status = status;
      if (status === 'resolved') {
        ticket.resolvedAt = Date.now();
      }
    }
    if (priority !== undefined) ticket.priority = priority;
    if (assignedStaff !== undefined) ticket.assignedStaff = assignedStaff;
    if (resolutionNotes !== undefined) ticket.resolutionNotes = resolutionNotes;

    await ticket.save();
    console.log(`🎟️ Ticket updated: "${ticket.title}" set to status: ${ticket.status} (Priority: ${ticket.priority})`);

    res.status(200).json(formatTicketResponse(ticket));
  } catch (error) {
    console.error(`❌ updateTicket controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to update support ticket.' });
  }
};

module.exports = {
  getTickets,
  createTicket,
  updateTicket
};
