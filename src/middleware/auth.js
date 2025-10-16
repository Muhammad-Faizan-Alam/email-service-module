const config = require('../../config/config');

const authenticateApiKey = (req, res, next) => {
  // Skip authentication in development
  if (config.server.nodeEnv === 'development') {
    return next();
  }

  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required'
    });
  }

  if (apiKey !== config.security.apiKey) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API key'
    });
  }

  next();
};

module.exports = { authenticateApiKey };