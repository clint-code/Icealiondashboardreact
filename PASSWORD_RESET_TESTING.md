# Password Reset Flow - Testing Guide

This guide explains how to test the password reset functionality in the MFS Tech E-KYC application.

## Overview

The password reset flow consists of the following steps:

1. **Super Admin initiates reset** - Admin clicks "Reset Password" for a user
2. **Email sent to user** - User receives email with reset link
3. **User sets new password** - User clicks link and enters new password
4. **OTP verification** - System sends OTP to user's email
5. **Password confirmed** - User enters OTP to complete reset

## Testing the Flow (Demo Mode)

Since email integration requires backend setup, you can test the UI flow using the demo component:

### Option 1: Using the Demo Component

1. **Access Demo Page:**
   - The demo component is available at `/src/app/components/ResetPasswordDemo.tsx`
   - This allows you to test the full reset password flow without email integration

2. **Test Steps:**
   ```
   a. Enter a demo email address
   b. Click "Test Password Reset Flow"
   c. Enter a new password (must meet requirements)
   d. Enter any 5-digit OTP
   e. See success confirmation
   ```

### Option 2: Testing from User Management

1. **Login as Super Admin:**
   - Email: `admin@mfstech.co.ke`
   - Password: any value
   - OTP: any 5 digits

2. **Navigate to User Management:**
   - Go to Users tab
   - Find any user in the table

3. **Initiate Password Reset:**
   - Click the three-dot menu (⋮) for any user
   - Click "Reset Password"
   - Check browser console for demo reset link
   - Console will show: `Password reset link: http://...?token=RST-...`

4. **Access Reset Page (Manual):**
   - Copy the reset link from console
   - In production, this link would be sent via email
   - The link contains a reset token

## Components Involved

### 1. UsersManagement.tsx
**Location:** `/src/app/components/UsersManagement.tsx`

**Functionality:**
- Displays "Reset Password" button in user actions menu
- Generates reset token
- In production: Calls API to send email with reset link

