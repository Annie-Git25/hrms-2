import supabase from "./supabase";

// Fetch authenticated user & role
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) return { success: false, error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", data.user.id)
    .single();

  return { success: true, user: { ...data.user, role: profile?.role } };
};

// Sign in user
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };

  return getCurrentUser(); // Fetch role after login
};

// Sign out user
export const logoutUser = async () => {
  await supabase.auth.signOut();
  return { success: true };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return error ? { success: false } : { success: true, session: data.session };
};