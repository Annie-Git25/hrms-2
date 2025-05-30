// src/services/employeeService.js
import supabase from './supabase'; // Adjust path if needed

// Helper to handle Supabase responses
const handleSupabaseResponse = (data, error, errorMessage = "An unknown error occurred") => {
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(error.message || errorMessage);
  }
  return data;
};

export const getEmployees = async (user) => {
  if (!user) throw new Error("User not provided for getEmployees.");
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('company_id', user.company_id); // Assuming user has a company_id

    return handleSupabaseResponse(data, error, "Failed to fetch employees.");
  } catch (error) {
    throw error; // Re-throw to be caught in the component
  }
};

export const addEmployee = async (user, employeeData) => {
  if (!user) throw new Error("User not provided for addEmployee.");
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert({ ...employeeData, company_id: user.company_id, created_by: user.id })
      .select() // Use select() to return the newly inserted row
      .single(); // Assuming single insertion

    return handleSupabaseResponse(data, error, "Failed to add employee.");
  } catch (error) {
    throw error;
  }
};

export const updateEmployee = async (user, employeeId, updates) => {
  if (!user) throw new Error("User not provided for updateEmployee.");
  if (!employeeId) throw new Error("Employee ID is required for update.");
  try {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', employeeId)
      .eq('company_id', user.company_id) // Ensure only current user's company employees are updated
      .select()
      .single();

    return handleSupabaseResponse(data, error, "Failed to update employee.");
  } catch (error) {
    throw error;
  }
};

export const deactivateEmployee = async (user, employeeId) => {
  if (!user) throw new Error("User not provided for deactivateEmployee.");
  if (!employeeId) throw new Error("Employee ID is required to deactivate.");
  try {
    const { data, error } = await supabase
      .from('employees')
      .update({ is_active: false }) // Assuming an 'is_active' column
      .eq('id', employeeId)
      .eq('company_id', user.company_id) // Ensure only current user's company employees are deactivated
      .select()
      .single();

    return handleSupabaseResponse(data, error, "Failed to deactivate employee.");
  } catch (error) {
    throw error;
  }
};

export const fetchEmployeesCount = async (user) => { // Or getEmployeesCount
  if (!user) {
    throw new Error("User not provided for fetchEmployeesCount.");
  }
  try {
    // Supabase query to count rows
    const { count, error } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true }) // count: 'exact' gets total count, head: true makes it not return data
      .eq('company_id', user.company_id); // Filter by user's company

    if (error) {
      console.error("Error fetching employees count:", error.message);
      throw new Error(error.message || "Failed to fetch employee count.");
    }

    return count; // Returns the total count
  } catch (error) {
    throw error;
  }
};