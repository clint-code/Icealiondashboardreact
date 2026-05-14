import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import logoImg from '../../imports/MFS_Insurance_Logo.png';

interface LoginPageProps {
  onLogin: (email: string, password: string, role: 'super_admin' | 'general_insurance' | 'asset_management') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

      // In production, send OTP to user's email/phone via API
      console.log('OTP would be sent to:', email);

      // Navigate to verification page with email, password, and role in state only
      navigate('/verification', {
        state: { email, password, role }
      });
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
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg border border-border shadow-xl p-8">
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

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium">Super Admin:</span> admin@mfstech.co.ke</p>
              <p><span className="font-medium">General Insurance:</span> gi@icea.co.ke</p>
              <p><span className="font-medium">Asset Management:</span> am@icea.co.ke</p>
              <p className="mt-2 text-[10px] italic">Password: any value | OTP: any 5 digits</p>
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
