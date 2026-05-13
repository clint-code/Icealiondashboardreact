import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardView } from './components/DashboardView';
import { EKYCRequestsTable } from './components/EKYCRequestsTable';
import { EKYCRequestDetailPage } from './pages/EKYCRequestDetailPage';
import { ViewChargesPage } from './pages/ViewChargesPage';
import { UsersManagement } from './components/UsersManagement';
import { AccountBilling } from './components/AccountBilling';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';

interface AppRoutesProps {
  isAuthenticated: boolean;
  userRole: 'super_admin' | 'general_insurance' | 'asset_management';
  userName: string;
  onLogin: (email: string, password: string, role: 'super_admin' | 'general_insurance' | 'asset_management') => void;
  onSignOut: () => void;
  onMenuClick: () => void;
}

export function AppRoutes({
  isAuthenticated,
  userRole,
  userName,
  onLogin,
  onSignOut,
  onMenuClick,
}: AppRoutesProps) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLogin={onLogin} />
          )
        }
      />

      <Route
        path="/reset-password"
        element={
          <ResetPasswordPage
            resetToken={new URLSearchParams(window.location.search).get('token') || ''}
            userEmail="user@example.com"
            onCancel={() => window.location.href = '/login'}
            onSuccess={() => window.location.href = '/login'}
          />
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
            <DashboardLayout
              userName={userName}
              userRole={userRole}
              onSignOut={onSignOut}
              onMenuClick={onMenuClick}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route
          path="dashboard"
          element={<DashboardView userRole={userRole} />}
        />

        <Route
          path="ekyc-requests"
          element={<EKYCRequestsTable userRole={userRole} />}
        />

        <Route
          path="ekyc-requests/:requestId"
          element={<EKYCRequestDetailPage />}
        />

        <Route
          path="ekyc-requests/:requestId/charges"
          element={<ViewChargesPage />}
        />

        <Route
          path="users"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              allowedRoles={['super_admin']}
            >
              <UsersManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="account"
          element={<AccountBilling userRole={userRole} />}
        />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
