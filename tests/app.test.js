/**
 * Test Suite for Election Process Education Assistant
 * Tests API endpoints, security, data integrity, and assistant logic
 */

const request = require('supertest');
const app = require('../server');

describe('Health Check', () => {
  test('GET /health returns 200 with status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('version');
  });
});

describe('Timeline API', () => {
  test('GET /api/timeline returns all phases', async () => {
    const res = await request(app).get('/api/timeline');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(7);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('title');
    expect(res.body.data[0]).toHaveProperty('description');
    expect(res.body.data[0]).toHaveProperty('keyPoints');
  });

  test('GET /api/timeline/:id returns specific phase', async () => {
    const res = await request(app).get('/api/timeline/polling');
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Polling Day');
  });

  test('GET /api/timeline/:id returns 404 for invalid id', async () => {
    const res = await request(app).get('/api/timeline/invalid');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('FAQ API', () => {
  test('GET /api/faq returns all FAQs', async () => {
    const res = await request(app).get('/api/faq');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('categories');
  });

  test('GET /api/faq?category=voting filters correctly', async () => {
    const res = await request(app).get('/api/faq?category=voting');
    expect(res.status).toBe(200);
    res.body.data.forEach(faq => {
      expect(faq.category).toBe('voting');
    });
  });
});

describe('Checklist API', () => {
  test('GET /api/checklist returns items', async () => {
    const res = await request(app).get('/api/checklist');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('title');
    expect(res.body.data[0]).toHaveProperty('description');
    expect(res.body.data[0]).toHaveProperty('icon');
  });
});

describe('Stats API', () => {
  test('GET /api/stats returns statistics', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

describe('Quiz API', () => {
  test('GET /api/quiz returns questions without answers', async () => {
    const res = await request(app).get('/api/quiz');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(10);
    // Should NOT contain correct answer
    res.body.data.forEach(q => {
      expect(q).not.toHaveProperty('correct');
      expect(q).not.toHaveProperty('explanation');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
    });
  });

  test('POST /api/quiz/check validates answers', async () => {
    const res = await request(app)
      .post('/api/quiz/check')
      .send({ answers: [{ questionId: 'q1', selectedOption: 1 }] });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('score');
    expect(res.body.data).toHaveProperty('percentage');
    expect(res.body.data).toHaveProperty('grade');
    expect(res.body.data.results[0]).toHaveProperty('explanation');
  });

  test('POST /api/quiz/check rejects invalid input', async () => {
    const res = await request(app)
      .post('/api/quiz/check')
      .send({ answers: 'invalid' });
    expect(res.status).toBe(400);
  });
});

describe('Assistant API', () => {
  test('POST /api/assistant/chat requires message', async () => {
    const res = await request(app)
      .post('/api/assistant/chat')
      .send({});
    expect(res.status).toBe(400);
  });

  test('POST /api/assistant/chat rejects empty message', async () => {
    const res = await request(app)
      .post('/api/assistant/chat')
      .send({ message: '' });
    expect(res.status).toBe(400);
  });

  test('POST /api/assistant/chat returns response', async () => {
    const res = await request(app)
      .post('/api/assistant/chat')
      .send({ message: 'How do I register to vote?' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('response');
    expect(res.body.data.response.length).toBeGreaterThan(0);
  });

  test('GET /api/assistant/suggestions returns suggestions', async () => {
    const res = await request(app).get('/api/assistant/suggestions');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('Security', () => {
  test('Returns security headers', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  test('Serves static files', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  test('SPA fallback serves index.html', async () => {
    const res = await request(app).get('/nonexistent-page');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});

describe('Data Integrity', () => {
  const { electionTimeline, quizQuestions, frequentlyAskedQuestions } = require('../src/data/electionData');

  test('Timeline phases are in correct order', () => {
    for (let i = 0; i < electionTimeline.length; i++) {
      expect(electionTimeline[i].phase).toBe(i + 1);
    }
  });

  test('Quiz questions have valid correct answers', () => {
    quizQuestions.forEach(q => {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
      expect(q.explanation).toBeTruthy();
    });
  });

  test('FAQs have required fields', () => {
    frequentlyAskedQuestions.forEach(f => {
      expect(f.id).toBeTruthy();
      expect(f.question).toBeTruthy();
      expect(f.answer).toBeTruthy();
      expect(f.category).toBeTruthy();
    });
  });
});

describe('Fallback Responses', () => {
  const { getFallbackResponse } = require('../src/utils/gemini');

  test('Returns registration info for voter registration queries', () => {
    const response = getFallbackResponse('How to register as a voter?');
    expect(response).toContain('Registration');
  });

  test('Returns voting info for polling queries', () => {
    const response = getFallbackResponse('How do I vote on polling day?');
    expect(response).toContain('Vote');
  });

  test('Returns default response for unknown queries', () => {
    const response = getFallbackResponse('random unrelated text xyz');
    expect(response).toContain('VoteGuide AI');
  });
});
