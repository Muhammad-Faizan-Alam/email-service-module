const emailService = require('../services/emailService');

const emailController = {
  // Test SMTP configuration
  async testSmtpConfig(req, res) {
    try {
      const { smtpConfig } = req.body;

      if (!smtpConfig) {
        return res.status(400).json({
          success: false,
          error: 'SMTP configuration is required'
        });
      }

      const result = await emailService.testSmtpConfig(smtpConfig);
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Send generic email
  async sendEmail(req, res) {
    try {
      const { smtpConfig, ...emailData } = req.body;

      if (!smtpConfig) {
        return res.status(400).json({
          success: false,
          error: 'SMTP configuration is required'
        });
      }

      const result = await emailService.sendEmail({
        ...emailData,
        smtpConfig
      });
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Email sent successfully',
          data: {
            messageId: result.messageId
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Send contact form email
  async sendContact(req, res) {
    try {
      const { name, email, message, subject, smtpConfig, contactEmail } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, and message are required'
        });
      }

      if (!smtpConfig) {
        return res.status(400).json({
          success: false,
          error: 'SMTP configuration is required'
        });
      }

      const result = await emailService.sendContactForm({
        name,
        email,
        message,
        subject,
        smtpConfig,
        contactEmail
      });
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Contact email sent successfully',
          data: {
            messageId: result.messageId
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Send verification email
  async sendVerification(req, res) {
    try {
      const { to, name, verificationUrl, smtpConfig } = req.body;

      if (!to || !name || !verificationUrl) {
        return res.status(400).json({
          success: false,
          error: 'To, name, and verificationUrl are required'
        });
      }

      if (!smtpConfig) {
        return res.status(400).json({
          success: false,
          error: 'SMTP configuration is required'
        });
      }

      const result = await emailService.sendVerificationEmail({
        to,
        name,
        verificationUrl,
        smtpConfig
      });
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Verification email sent successfully',
          data: {
            messageId: result.messageId
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Send password reset email
  async sendPasswordReset(req, res) {
    try {
      const { to, name, resetUrl, smtpConfig } = req.body;

      if (!to || !name || !resetUrl) {
        return res.status(400).json({
          success: false,
          error: 'To, name, and resetUrl are required'
        });
      }

      if (!smtpConfig) {
        return res.status(400).json({
          success: false,
          error: 'SMTP configuration is required'
        });
      }

      const result = await emailService.sendPasswordReset({
        to,
        name,
        resetUrl,
        smtpConfig
      });
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Password reset email sent successfully',
          data: {
            messageId: result.messageId
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Send welcome email
  async sendWelcome(req, res) {
    try {
      const { to, name, smtpConfig } = req.body;

      if (!to || !name) {
        return res.status(400).json({
          success: false,
          error: 'To and name are required'
        });
      }

      if (!smtpConfig) {
        return res.status(400).json({
          success: false,
          error: 'SMTP configuration is required'
        });
      }

      const result = await emailService.sendWelcomeEmail({
        to,
        name,
        smtpConfig
      });
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Welcome email sent successfully',
          data: {
            messageId: result.messageId
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Health check
  async healthCheck(req, res) {
    res.json({
      success: true,
      message: 'Email service is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
};

module.exports = emailController;