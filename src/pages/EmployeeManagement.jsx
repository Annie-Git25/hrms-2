import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getEmployees, addEmployee, updateEmployee, deactivateEmployee } from "../services/employeeService";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";
import { useNavigate } from "react-router-dom";

const EmployeeManagement = () => {
  const { user, loading } = useAuth(); // Destructure 'loading' from useAuth
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null); // State to handle errors
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false); // State for loading employees

  useEffect(() => {
    // Redirect logic
    if (!loading) { // Wait until auth loading is complete
      if (!user || user.role !== "hrAdmin") {
        navigate("/dashboard");
        return; // Stop execution if redirecting
      }
    }

    // Load employees only if user is an hrAdmin and not still loading auth
    const loadEmployees = async () => {
      if (user && user.role === "hrAdmin") {
        setIsLoadingEmployees(true);
        setError(null); // Clear previous errors
        try {
          const data = await getEmployees(user); // Pass the user object
          setEmployees(data); // Assuming getEmployees now returns data directly on success
        } catch (err) {
          console.error("Failed to load employees:", err);
          setError(err.message || "Failed to load employee data.");
        } finally {
          setIsLoadingEmployees(false);
        }
      }
    };

    // Only call loadEmployees if user is defined and auth loading is done
    if (!loading && user) {
      loadEmployees();
    }
  }, [user, loading, navigate]); // Add loading to dependencies

  const handleAddEmployee = async (employeeData) => {
    if (user?.role !== "hrAdmin") return; // Optional chaining for user safety
    setError(null);
    try {
      const newEmployee = await addEmployee(user, employeeData); // Pass user
      setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error adding employee:", err);
      setError(err.message || "Failed to add employee.");
    }
  };

  const handleEditEmployee = async (employeeData) => {
    if (user?.role !== "hrAdmin" || !selectedEmployee) return;
    setError(null);
    try {
      const updatedEmployee = await updateEmployee(user, selectedEmployee.id, employeeData); // Pass user
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => emp.id === selectedEmployee.id ? updatedEmployee : emp)
      );
      setIsFormOpen(false);
      setSelectedEmployee(null); // Clear selected employee after editing
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err.message || "Failed to update employee.");
    }
  };

  const handleDeactivateEmployee = async (employeeId) => {
    if (user?.role !== "hrAdmin") return;
    setError(null);
    try {
      await deactivateEmployee(user, employeeId); // Pass user
      // Assuming deactivate doesn't remove from list, but updates a status.
      // If it removes, then filter. If it changes a flag, update the item.
      // For now, based on your previous filter logic, it removes.
      setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employeeId));
      // TODO: You might want to update an 'isActive' status instead of filtering out
      // setEmployees(prevEmployees => prevEmployees.map(emp => emp.id === employeeId ? { ...emp, is_active: false } : emp));
    } catch (err) {
      console.error("Error deactivating employee:", err);
      setError(err.message || "Failed to deactivate employee.");
    }
  };

  // Render logic based on auth loading and user role
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  // If user is null or not hrAdmin, they would have been redirected by useEffect.
  // This check is a fallback/clarification.
  if (!user || user.role !== "hrAdmin") {
      return <div>Access Denied. Redirecting...</div>; // This should ideally not be seen for long
  }

  return (
    <div>
      <h1>Employee Management</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <>
        <button onClick={() => { setIsFormOpen(true); setSelectedEmployee(null); }}>
          Add New Employee
        </button>
        {isLoadingEmployees ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 && !error ? (
          <p>No employees found.</p>
        ) : (
          <EmployeeTable 
            employees={employees} 
            onEdit={(employee) => {
              setSelectedEmployee(employee);
              setIsFormOpen(true);
            }} 
            onDeactivate={handleDeactivateEmployee} 
          />
        )}
      </>

      {isFormOpen && (
        <EmployeeForm 
          onSubmit={selectedEmployee ? handleEditEmployee : handleAddEmployee} 
          employee={selectedEmployee} 
          onClose={() => {
            setIsFormOpen(false);
            setSelectedEmployee(null); // Clear selected employee when closing form
          }} 
        />
      )}
    </div>
  );
};

export default EmployeeManagement;