// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import useAuth here too for InitialRedirectHandler
import Layout from "./components/Layout";
import HrAdminDashboard from "./pages/HrAdminDashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import AuthPage from "./pages/AuthPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LeaveManagementPage from "./pages/LeaveManagement";

// This component now uses useAuth to decide what to render
const InitialRedirectHandler = () => {
  const { user, loading } = useAuth(); // CONSUME the context

  if (loading) {
    // This is where the loading message should be displayed
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading authentication...
      </div>
    );
  }

  // Once loading is false, make the navigation decision
  if (!user) {
    console.log("InitialRedirectHandler: No user, redirecting to /login");
    return <Navigate to="/login" replace />;
  } else {
    console.log("InitialRedirectHandler: User found, role:", user.role);
    if (user.role === 'hrAdmin') {
      return <Navigate to="/hr-dashboard" replace />;
    } else if (user.role === 'employee') {
      return <Navigate to="/employee-dashboard" replace />;
    } else {
      console.warn("InitialRedirectHandler: User has unhandled role or no role defined:", user.role);
      return <Navigate to="/login" replace />; // Safe fallback
    }
  }
};


function App() {
    return (
        <Router basename="/hrms-2">
            <AuthProvider> {/* AuthProvider ALWAYS renders its children */}
                <Routes>
                    {/* Public route for login */}
                    <Route path="/login" element={<AuthPage />} />

                    {/* Root path uses the handler to decide where to go initially */}
                    <Route path="/" element={<InitialRedirectHandler />} />

                    {/* All other protected routes use the Layout */}
                    <Route element={<Layout />}>
                        <Route element={<ProtectedRoute allowedRoles={["hrAdmin"]} />}>
                            <Route path="hr-dashboard" element={<HrAdminDashboard />} />
                            <Route path="employees" element={<EmployeeManagement />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
                            <Route path="employee-dashboard" element={<EmployeeDashboard />} />
                            <Route path="leave" element={<LeaveManagementPage />} />
                        </Route>

                        {/* Catch-all for any other unmatched paths within the authenticated flow */}
                        <Route path="*" element={<div>404 Not Found</div>} />

                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;