import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../service/apiUtils';

const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
