import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { token, user } = useResumeStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow admin check to happen inside the component or specific page logic if needed
  // But for route protection, we just check role
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
