import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingLogo from '../components/LoadingLogo';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-900">
        <LoadingLogo size={80} text="Loading..." />
      </div>
    );
  }

  if (!user) {
    // Not logged in, redirect to login and preserve the current location
    const location = useLocation();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && user.role !== 'admin') {
    // User is logged in but not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}

export function AdminOnlyRoute({ children }) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}