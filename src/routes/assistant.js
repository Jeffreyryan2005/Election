/**
 * AI Assistant Routes
 * 
 * Handles chat interactions with the Google Gemini-powered
 * election education assistant.
 * 
 * @module routes/assistant
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { assistantLimiter } = require('../middleware/security');
const { generateResponse } = require('../utils/gemini');
const { logger } = require('../utils/logger');

// Apply stricter rate limiting for AI endpoints
router.use(assistantLimiter);

/**
 * POST /api/assistant/chat
 * Send a message to the AI assistant and receive a response
 * 
 * Request body:
 *   - message: string (required, 1-2000 chars)
 *   - history: array (optional, conversation history)
 * 
 * Response:
 *   - success: boolean
 *   - data: { response: string }
 */
router.post(
  '/chat',
  [
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 1, max: 2000 })
      .withMessage('Message must be between 1 and 2000 characters'),
    body('history')
      .optional()
      .isArray({ max: 20 })
      .withMessage('History must be an array with max 20 entries'),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => e.msg),
      });
    }

    const { message, history = [] } = req.body;

    try {
      logger.info('Assistant request received', { 
        messageLength: message.length,
        historyLength: history.length,
      });

      const response = await generateResponse(message, history);

      res.json({
        success: true,
        data: { response },
      });
    } catch (error) {
      logger.error('Assistant error:', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to generate response. Please try again.',
      });
    }
  }
);

/**
 * GET /api/assistant/suggestions
 * Returns suggested questions for the user
 */
router.get('/suggestions', (req, res) => {
  const suggestions = [
    { id: 's1', text: 'How do I register as a voter?', icon: '📋' },
    { id: 's2', text: 'What happens on polling day?', icon: '🗳️' },
    { id: 's3', text: 'What is EVM and VVPAT?', icon: '🖥️' },
    { id: 's4', text: 'Explain the election timeline', icon: '📅' },
    { id: 's5', text: 'What is NOTA?', icon: '❌' },
    { id: 's6', text: 'How are votes counted?', icon: '📊' },
    { id: 's7', text: 'Can NRIs vote in India?', icon: '🌍' },
    { id: 's8', text: 'What is Model Code of Conduct?', icon: '⚖️' },
  ];

  res.json({ success: true, data: suggestions });
});

module.exports = router;
