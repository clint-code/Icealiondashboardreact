import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import logoImg from '../../imports/MFS_Insurance_Logo.png';

interface ResetPasswordPageProps {
  resetToken: string;
  userEmail: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ResetPasswordPage({ resetToken, userEmail, onCancel, onSuccess }: ResetPasswordPageProps) {
  const [step, setStep] = useState<'password' | 'otp' | 'success'>('password');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string; otp?: string }>({});
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validatePasswordForm = () => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      // In production, validate reset token and send OTP via API
      console.log('Password reset requested for token:', resetToken);
      console.log('Sending OTP to:', userEmail);

      // Move to OTP verification step
      setStep('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (errors.otp) {
      setErrors({ ...errors, otp: undefined });
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 5);

    if (/^\d{5}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      otpInputRefs.current[4]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join('');

    // Validate OTP
    if (otpValue.length !== 5) {
      setErrors({ otp: 'Please enter the complete 5-digit OTP' });
      return;
    }

    // In production, verify OTP and update password via API
    console.log('Verifying OTP:', otpValue);
    console.log('Updating password for token:', resetToken);

    // Show success screen
    setStep('success');

    // Redirect after 3 seconds
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  const handleResendOtp = () => {
    // In production, call API to resend OTP
    console.log('Resending OTP to:', userEmail);
    setOtp(['', '', '', '', '']);
    setErrors({});
    otpInputRefs.current[0]?.focus();
  };

  const handleBackToPassword = () => {
    setStep('password');
    setOtp(['', '', '', '', '']);
    setErrors({});
  };

  // Focus first OTP input when OTP screen is shown
  useEffect(() => {
    if (step === 'otp') {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={logoImg} alt="MFS Insurance Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reset Your Password</h1>
          <p className="text-sm text-muted-foreground">
            {step === 'password' && 'Create a new password for your account'}
            {step === 'otp' && 'Enter verification code'}
            {step === 'success' && 'Password reset successful'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-border shadow-xl p-8">
          {step === 'password' && (
            // Password Reset Form
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              <div>
                <p className="text-sm text-muted-foreground mb-6">
                  Resetting password for
                  <br />
                  <span className="font-medium text-foreground">{userEmail}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={`w-full h-11 px-4 pr-12 rounded-lg border ${
                      errors.newPassword ? 'border-destructive' : 'border-input'
                    } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`w-full h-11 px-4 pr-12 rounded-lg border ${
                      errors.confirmPassword ? 'border-destructive' : 'border-input'
                    } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <p className="text-xs font-medium text-foreground mb-2">Password Requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md font-medium"
              >
                Continue
              </button>
            </form>
          )}

          {step === 'otp' && (
            // OTP Verification Screen
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToPassword}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  We've sent a 5-digit verification code to
                  <br />
                  <span className="font-medium text-foreground">{userEmail}</span>
                </p>

                {/* OTP Input */}
                <div className="flex justify-center gap-3 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className={`w-12 h-14 text-center text-2xl font-semibold rounded-lg border ${
                        errors.otp ? 'border-destructive' : 'border-input'
                      } bg-input-background focus:outline-none focus:ring-2 focus:ring-ring`}
                    />
                  ))}
                </div>

                {errors.otp && (
                  <p className="text-xs text-destructive text-center mt-2">{errors.otp}</p>
                )}
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-primary hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md font-medium"
              >
                Verify & Reset Password
              </button>
            </form>
          )}

          {step === 'success' && (
            // Success Screen
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-success" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Password Reset Successful!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Your password has been successfully reset.
                <br />
                You can now sign in with your new password.
              </p>
              <p className="text-xs text-muted-foreground">
                Redirecting to login page...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © 2026 MFS Tech Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
