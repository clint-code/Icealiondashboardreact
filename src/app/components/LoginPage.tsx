import { useState, useRef, useEffect } from 'react';
import { LogIn, ArrowLeft } from 'lucide-react';
import logoImg from '../../imports/MFS_Insurance_Logo.png';

interface LoginPageProps {
  onLogin: (email: string, password: string, role: 'super_admin' | 'general_insurance' | 'asset_management') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; otp?: string }>({});
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [userRole, setUserRole] = useState<'super_admin' | 'general_insurance' | 'asset_management'>('general_insurance');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Demo credentials - in production, this would be handled by an API
      let role: 'super_admin' | 'general_insurance' | 'asset_management' = 'general_insurance';

      if (email === 'admin@mfstech.co.ke') {
        role = 'super_admin';
      } else if (email === 'gi@icea.co.ke') {
        role = 'general_insurance';
      } else if (email === 'am@icea.co.ke') {
        role = 'asset_management';
      }

      setUserRole(role);

      // In production, send OTP to user's email/phone via API
      console.log('OTP would be sent to:', email);

      // Show OTP screen
      setShowOtpScreen(true);
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

    // In production, verify OTP with API
    // For demo, accept any 5-digit OTP
    console.log('Verifying OTP:', otpValue);

    // Complete login
    onLogin(email, password, userRole);
  };

  const handleBackToLogin = () => {
    setShowOtpScreen(false);
    setOtp(['', '', '', '', '']);
    setErrors({});
  };

  const handleResendOtp = () => {
    // In production, call API to resend OTP
    console.log('Resending OTP to:', email);
    setOtp(['', '', '', '', '']);
    setErrors({});
    otpInputRefs.current[0]?.focus();
  };

  // Focus first OTP input when OTP screen is shown
  useEffect(() => {
    if (showOtpScreen) {
      otpInputRefs.current[0]?.focus();
    }
  }, [showOtpScreen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={logoImg} alt="MFS Insurance Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">MFS Tech E-KYC</h1>
          <p className="text-sm text-muted-foreground">
            {showOtpScreen ? 'Enter verification code' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {/* Login Form or OTP Screen */}
        <div className="bg-white rounded-lg border border-border shadow-xl p-8">
          {!showOtpScreen ? (
            // Login Form
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full h-11 px-4 rounded-lg border ${
                  errors.email ? 'border-destructive' : 'border-input'
                } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full h-11 px-4 rounded-lg border ${
                  errors.password ? 'border-destructive' : 'border-input'
                } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md font-medium flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>
          ) : (
            // OTP Screen
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              <div>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  We've sent a 5-digit verification code to
                  <br />
                  <span className="font-medium text-foreground">{email}</span>
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
                Verify & Sign In
              </button>
            </form>
          )}

          {/* Demo Credentials - Only show on login screen */}
          {!showOtpScreen && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="font-medium">Super Admin:</span> admin@mfstech.co.ke</p>
                <p><span className="font-medium">General Insurance:</span> gi@icea.co.ke</p>
                <p><span className="font-medium">Asset Management:</span> am@icea.co.ke</p>
                <p className="mt-2 text-[10px] italic">Password: any value | OTP: any 5 digits</p>
              </div>
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
