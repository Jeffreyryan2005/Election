/**
 * Election Process Education Assistant - Main Server
 * 
 * A comprehensive, AI-powered web application that helps users
 * understand the election process, timelines, and steps using
 * Google Gemini for intelligent Q&A.
 * 
 * @module server
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const hpp = require('hpp');
const path = require('path');
const { logger } = require('./src/utils/logger');
const { securityMiddleware } = require('./src/middleware/security');
const apiRoutes = require('./src/routes/api');
const assistantRoutes = require('./src/routes/assistant');

const app = express();
const PORT = process.env.PORT || 8080;

// ── Security Middleware ─────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || true
    : true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

app.use(hpp());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Custom Security Middleware ──────────────────────────────
app.use(securityMiddleware);

// ── Static Files ────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true,
  lastModified: true,
}));

// ── API Routes ──────────────────────────────────────────────
app.use('/api', apiRoutes);
app.use('/api/assistant', assistantRoutes);

// ── Health Check Endpoint ───────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// ── SPA Fallback ────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Error Handling ──────────────────────────────────────────
app.use((err, req, res, _next) => {
  logger.error('Unhandled error:', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
  });
});

// ── Start Server ────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`🗳️  Election Education Assistant running on port ${PORT}`);
    logger.info(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`   Health: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
