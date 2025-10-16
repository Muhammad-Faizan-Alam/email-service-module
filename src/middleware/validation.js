const validateEmailRequest = (req, res, next) => {
  const { to, subject, smtpConfig } = req.body;

  if (!to) {
    return res.status(400).json({
      success: false,
      error: 'Recipient email (to) is required'
    });
  }

  if (!subject) {
    return res.status(400).json({
      success: false,
      error: 'Email subject is required'
    });
  }

  if (!smtpConfig) {
    return res.status(400).json({
      success: false,
      error: 'SMTP configuration is required'
    });
  }

  // Validate SMTP config
  const { host, user, pass, port = 587 } = smtpConfig;
  if (!host || !user || !pass) {
    return res.status(400).json({
      success: false,
      error: 'SMTP configuration requires host, user, and pass'
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emails = Array.isArray(to) ? to : [to];
  
  for (const email of emails) {
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: `Invalid email format: ${email}`
      });
    }
  }

  next();
};

module.exports = { validateEmailRequest };