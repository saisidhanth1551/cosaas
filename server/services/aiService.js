const { Ollama } = require('ollama');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// COSMO AI Core System Instructions
const systemPrompt = `You are COSMO.
COSMO is an AI business intelligence assistant for coworking spaces.

Core Operational Rules:
1. Use ONLY the provided business context data.
2. NEVER invent, extrapolate, or hallucinate metrics, percentages, or numbers.
3. Provide concise, high-impact executive-level insights.
4. Keep the focus on occupancy patterns, branch load health, client renewals, and capacity optimization.
5. Return concrete, actionable recommendations based on the data.`;

/**
 * Generates an AI business insight supporting both local Ollama (qwen2.5:3b) and Google Gemini (gemini-2.5-flash).
 * @param {Object|string} context - The workspace analytics context or branch data metrics.
 * @param {string} userQuestion - The specific executive question or query.
 * @returns {Promise<string>} The generated insight response text.
 */
const generateBusinessInsight = async (context, userQuestion) => {
  const provider = (process.env.AI_PROVIDER || 'ollama').toLowerCase();
  const formattedContext = typeof context === 'object' ? JSON.stringify(context, null, 2) : context;

  const userPrompt = `### BUSINESS DATA CONTEXT:
${formattedContext}

### USER QUESTION:
${userQuestion}

Please output your COSMO executive insight below:`;

  try {
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables.');
      }

      console.log('🤖 COSMO Agent: Routing request to cloud Google Gemini (gemini-2.5-flash)...');
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemPrompt
      });

      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim().length > 0) {
        return text.trim();
      }
      throw new Error('Gemini response body was empty.');
    } else {
      // Default to Ollama local instance
      console.log('🤖 COSMO Agent: Routing request to local Ollama (qwen2.5:3b)...');
      
      const ollama = new Ollama({ host: 'http://localhost:11434' });
      const response = await ollama.chat({
        model: 'qwen2.5:3b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        options: {
          temperature: 0.1, // Keep answers highly deterministic
          num_predict: 500  // Limit generation bounds for fast response times
        }
      });

      if (response && response.message && response.message.content) {
        return response.message.content.trim();
      }
      throw new Error('Ollama response body was empty.');
    }
  } catch (error) {
    console.error(`❌ COSMO AI Service Failure [Provider: ${provider.toUpperCase()}]: ${error.message}`);
    // Friendly error messaging fallback
    return `⚠️ AI service temporarily unavailable. (Reason: ${error.message})`;
  }
};

module.exports = {
  generateBusinessInsight
};
