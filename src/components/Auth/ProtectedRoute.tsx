import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-primary-400"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/auth?mode=login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
