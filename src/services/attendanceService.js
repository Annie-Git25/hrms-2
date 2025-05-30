//src/services/attendanceService.js
import supabase from "./supabase";

export const fetchTodayAttendance = async () => {
  const { data, error } = await supabase
    .from("attendance")
    .select("employee_id, clock_in_time, clock_out_time, is_absent, is_late, reason")
    .eq("attendance_date", new Date().toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching attendance:", error.message);
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    return { success: true, data: [], message: "No attendance records found for today." };
  }

  return { success: true, data };
};