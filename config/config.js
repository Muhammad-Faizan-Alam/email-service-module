// require('dotenv').config();

// module.exports = {
//   server: {
//     port: process.env.PORT || 3000,
//     nodeEnv: process.env.NODE_ENV || 'development',
//     corsOrigin: process.env.CORS_ORIGIN || '*'
//   },
//   security: {
//     apiKey: process.env.API_KEY
//   }
//   // No email config here - it comes from users!
// };


// for vercel deployment:
require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },
  security: {
    apiKey: process.env.API_KEY || 'default-api-key-for-development'
  }
};