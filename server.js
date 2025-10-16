// const Application = require('./src/app');

// // Create and start application
// const app = new Application();
// app.start();

// // Graceful shutdown
// process.on('SIGINT', () => {
//   console.log('\n🛑 Shutting down email service...');
//   process.exit(0);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });

// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
//   process.exit(1);
// });


//  for vercel deployment:
require('dotenv').config();
const app = require('./src/app');

// Vercel provides the port via environment variable
const PORT = process.env.PORT || 3000;

// Export the app for Vercel
module.exports = app;

// Only listen if not in Vercel environment
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('🚀 Email Service started successfully!');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log('📧 Ready to send emails!');
  });
}