# Email Templates

This document contains the email templates that need to be implemented for the MFS Tech E-KYC application.

---

## 1. Password Reset Request Email

**Triggered by:** Super Admin clicking "Reset Password" for a user

**Subject:** Reset Your Password - MFS Tech E-KYC

**To:** User's email address

**Template:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #53668E 0%, #AFCB09 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">MFS Tech E-KYC</h1>
  </div>
  
  <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #53668E; margin-top: 0;">Reset Your Password</h2>
    
    <p>Hello,</p>
    
    <p>We received a request to reset your password for your MFS Tech E-KYC account. If you didn't make this request, you can safely ignore this email.</p>
    
    <p>To reset your password, click the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{RESET_LINK}}" style="background-color: #AFCB09; color: #1a202c; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
    </div>
    
    <p>Or copy and paste this link into your browser:</p>
    <p style="background: #f5f5f5; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 14px; color: #666;">
      {{RESET_LINK}}
    </p>
    
    <div style="background: #fff4e5; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Important:</strong> This link will expire in <strong>1 hour</strong> for security reasons.
      </p>
    </div>
    
    <p style="color: #666; font-size: 13px; margin-top: 30px;">
      If you didn't request this password reset, please contact our support team immediately.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
    <p>© 2026 MFS Tech Ltd. All rights reserved.</p>
    <p>
      Need help? Contact us at 
      <a href="mailto:support@mfstech.co.ke" style="color: #53668E;">support@mfstech.co.ke</a>
    </p>
  </div>
</body>
</html>
```

**Variables to replace:**
- `{{RESET_LINK}}` - The password reset URL with token (e.g., `https://your-app.com/reset-password?token=abc123xyz`)

**Plain Text Version:**
```
MFS Tech E-KYC - Reset Your Password

Hello,

We received a request to reset your password for your MFS Tech E-KYC account. If you didn't make this request, you can safely ignore this email.

To reset your password, visit the following link:
{{RESET_LINK}}

IMPORTANT: This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please contact our support team immediately at support@mfstech.co.ke.

© 2026 MFS Tech Ltd. All rights reserved.
```

---

## 2. OTP Verification Email (Password Reset)

**Triggered by:** User submitting new password on reset page

**Subject:** Your Password Reset Verification Code

**To:** User's email address

**Template:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #53668E 0%, #AFCB09 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">MFS Tech E-KYC</h1>
  </div>
  
  <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #53668E; margin-top: 0;">Verify Your Password Reset</h2>
    
    <p>Hello,</p>
    
    <p>You're almost done resetting your password. Please use the verification code below to confirm your password reset:</p>
    
    <div style="background: #f5f5f5; border: 2px dashed #AFCB09; padding: 30px; margin: 30px 0; text-align: center; border-radius: 8px;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Verification Code:</p>
      <h1 style="margin: 0; font-size: 48px; color: #53668E; letter-spacing: 8px; font-family: 'Courier New', monospace;">{{OTP_CODE}}</h1>
    </div>
    
    <div style="background: #fff4e5; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Important:</strong> This code will expire in <strong>10 minutes</strong>.
      </p>
    </div>
    
    <p>If you didn't request this password reset, please ignore this email and contact our support team.</p>
    
    <p style="color: #666; font-size: 13px; margin-top: 30px;">
      For security reasons, never share this code with anyone, including MFS Tech staff.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
    <p>© 2026 MFS Tech Ltd. All rights reserved.</p>
    <p>
      Need help? Contact us at 
      <a href="mailto:support@mfstech.co.ke" style="color: #53668E;">support@mfstech.co.ke</a>
    </p>
  </div>
</body>
</html>
```

**Variables to replace:**
- `{{OTP_CODE}}` - The 5-digit OTP code

**Plain Text Version:**
```
MFS Tech E-KYC - Your Password Reset Verification Code

Hello,

You're almost done resetting your password. Please use the verification code below to confirm your password reset:

Your Verification Code: {{OTP_CODE}}

IMPORTANT: This code will expire in 10 minutes.

If you didn't request this password reset, please ignore this email and contact our support team at support@mfstech.co.ke.

For security reasons, never share this code with anyone, including MFS Tech staff.

© 2026 MFS Tech Ltd. All rights reserved.
```

---

## 3. Login OTP Email

**Triggered by:** User submitting email and password on login page

**Subject:** Your MFS Tech E-KYC Login Code

**To:** User's email address

**Template:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #53668E 0%, #AFCB09 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">MFS Tech E-KYC</h1>
  </div>
  
  <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #53668E; margin-top: 0;">Your Login Verification Code</h2>
    
    <p>Hello,</p>
    
    <p>Someone is trying to sign in to your MFS Tech E-KYC account. Please use the verification code below to complete your login:</p>
    
    <div style="background: #f5f5f5; border: 2px dashed #AFCB09; padding: 30px; margin: 30px 0; text-align: center; border-radius: 8px;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Login Code:</p>
      <h1 style="margin: 0; font-size: 48px; color: #53668E; letter-spacing: 8px; font-family: 'Courier New', monospace;">{{OTP_CODE}}</h1>
    </div>
    
    <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Login Details:</strong><br>
        Time: {{LOGIN_TIME}}<br>
        Location: {{LOGIN_LOCATION}} (approximate)
      </p>
    </div>
    
    <div style="background: #fff4e5; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Important:</strong> This code will expire in <strong>10 minutes</strong>.
      </p>
    </div>
    
    <p>If you didn't try to sign in, please contact our support team immediately as your account may be compromised.</p>
    
    <p style="color: #666; font-size: 13px; margin-top: 30px;">
      For security reasons, never share this code with anyone, including MFS Tech staff.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
    <p>© 2026 MFS Tech Ltd. All rights reserved.</p>
    <p>
      Need help? Contact us at 
      <a href="mailto:support@mfstech.co.ke" style="color: #53668E;">support@mfstech.co.ke</a>
    </p>
  </div>
</body>
</html>
```

