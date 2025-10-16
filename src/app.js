// const express = require('express');
// const cors = require('cors');
// const config = require('../config/config');

// // Import routes
// const emailRoutes = require('./routes/emailRoutes');

// class Application {
//   constructor() {
//     this.app = express();
//     this.setupMiddleware();
//     this.setupRoutes();
//     this.setupErrorHandling();
//   }

//   setupMiddleware() {
//     // CORS
//     this.app.use(cors({
//       origin: config.server.corsOrigin,
//       methods: ['GET', 'POST', 'PUT', 'DELETE'],
//       allowedHeaders: ['Content-Type', 'x-api-key']
//     }));

//     // Body parsing middleware
//     this.app.use(express.json({ limit: '10mb' }));
//     this.app.use(express.urlencoded({ extended: true }));

//     // Request logging
//     this.app.use((req, res, next) => {
//       console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//       next();
//     });
//   }

//   setupRoutes() {
//     // API routes
//     this.app.use('/api/email', emailRoutes);

//     // Root endpoint
//     this.app.get('/', (req, res) => {
//       res.json({
//         message: 'Reusable Email Service API',
//         version: '1.0.0',
//         endpoints: {
//           health: 'GET /api/email/health',
//           testSmtp: 'POST /api/email/test-smtp',
//           sendEmail: 'POST /api/email/send',
//           contact: 'POST /api/email/contact',
//           verification: 'POST /api/email/verification',
//           passwordReset: 'POST /api/email/password-reset',
//           welcome: 'POST /api/email/welcome'
//         },
//         documentation: 'Check README.md for usage instructions'
//       });
//     });

//     // 404 handler - FIXED: Use proper wildcard handling
//     // 404 handler - Alternative approach
//     this.app.use((req, res) => {
//       res.status(404).json({
//         success: false,
//         error: `Route ${req.method} ${req.originalUrl} not found`,
//         availableEndpoints: [
//           'GET /',
//           'GET /api/email/health',
//           'POST /api/email/test-smtp',
//           'POST /api/email/send',
//           'POST /api/email/contact',
//           'POST /api/email/verification',
//           'POST /api/email/password-reset',
//           'POST /api/email/welcome'
//         ]
//       });
//     });
//   }

//   setupErrorHandling() {
//     // Global error handler
//     this.app.use((error, req, res, next) => {
//       console.error('Unhandled error:', error);
//       res.status(500).json({
//         success: false,
//         error: 'Internal server error'
//       });
//     });
//   }

//   start() {
//     const port = config.server.port;
//     this.app.listen(port, () => {
//       console.log('🚀 Email Service started successfully!');
//       console.log(`📍 Environment: ${config.server.nodeEnv}`);
//       console.log(`📍 Port: ${port}`);
//       console.log(`📍 URL: http://localhost:${port}`);
//       console.log('📧 Ready to send emails!');
//     });
//   }
// }

// module.exports = Application;


// for vercel deployment:
const express = require('express');
const cors = require('cors');
const config = require('../config/config');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || config.server.corsOrigin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/email', emailRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Reusable Email Service API - Deployed on Vercel',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: 'GET /api/email/health',
      testSmtp: 'POST /api/email/test-smtp',
      sendEmail: 'POST /api/email/send',
      contact: 'POST /api/email/contact',
      verification: 'POST /api/email/verification',
      passwordReset: 'POST /api/email/password-reset',
      welcome: 'POST /api/email/welcome'
    },
    documentation: 'Use the endpoints with your SMTP credentials'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Email Service is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/email/health',
      'POST /api/email/test-smtp',
      'POST /api/email/send',
      'POST /api/email/contact',
      'POST /api/email/verification',
      'POST /api/email/password-reset',
      'POST /api/email/welcome'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = app;