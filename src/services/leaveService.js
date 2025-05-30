import supabase from "./supabase";

export const fetchLeaveBalance = async () => {
  const { data, error } = await supabase
    .from("leave_balances")
    .select("*")
    .eq("employee_id", "currentUserId"); 

  return error ? {} : data[0];
};

export const submitLeaveRequest = async (leaveType, startDate, endDate, reason) => {
  const { error } = await supabase.from("leave_requests").insert([
    { employee_id: "currentUserId", leave_type: leaveType, start_date: startDate, end_date: endDate, reason, status: "pending" }
  ]);

  return error ? { success: false, error: error.message } : { success: true };
};

export const fetchLeaveHistory = async () => {
  const { data, error } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("employee_id", "currentUserId");

  return error ? [] : data;
};