import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import logoImg from '../../imports/MFS_Insurance_Logo.png';

interface VerificationCodePageProps {
  onLogin?: (email: string, password: string, role: 'super_admin' | 'general_insurance' | 'asset_management') => void;
}

export function VerificationCodePage({ onLogin }: VerificationCodePageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || 'user@example.com';
  const role = (location.state?.role || 'general_insurance') as 'super_admin' | 'general_insurance' | 'asset_management';
  const password = location.state?.password || '';

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    otpInputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedData = value.slice(0, 5);
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (index + i < 5 && /^\d$/.test(char)) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedData.length, 4);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      if (value && index < 4) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 5) {
      setError('Please enter the complete verification code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // In production, this would verify the OTP with an API
      // const response = await fetch('/api/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, otp: otpCode }),
      // });
      // const data = await response.json();

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock: Accept any 5-digit code
      // Call onLogin to complete the authentication
      if (onLogin) {
        onLogin(email, password, role);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error('Verification error:', err);
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setError('');
    setResendCooldown(60);

    try {
      // In production, this would resend the OTP via API
      // await fetch('/api/resend-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Resending OTP to:', email);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
      console.error('Resend error:', err);
      setResendCooldown(0);
    }
  };

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
            Enter verification code
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-lg border border-border shadow-xl p-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>

          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              We've sent a 5-digit verification code to
            </p>
            <p className="text-sm font-medium text-foreground">{email}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3 text-center">
                Verification Code
              </label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-semibold border-2 border-input rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-input-background"
                    disabled={isVerifying}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.join('').length !== 5}
              className="w-full h-11 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Sign In'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                className="text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : 'Resend Code'}
              </button>
            </div>
          </div>
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
