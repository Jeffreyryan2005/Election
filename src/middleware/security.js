/**
 * Security Middleware
 * 
 * Implements additional security measures beyond Helmet including
 * input sanitization, request validation, and security headers.
 * 
 * @module middleware/security
 */

const rateLimit = require('express-rate-limit');
const validator = require('validator');
const { logger } = require('../utils/logger');

/**
 * Rate limiter for API endpoints
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path });
    res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: '15 minutes',
    });
  },
});

/**
 * Stricter rate limiter for AI assistant endpoint
 */
const assistantLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // 15 requests per minute
  message: {
    error: 'Too many AI requests. Please wait a moment.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Sanitize input to prevent XSS and injection attacks
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  // Use validator to escape HTML
  let sanitized = validator.escape(input);
  
  // Strip dangerous protocols and event handlers (extra layer)
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .trim()
    .slice(0, 3000); // Limit length slightly more generous than before
    
  return sanitized;
}

/**
 * Custom security middleware
 */
function securityMiddleware(req, res, next) {
  // Add comprehensive security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Sanitize body inputs
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      } else if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key].map(item => 
          typeof item === 'string' ? sanitizeInput(item) : item
        );
      }
    }
  }

  // Sanitize query params
  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeInput(req.query[key]);
      }
    }
  }

  next();
}

module.exports = { 
  securityMiddleware, 
  apiLimiter, 
  assistantLimiter, 
  sanitizeInput 
};

