import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  userName: string;
  userRole: 'super_admin' | 'general_insurance' | 'asset_management';
  onSignOut: () => void;
  onMenuClick: () => void;
}

export function DashboardLayout({ userName, userRole, onSignOut, onMenuClick }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getUserRoleLabel = () => {
    if (userRole === 'super_admin') return 'Super Administrator';
    if (userRole === 'general_insurance') return 'General Insurance Manager';
    return 'Asset Management Manager';
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onMenuClick();
  };

  return (
    <div className="size-full flex flex-col bg-background">
      <Header
        userName={userName}
        userRole={getUserRoleLabel()}
        onSignOut={onSignOut}
        onMenuClick={handleMenuClick}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          userRole={userRole}
          userName={userName}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto w-full lg:ml-0">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
