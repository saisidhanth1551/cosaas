const { Ollama } = require('ollama');

// Initialize Ollama instance pointing to the requested local instance
const ollama = new Ollama({ host: 'http://localhost:11434' });

/**
 * Generates an AI business insight using local Qwen2.5:3b via Ollama.
 * @param {Object|string} context - The workspace analytics context or branch data metrics.
 * @param {string} userQuestion - The specific executive question or query.
 * @returns {Promise<string>} The generated insight response text.
 */
const generateBusinessInsight = async (context, userQuestion) => {
  try {
    const formattedContext = typeof context === 'object' ? JSON.stringify(context, null, 2) : context;

    const systemPrompt = `You are COSMO.
COSMO is an AI business intelligence assistant for coworking spaces.

Core Operational Rules:
1. Use ONLY the provided business context data.
2. NEVER invent, extrapolate, or hallucinate metrics, percentages, or numbers.
3. Provide concise, high-impact executive-level insights.
4. Keep the focus on occupancy patterns, branch load health, client renewals, and capacity optimization.
5. Return concrete, actionable recommendations based on the data.`;

    const userPrompt = `### BUSINESS DATA CONTEXT:
${formattedContext}

### USER QUESTION:
${userQuestion}

Please output your COSMO executive insight below:`;

    // Fetch response from local Qwen model
    const response = await ollama.chat({
      model: 'qwen2.5:3b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      options: {
        temperature: 0.1, // Keep answers highly deterministic and grounded in context
        num_predict: 500 // Limit token counts to optimize for fast execution
      }
    });

    if (response && response.message && response.message.content) {
      return response.message.content.trim();
    }

    throw new Error('Response received from Ollama was empty or malformed.');
  } catch (error) {
    console.error(`❌ COSMO AI Service Error: ${error.message}`);
    return `⚠️ COSMO Insight Interruption: Failed to formulate executive advice. Ensure local Ollama service is running on http://localhost:11434 and 'qwen2.5:3b' is loaded. (Error: ${error.message})`;
  }
};

module.exports = {
  generateBusinessInsight
};
