// src/components/RoleBasedRedirect.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming this provides `user` and `loading`

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in, redirect to login page
        navigate('/login', { replace: true });
      } else {
        // If logged in, redirect to their specific dashboard
        if (user.role === 'hrAdmin') {
          navigate('/hr-dashboard', { replace: true });
        } else if (user.role === 'employee') {
          navigate('/employee-dashboard', { replace: true });
        } else {
          // Fallback for unexpected roles or if role is missing
          // You might want a more robust error page or default behavior
          console.warn("User has an unhandled role or no role defined:", user.role);
          navigate('/login', { replace: true }); // Redirect to login as a safe fallback
        }
      }
    }
  }, [user, loading, navigate]); // Depend on user, loading, and navigate

  // You can return a loading spinner or null while the redirect is happening
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Loading dashboard...
    </div>
  );
};

export default RoleBasedRedirect;