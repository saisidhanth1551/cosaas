const { buildBusinessContext } = require('../utils/contextBuilder');
const { generateBusinessInsight } = require('../services/aiService');

/**
 * Handle incoming conversational AI queries for COSMO.
 * @route   POST /api/chat
 * @access  Private (JWT Token required)
 */
const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Validate empty/malformed queries
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Corporate query cannot be empty. Please ask COSMO a specific workspace analytics question.' });
    }

    // 2. Build structured telemetry context under RBAC rules
    let contextText;
    try {
      contextText = await buildBusinessContext(req.user);
    } catch (contextError) {
      console.error(`❌ Chat Context Generation Anomaly: ${contextError.message}`);
      return res.status(500).json({ error: 'Operational database error: Failed to compile local analytics scope.' });
    }

    // 3. Process query via local Ollama instance running qwen2.5:3b
    console.log(`🤖 COSMO Agent querying: "${message.trim()}" for user ${req.user.email} (${req.user.role.toUpperCase()})`);
    const answer = await generateBusinessInsight(contextText, message.trim());

    // 4. Handle Ollama offline state
    if (answer.startsWith('⚠️')) {
      return res.status(503).json({ error: 'COSMO Core model is currently offline. Please ensure your local Ollama port 11434 is running and qwen2.5:3b is pulled.' });
    }

    // 5. Success JSON response payload
    res.status(200).json({ answer });
  } catch (error) {
    console.error(`❌ Chat Controller Pipeline Exception: ${error.message}`);
    res.status(500).json({ error: 'Internal AI pipeline integration failure.' });
  }
};

module.exports = {
  handleChat
};
