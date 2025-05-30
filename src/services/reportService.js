import supabase from "./supabase";

//  Fetch leave history for an employee
export const fetchLeaveHistory = async (employeeId) => {
  const { data, error } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("employee_id", employeeId)
    .order("start_date", { ascending: false });

  return error ? { success: false, error: error.message } : { success: true, data };
};

//  Fetch attendance logs for an employee
export const fetchAttendanceHistory = async (employeeId) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employeeId)
    .order("attendance_date", { ascending: false });

  return error ? { success: false, error: error.message } : { success: true, data };
};

//  Fetch employee performance records
export const fetchPerformanceHistory = async (employeeId) => {
  const { data, error } = await supabase
    .from("performance_reviews")
    .select("*")
    .eq("employee_id", employeeId)
    .order("review_date", { ascending: false });

  return error ? { success: false, error: error.message } : { success: true, data };
};