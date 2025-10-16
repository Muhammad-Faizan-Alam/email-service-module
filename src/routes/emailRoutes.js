const express = require('express');
const emailController = require('../controllers/emailController');
const { authenticateApiKey } = require('../middleware/auth');
const { validateEmailRequest } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/health', emailController.healthCheck);

// Protected routes
router.use(authenticateApiKey);

// SMTP testing endpoint
router.post('/test-smtp', emailController.testSmtpConfig);

// Email endpoints
router.post('/send', validateEmailRequest, emailController.sendEmail);
router.post('/contact', emailController.sendContact);
router.post('/verification', emailController.sendVerification);
router.post('/password-reset', emailController.sendPasswordReset);
router.post('/welcome', emailController.sendWelcome);

module.exports = router;