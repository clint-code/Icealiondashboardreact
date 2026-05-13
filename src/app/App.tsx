import { useState } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Settings2 } from 'lucide-react';

function RoleSwitcher({
  userRole,
  onRoleChange
}: {
  userRole: 'super_admin' | 'general_insurance' | 'asset_management';
  onRoleChange: (role: 'super_admin' | 'general_insurance' | 'asset_management') => void;
}) {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role: 'super_admin' | 'general_insurance' | 'asset_management') => {
    onRoleChange(role);
    setShowRoleSwitcher(false);
    navigate('/dashboard');
  };

  return (
    <>
      <button
        onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-50 border-2 border-[#AFCB09]"
        title="Switch User Role (Demo Only)"
      >
        <Settings2 className="w-6 h-6" />
      </button>

      {showRoleSwitcher && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-xl border border-border p-4 z-50 w-64">
          <h3 className="text-sm font-semibold text-foreground mb-3">Switch User Role (Demo)</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleRoleChange('super_admin')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                userRole === 'super_admin'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => handleRoleChange('general_insurance')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                userRole === 'general_insurance'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              General Insurance
            </button>
            <button
              onClick={() => handleRoleChange('asset_management')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                userRole === 'asset_management'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              Asset Management
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
            This switcher is for demo purposes only and should be removed in production.
          </p>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'super_admin' | 'general_insurance' | 'asset_management'>('super_admin');

  const handleLogin = (email: string, password: string, role: 'super_admin' | 'general_insurance' | 'asset_management') => {
    setUserRole(role);

    let name = 'User';
    if (email === 'admin@mfstech.co.ke') {
      name = 'John Kamau';
    } else if (email === 'gi@icea.co.ke') {
      name = 'Sarah Wanjiru';
    } else if (email === 'am@icea.co.ke') {
      name = 'David Ochieng';
    }

    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserName('');
    setUserRole('super_admin');
  };

  return (
    <BrowserRouter>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        userName={userName}
        onLogin={handleLogin}
        onSignOut={handleSignOut}
        onMenuClick={() => {}}
      />
      {isAuthenticated && (
        <RoleSwitcher userRole={userRole} onRoleChange={setUserRole} />
      )}
    </BrowserRouter>
  );
}
