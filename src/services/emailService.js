const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
  constructor() {
    this.templateDir = path.join(__dirname, '../../email-templates');
  }

  // Create transporter with user-provided SMTP configuration
  createTransporter(smtpConfig) {
    return nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure || false,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
      // Additional options for better deliverability
      pool: true,
      maxConnections: 5,
      maxMessages: 100
    });
  }

  async sendEmail(emailOptions) {
    const {
      to,
      from,
      subject,
      template = null,
      templateData = {},
      text = null,
      html = null,
      attachments = [],
      cc = null,
      bcc = null,
      replyTo = null,
      // SMTP configuration from user
      smtpConfig
    } = emailOptions;

    // Validation
    if (!to) {
      throw new Error('Recipient email (to) is required');
    }
    if (!subject) {
      throw new Error('Email subject is required');
    }
    if (!template && !html && !text) {
      throw new Error('Either template, html, or text content is required');
    }
    if (!smtpConfig || !smtpConfig.host || !smtpConfig.user || !smtpConfig.pass) {
      throw new Error('SMTP configuration is required (host, user, pass)');
    }

    try {
      // Create transporter with user's SMTP config
      const transporter = this.createTransporter(smtpConfig);
      
      // Verify SMTP connection
      await transporter.verify();
      console.log(`✅ SMTP connection verified for: ${smtpConfig.user}`);

      let finalHtml = html;
      let finalText = text;

      // Render template if provided
      if (template) {
        finalHtml = await this.renderTemplate(template, templateData);
      }

      const mailOptions = {
        from: from || smtpConfig.user, // Use SMTP user as default from
        to: Array.isArray(to) ? to : [to],
        subject,
        cc,
        bcc,
        replyTo,
        attachments
      };

      // Add text or HTML content
      if (finalText) mailOptions.text = finalText;
      if (finalHtml) mailOptions.html = finalHtml;

      console.log(`📧 Sending email from: ${smtpConfig.user} to: ${to}`);
      
      const result = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Email sent successfully: ${result.messageId}`);
      
      // Close transporter connection
      transporter.close();
      
      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async renderTemplate(templateName, data) {
    try {
      const templatePath = path.join(this.templateDir, `${templateName}.ejs`);
      
      // Check if template exists
      try {
        await fs.access(templatePath);
      } catch {
        throw new Error(`Template '${templateName}' not found`);
      }

      const templateContent = await fs.readFile(templatePath, 'utf-8');
      return ejs.render(templateContent, data);
    } catch (error) {
      throw new Error(`Template rendering failed: ${error.message}`);
    }
  }

  // Predefined email methods with SMTP config
  async sendContactForm(data) {
    const { 
      name, 
      email, 
      message, 
      subject = 'Contact Form Submission',
      smtpConfig,
      contactEmail // Where to send contact form submissions
    } = data;
    
    return this.sendEmail({
      to: contactEmail || smtpConfig.user, // Fallback to SMTP user
      subject: `Contact Form: ${subject}`,
      template: 'contact',
      templateData: { name, email, message, subject },
      replyTo: email,
      smtpConfig
    });
  }

  async sendVerificationEmail(data) {
    const { 
      to, 
      name, 
      verificationUrl, 
      expiryTime = '24 hours',
      smtpConfig 
    } = data;
    
    return this.sendEmail({
      to,
      subject: 'Verify Your Email Address',
      template: 'verification',
      templateData: { name, verificationUrl, expiryTime },
      smtpConfig
    });
  }

  async sendPasswordReset(data) {
    const { 
      to, 
      name, 
      resetUrl, 
      expiryTime = '1 hour',
      smtpConfig 
    } = data;
    
    return this.sendEmail({
      to,
      subject: 'Reset Your Password',
      template: 'password-reset',
      templateData: { name, resetUrl, expiryTime },
      smtpConfig
    });
  }

  async sendWelcomeEmail(data) {
    const { 
      to, 
      name, 
      smtpConfig 
    } = data;
    
    return this.sendEmail({
      to,
      subject: 'Welcome to Our Platform!',
      template: 'welcome',
      templateData: { name },
      smtpConfig
    });
  }

  async sendNotification(data) {
    const { 
      to, 
      subject, 
      message, 
      priority = 'normal',
      smtpConfig 
    } = data;
    
    return this.sendEmail({
      to,
      subject: `Notification: ${subject}`,
      template: 'notification',
      templateData: { subject, message, priority },
      smtpConfig
    });
  }

  // Test SMTP configuration
  async testSmtpConfig(smtpConfig) {
    try {
      const transporter = this.createTransporter(smtpConfig);
      await transporter.verify();
      transporter.close();
      return { success: true, message: 'SMTP configuration is valid' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();