import { useState } from 'react';
import { ResetPasswordPage } from './ResetPasswordPage';

/**
 * Demo component to test the password reset flow
 *
 * In production, users would access the ResetPasswordPage by clicking
 * a link in their email like: https://your-app.com/reset-password?token=abc123
 *
 * This demo allows you to test the reset password flow without email integration.
 */
export function ResetPasswordDemo() {
  const [showResetPage, setShowResetPage] = useState(false);
  const [demoEmail, setDemoEmail] = useState('user@example.com');

  // Simulate a reset token (in production, this comes from the email link)
  const demoResetToken = `RST-${Date.now()}-demo`;

  if (showResetPage) {
    return (
      <ResetPasswordPage
        resetToken={demoResetToken}
        userEmail={demoEmail}
        onCancel={() => setShowResetPage(false)}
        onSuccess={() => {
          setShowResetPage(false);
          alert('Password reset complete! In production, user would be redirected to login page.');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-border shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-foreground mb-4">Password Reset Flow Demo</h1>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground mb-2 font-medium">How it works in production:</p>
          <ol className="text-xs text-muted-foreground space-y-2">
            <li>1. Super admin clicks "Reset Password" for a user</li>
            <li>2. System sends email with reset link to user</li>
            <li>3. User clicks link in email (contains reset token)</li>
            <li>4. User enters new password</li>
            <li>5. System sends OTP to user's email</li>
            <li>6. User enters OTP to confirm password change</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Demo User Email
            </label>
            <input
              type="email"
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            onClick={() => setShowResetPage(true)}
            className="w-full h-11 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md font-medium"
          >
            Test Password Reset Flow
          </button>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Note:</span> This is a demo to test the UI flow.
              In production, the reset password page would be accessed via a unique link sent to the user's email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
