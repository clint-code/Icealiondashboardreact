import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  userRole: 'super_admin' | 'general_insurance' | 'asset_management';
  allowedRoles?: ('super_admin' | 'general_insurance' | 'asset_management')[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  isAuthenticated,
  userRole,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
