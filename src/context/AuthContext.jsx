// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../services/supabase'; // Your Supabase client

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        // Fetch user metadata/role if it's not directly in session.user
        // Or if you store roles in a separate 'profiles' table
        const { data: profile, error: profileError } = await supabase
          .from('profiles') // Assuming you have a profiles table
          .select('role, name, profile_pic')
          .eq('id', session.user.id)
          .single();

        if (profile && !profileError) {
          setUser({ ...session.user, ...profile }); // Combine user and profile data
        } else {
          setUser(session.user); // Fallback if no profile
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Authentication state is now determined
    };

    getSession();

    // Listen for auth state changes (e.g., login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, name, profile_pic')
            .eq('id', session.user.id)
            .single();

          if (profile && !profileError) {
            setUser({ ...session.user, ...profile });
          } else {
            setUser(session.user);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe(); // Clean up listener
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      // Fetch user profile to get the role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, name, profile_pic')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      const fullUser = { ...data.user, ...profile };
      setUser(fullUser);
      return { success: true, role: fullUser.role };
    } catch (error) {
      console.error('Login error:', error.message);
      return { success: false, error: error.message };
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);