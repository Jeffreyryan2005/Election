/**
 * API Routes
 * 
 * RESTful endpoints for election data including timeline,
 * FAQs, quiz questions, voter checklist, and statistics.
 * 
 * @module routes/api
 */

const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../middleware/security');
const {
  electionTimeline,
  voterChecklist,
  frequentlyAskedQuestions,
  electionStats,
  quizQuestions,
} = require('../data/electionData');

// Apply rate limiting to all API routes
router.use(apiLimiter);

/**
 * GET /api/timeline
 * Returns the complete election process timeline
 */
router.get('/timeline', (req, res) => {
  res.json({
    success: true,
    data: electionTimeline,
    count: electionTimeline.length,
  });
});

/**
 * GET /api/timeline/:id
 * Returns a specific phase of the election timeline
 */
router.get('/timeline/:id', (req, res) => {
  const phase = electionTimeline.find(t => t.id === req.params.id);
  
  if (!phase) {
    return res.status(404).json({
      success: false,
      error: 'Timeline phase not found',
    });
  }

  res.json({ success: true, data: phase });
});

/**
 * GET /api/faq
 * Returns frequently asked questions, optionally filtered by category
 */
router.get('/faq', (req, res) => {
  const { category } = req.query;
  let faqs = frequentlyAskedQuestions;

  if (category) {
    faqs = faqs.filter(f => f.category === category);
  }

  res.json({
    success: true,
    data: faqs,
    count: faqs.length,
    categories: [...new Set(frequentlyAskedQuestions.map(f => f.category))],
  });
});

/**
 * GET /api/checklist
 * Returns the voter preparation checklist
 */
router.get('/checklist', (req, res) => {
  res.json({
    success: true,
    data: voterChecklist,
    count: voterChecklist.length,
  });
});

/**
 * GET /api/stats
 * Returns election statistics
 */
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: electionStats,
  });
});

/**
 * GET /api/quiz
 * Returns quiz questions (without correct answers for client-side validation)
 */
router.get('/quiz', (req, res) => {
  // Shuffle questions and return without correct answers
  const shuffled = [...quizQuestions]
    .sort(() => Math.random() - 0.5)
    .map(({ id, question, options }) => ({ id, question, options }));

  res.json({
    success: true,
    data: shuffled,
    count: shuffled.length,
  });
});

/**
 * POST /api/quiz/check
 * Validates quiz answers and returns results
 */
router.post('/quiz/check', (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an array of answers',
    });
  }

  const results = answers.map(({ questionId, selectedOption }) => {
    const question = quizQuestions.find(q => q.id === questionId);
    
    if (!question) {
      return { questionId, correct: false, error: 'Question not found' };
    }

    const isCorrect = question.correct === selectedOption;
    return {
      questionId,
      correct: isCorrect,
      correctAnswer: question.correct,
      explanation: question.explanation,
    };
  });

  const score = results.filter(r => r.correct).length;
  const total = results.length;
  const percentage = Math.round((score / total) * 100);

  let grade, message;
  if (percentage >= 90) { grade = 'A+'; message = '🎉 Outstanding! You\'re an election expert!'; }
  else if (percentage >= 70) { grade = 'A'; message = '👏 Great job! You know your elections well!'; }
  else if (percentage >= 50) { grade = 'B'; message = '👍 Good effort! Keep learning about democracy.'; }
  else { grade = 'C'; message = '📚 Keep exploring! Democracy is worth understanding.'; }

  res.json({
    success: true,
    data: {
      results,
      score,
      total,
      percentage,
      grade,
      message,
    },
  });
});

module.exports = router;
