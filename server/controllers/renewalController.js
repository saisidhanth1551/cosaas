const Client = require('../models/Client');
const { trainLogisticRegression } = require('../utils/mlEngine');

// Train model on startup/request
const mlModel = trainLogisticRegression();

// @desc    Retrieve dynamic client renewal predictions and risk scores
// @route   GET /api/renewal-predictions
// @access  Private (Requires authenticated user JWT session context)
const getRenewalPredictions = async (req, res) => {
  try {
    const filter = {};
    let selectedBranch = 'all';

    // 1. Role-Based Access Control (RBAC) & Branch Filtering
    if (req.user.role === 'admin') {
      // Admins are authorized to view all branches, or filter by a specific branch
      if (req.query.branch && req.query.branch.toLowerCase() !== 'all') {
        selectedBranch = req.query.branch.toLowerCase();
        filter.branch = selectedBranch;
      }
    } else if (req.user.role === 'manager' || req.user.role === 'receptionist') {
      // Managers and Receptionists are strictly constrained to their assigned branch
      if (!req.user.branch) {
        return res.status(400).json({ error: 'Access Denied: Your user account profile does not specify an assigned branch.' });
      }
      selectedBranch = req.user.branch.toLowerCase();
      filter.branch = selectedBranch;

      // Block access if they attempt to request a different branch via query parameter
      if (req.query.branch && req.query.branch.toLowerCase() !== selectedBranch) {
        return res.status(403).json({
          error: `Access Forbidden: Your role is restricted to your assigned branch: ${req.user.branch}. You are not authorized to view renewals for other branches.`
        });
      }
    } else {
      return res.status(403).json({ error: 'Access Forbidden: Unauthorized role access.' });
    }

    // 2. Fetch clients matching the filter constraints
    const clients = await Client.find(filter);

    // 3. Process each client and compute dynamic renewal probability, risk levels, and recommendations
    const processedClients = clients.map(client => {
      const {
        _id,
        clientName,
        company,
        branch,
        contractStartDate,
        contractEndDate,
        email,
        phone,
        occupancyDuration,
        bookingFrequency,
        roomUsage,
        ticketSatisfaction,
        recentActivity
      } = client;

      // Machine Learning dynamic inference using learned weights and bias
      const features = [
        occupancyDuration / 100,
        bookingFrequency / 100,
        roomUsage / 100,
        ticketSatisfaction / 100,
        recentActivity / 100
      ];
      
      const renewalProbability = Math.round(mlModel.predict(features) * 100);

      // Determine Risk Level & Recommendation based on score thresholds
      let riskLevel = 'Medium Risk';
      let recommendation = 'Maintain engagement.';

      if (renewalProbability >= 80) {
        riskLevel = 'Low Risk';
        recommendation = 'Likely to renew. Explore upsell opportunities.';
      } else if (renewalProbability < 50) {
        riskLevel = 'High Risk';
        recommendation = 'Retention intervention recommended.';
      }

      return {
        _id,
        clientName,
        company,
        branch,
        contractStartDate,
        contractEndDate,
        email,
        phone,
        metrics: {
          occupancyDuration,
          bookingFrequency,
          roomUsage,
          ticketSatisfaction,
          recentActivity
        },
        renewalProbability,
        riskLevel,
        recommendation
      };
    });

    console.log(`🧠 CRM Renewal Intelligence: Compiled predictions for user: ${req.user.email} (Role: ${req.user.role}, Branch Scope: ${selectedBranch}, Clients found: ${processedClients.length})`);

    res.status(200).json(processedClients);
  } catch (error) {
    console.error(`❌ getRenewalPredictions controller error: ${error.message}`);
    res.status(500).json({ error: 'Failed to compute client renewal probability intelligence.' });
  }
};

module.exports = {
  getRenewalPredictions
};
