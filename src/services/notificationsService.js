import supabase from "./supabase";

// Fetch notifications for a user
export const fetchNotifications = async (userId) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return error ? { success: false, error: error.message } : { success: true, data };
};

// Create a new notification
export const createNotification = async (userId, message) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert([{ user_id: userId, message, status: "unread" }]);

  return error ? { success: false, error: error.message } : { success: true, data };
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  const { error } = await supabase
    .from("notifications")
    .update({ status: "read" })
    .eq("id", notificationId);

  return error ? { success: false, error: error.message } : { success: true };
};