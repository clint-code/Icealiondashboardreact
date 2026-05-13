import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users } from 'lucide-react';
import { ContactSupportModal } from './ContactSupportModal';
import { Toast } from './Toast';

interface SidebarProps {
  userRole: 'super_admin' | 'general_insurance' | 'asset_management';
  userName: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userRole, userName, isOpen = true, onClose }: SidebarProps) {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'general_insurance', 'asset_management'],
    },
    {
      path: '/ekyc-requests',
      label: 'E-KYC Requests',
      icon: FileText,
      roles: ['super_admin', 'general_insurance', 'asset_management'],
    },
    {
      path: '/users',
      label: 'Users',
      icon: Users,
      roles: ['super_admin'],
    },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const getUserRoleLabel = () => {
    if (userRole === 'super_admin') return 'Super Administrator';
    if (userRole === 'general_insurance') return 'General Insurance Manager';
    return 'Asset Management Manager';
  };

  const handleSupportRequest = (subject: string, message: string, priority: string) => {
    // In production, this would send the request to an API
    console.log('Support request submitted:', { subject, message, priority, userName, userRole });
    setToast({
      message: 'Your support request has been sent successfully. Our team will get back to you soon!',
      type: 'success',
    });
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-border flex flex-col
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-accent to-accent/50 rounded-lg p-4 border border-primary/20">
            <h4 className="text-sm font-semibold text-foreground mb-1">Need Help?</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Contact support for assistance
            </p>
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="w-full px-3 py-2 bg-[#AFCB09] text-[#1a202c] text-xs rounded-lg hover:bg-[#9bb908] transition-colors font-medium shadow-sm"
            >
              Contact Support
            </button>
          </div>
        </div>
      </aside>

      <ContactSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onSubmit={handleSupportRequest}
        userName={userName}
        userRole={getUserRoleLabel()}
      />

      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        isVisible={toast !== null}
        onClose={() => setToast(null)}
      />
    </>
  );
}
