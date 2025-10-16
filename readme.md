# Reusable Email Service API

A multi-tenant email service that accepts SMTP credentials from users.

## API Endpoints

### Test SMTP Configuration
**POST** `/api/email/test-smtp`
```json
{
  "smtpConfig": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "your-email@gmail.com",
    "pass": "your-app-password"
  }
}