**Variables to replace:**
- `{{OTP_CODE}}` - The 5-digit OTP code
- `{{LOGIN_TIME}}` - Timestamp of login attempt
- `{{LOGIN_LOCATION}}` - Approximate location from IP address

**Plain Text Version:**
```
MFS Tech E-KYC - Your Login Verification Code

Hello,

Someone is trying to sign in to your MFS Tech E-KYC account. Please use the verification code below to complete your login:

Your Login Code: {{OTP_CODE}}

Login Details:
Time: {{LOGIN_TIME}}
Location: {{LOGIN_LOCATION}} (approximate)

IMPORTANT: This code will expire in 10 minutes.

If you didn't try to sign in, please contact our support team immediately at support@mfstech.co.ke as your account may be compromised.

For security reasons, never share this code with anyone, including MFS Tech staff.

© 2026 MFS Tech Ltd. All rights reserved.
```

---

## 4. Password Reset Success Confirmation Email

**Triggered by:** Successful password reset completion

**Subject:** Your Password Has Been Reset

**To:** User's email address

**Template:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #53668E 0%, #AFCB09 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">MFS Tech E-KYC</h1>
  </div>
  
  <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="width: 60px; height: 60px; background: #4caf50; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 30px;">✓</span>
      </div>
    </div>
    
    <h2 style="color: #53668E; margin-top: 0; text-align: center;">Password Reset Successful</h2>
    
    <p>Hello,</p>
    
    <p>This is to confirm that your password for MFS Tech E-KYC has been successfully reset.</p>
    
    <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Reset Details:</strong><br>
        Date & Time: {{RESET_TIME}}<br>
        IP Address: {{IP_ADDRESS}}<br>
        Location: {{LOCATION}} (approximate)
      </p>
    </div>
    
    <p>You can now sign in to your account using your new password.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{LOGIN_URL}}" style="background-color: #AFCB09; color: #1a202c; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Sign In Now</a>
    </div>
    
    <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Didn't reset your password?</strong><br>
        If you didn't make this change, your account may be compromised. Please contact our support team immediately.
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
    <p>© 2026 MFS Tech Ltd. All rights reserved.</p>
    <p>
      Need help? Contact us at 
      <a href="mailto:support@mfstech.co.ke" style="color: #53668E;">support@mfstech.co.ke</a>
    </p>
  </div>
</body>
</html>
```

**Variables to replace:**
- `{{RESET_TIME}}` - Timestamp of password reset
- `{{IP_ADDRESS}}` - IP address of the reset
- `{{LOCATION}}` - Approximate location from IP
- `{{LOGIN_URL}}` - URL to login page

**Plain Text Version:**
```
MFS Tech E-KYC - Password Reset Successful

Hello,

This is to confirm that your password for MFS Tech E-KYC has been successfully reset.

Reset Details:
Date & Time: {{RESET_TIME}}
IP Address: {{IP_ADDRESS}}
Location: {{LOCATION}} (approximate)

You can now sign in to your account using your new password at: {{LOGIN_URL}}

DIDN'T RESET YOUR PASSWORD?
If you didn't make this change, your account may be compromised. Please contact our support team immediately at support@mfstech.co.ke.

© 2026 MFS Tech Ltd. All rights reserved.
```

---

## Implementation Notes

### Email Service Recommendations

1. **SendGrid** - Reliable with good deliverability
2. **AWS SES** - Cost-effective for high volume
3. **Mailgun** - Good developer experience
4. **Postmark** - Excellent for transactional emails

### Security Best Practices

1. **Token Generation:**
   - Use cryptographically secure random tokens
   - Minimum 32 characters
   - Store hashed version in database

2. **OTP Generation:**
   - Use cryptographically secure random 5-digit numbers
   - Store hashed version in database
   - Track failed attempts (max 3-5)

3. **Expiration:**
   - Reset tokens: 1 hour
   - OTP codes: 10 minutes
   - Clean up expired tokens/OTPs regularly

4. **Rate Limiting:**
   - Limit password reset requests: 3 per hour per email
   - Limit OTP requests: 5 per hour per email
   - Implement IP-based rate limiting

5. **Email Headers:**
   - Always include SPF, DKIM, and DMARC records
   - Use verified sender domain
   - Monitor bounce and spam rates

### Testing

Before deploying to production:
1. Test all email templates in different email clients (Gmail, Outlook, Apple Mail)
2. Test plain text versions
3. Verify all links work correctly
4. Test token expiration
5. Test OTP expiration
6. Test rate limiting

### Monitoring

Track these metrics:
- Email delivery rate
- Email open rate
- Click-through rate on password reset links
- OTP verification success rate
- Failed OTP attempts
- Expired token/OTP rates