**Demo Behavior:**
```javascript
const resetToken = `RST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
console.log('Password reset link:', `${window.location.origin}/reset-password?token=${resetToken}`);
```

### 2. ResetPasswordPage.tsx
**Location:** `/src/app/components/ResetPasswordPage.tsx`

**Functionality:**
- Three-step process: Password Entry → OTP Verification → Success
- Password validation (min 8 chars, uppercase, lowercase, numbers)
- OTP input with auto-focus and paste support
- Resend OTP functionality

**Props:**
```typescript
interface ResetPasswordPageProps {
  resetToken: string;      // Token from email link
  userEmail: string;       // User's email address
  onCancel: () => void;    // Navigate back
  onSuccess: () => void;   // Called after successful reset
}
```

### 3. ResetPasswordDemo.tsx
**Location:** `/src/app/components/ResetPasswordDemo.tsx`

**Functionality:**
- Standalone demo to test the reset flow
- Simulates the email link experience
- No email integration required

## Password Requirements

The password must meet these criteria:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)

**Valid Examples:**
- `Password123`
- `MyNewPass1`
- `SecureP@ss1`

**Invalid Examples:**
- `pass` (too short)
- `password` (no uppercase or number)
- `PASSWORD123` (no lowercase)
- `Password` (no number)

## OTP Verification

### Demo Mode
- Accept any 5-digit code
- Auto-focus between input fields
- Support paste of full 5-digit code
- Backspace navigation

### Production Mode
When integrated with backend:

**API Call Sequence:**
1. User submits new password → API generates and sends OTP
2. User enters OTP → API verifies OTP and updates password
3. Success → API sends confirmation email

**Security Features:**
- OTP expires in 10 minutes
- Max 3-5 verification attempts
- Rate limiting on OTP requests
- One-time use tokens

## Testing Checklist

### UI/UX Testing
- [ ] Password requirements display correctly
- [ ] Password strength indicator works (if implemented)
- [ ] Show/hide password toggle works
- [ ] Password mismatch error shows correctly
- [ ] OTP inputs auto-focus correctly
- [ ] OTP paste functionality works
- [ ] Backspace navigation in OTP fields works
- [ ] Resend OTP button works
- [ ] Success screen displays
- [ ] Auto-redirect after success
- [ ] Back button navigation works

### Validation Testing
- [ ] Empty password shows error
- [ ] Short password (<8 chars) shows error
- [ ] Password without uppercase shows error
- [ ] Password without lowercase shows error
- [ ] Password without number shows error
- [ ] Mismatched passwords show error
- [ ] Incomplete OTP shows error
- [ ] Non-numeric OTP rejected

### Responsive Testing
- [ ] Mobile view works correctly
- [ ] Tablet view works correctly
- [ ] Desktop view works correctly
- [ ] Touch interactions work on mobile
- [ ] OTP inputs are easy to use on mobile

## Production Integration

When integrating with your backend:

### 1. Update UsersManagement.tsx

Replace the demo code with actual API call:

```typescript
const handleResetPassword = async (user: User) => {
  try {
    const response = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ email: user.email })
    });

    const data = await response.json();

    if (response.ok) {
      setToastMessage(`Password reset email sent to ${user.email}`);
      setToastType('success');
    } else {
      setToastMessage('Failed to send reset email');
      setToastType('error');
    }
  } catch (error) {
    setToastMessage('Error sending reset email');
    setToastType('error');
  }

  setShowToast(true);
  setOpenDropdownId(null);
};
```

### 2. Update ResetPasswordPage.tsx

Add API calls for:

**a. Validate Reset Token (on page load):**
```typescript
useEffect(() => {
  const validateToken = async () => {
    const response = await fetch('/api/users/validate-reset-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetToken })
    });

    if (!response.ok) {
      // Token invalid or expired - redirect to error page
    }
  };

  validateToken();
}, [resetToken]);
```

**b. Submit New Password (request OTP):**
```typescript
const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (validatePasswordForm()) {
    const response = await fetch('/api/users/reset-password/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        newPassword: newPassword
      })
    });

    if (response.ok) {
      setStep('otp'); // Move to OTP step
    }
  }
};
```

**c. Verify OTP (complete reset):**
```typescript
const handleOtpSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const otpValue = otp.join('');

  const response = await fetch('/api/users/reset-password/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: resetToken,
      otp: otpValue,
      newPassword: newPassword
    })
  });

  if (response.ok) {
    setStep('success');
    setTimeout(() => onSuccess(), 3000);
  } else {
    setErrors({ otp: 'Invalid or expired OTP' });
  }
};
```

### 3. Set Up Routing

Add route to access reset password page:

```typescript
// Using React Router
<Route path="/reset-password" element={
  <ResetPasswordPage
    resetToken={searchParams.get('token')}
    userEmail={userEmailFromToken}
    onCancel={() => navigate('/login')}
    onSuccess={() => navigate('/login')}
  />
} />
```

### 4. Configure Email Service

Choose and configure an email service:
- SendGrid
- AWS SES
- Mailgun
- Postmark

Refer to `EMAIL_TEMPLATES.md` for complete email templates.

## API Endpoints Required

See `API_ENDPOINTS.md` for complete API specifications:

1. `POST /api/users/reset-password` - Initiate reset
2. `POST /api/users/validate-reset-token` - Validate token
3. `POST /api/users/reset-password/verify` - Submit password, send OTP
4. `POST /api/users/reset-password/confirm` - Verify OTP, complete reset

## Security Considerations

### Tokens
- Use cryptographically secure tokens (min 32 characters)
- Store hashed in database
- Expire after 1 hour
- One-time use only
- Clean up expired tokens

### OTP
- Generate secure 5-digit codes
- Store hashed in database
- Expire after 10 minutes
- Max 3-5 verification attempts
- Rate limit requests

### Email
- Always send confirmation after successful reset
- Include reset details (time, location, IP)
- Provide contact info if user didn't request reset

### Logging
- Log all reset attempts
- Log failed OTP verifications
- Monitor for suspicious patterns
- Alert on multiple failed attempts

## Troubleshooting

### Common Issues

**Issue:** OTP inputs not auto-focusing
**Solution:** Check that refs are properly set and useEffect dependency array is correct

**Issue:** Password validation not working
**Solution:** Verify regex pattern matches requirements

**Issue:** Token expired error
**Solution:** Check token expiration time in backend, may need to extend to 1 hour

**Issue:** OTP paste not working
**Solution:** Ensure clipboard paste event is only on first input (index 0)

**Issue:** Success screen doesn't redirect
**Solution:** Check setTimeout and onSuccess callback are working

## Support

For questions or issues:
- Email: support@mfstech.co.ke
- Check browser console for error messages
- Review API endpoint documentation
- Verify email service configuration
