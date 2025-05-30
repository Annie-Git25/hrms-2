// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import HrAdminDashboard from "./pages/HrAdminDashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import AuthPage from "./pages/AuthPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LeaveManagementPage from "./pages/LeaveManagement"; // Ensure this is imported
import RoleBasedRedirect from "./components/RoleBasedRedirect"; // <--- IMPORT THIS

function App() {
    return (
        <Router basename="/hrms-2">
            <AuthProvider>
                <Routes>
                    {/* Public route for login */}
                    <Route path="/login" element={<AuthPage />} />

                    {/* Root path now redirects based on role */}
                    <Route path="/" element={<RoleBasedRedirect />} /> {/* <--- NEW ROOT ROUTE */}

                    {/* All other protected routes use the Layout */}
                    {/* These routes will have the Sidebar and TopBanner */}
                    <Route element={<Layout />}> {/* Layout wrapper for protected routes */}

                        {/* --- HR Admin Protected Routes --- */}
                        <Route element={<ProtectedRoute allowedRoles={["hrAdmin"]} />}>
                            <Route path="hr-dashboard" element={<HrAdminDashboard />} />
                            <Route path="employees" element={<EmployeeManagement />} />
                            {/* Add other HR Admin specific routes here */}
                        </Route>

                        {/* --- Employee Protected Routes --- */}
                        <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
                            <Route path="employee-dashboard" element={<EmployeeDashboard />} />
                            <Route path="leave" element={<LeaveManagementPage />} /> {/* Assuming this can be accessed by employees */}
                            {/* Add other Employee specific routes here */}
                        </Route>

                        {/* Fallback for unmatched paths (optional, but good practice) */}
                        {/* <Route path="*" element={<NotFoundPage />} /> */}
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;