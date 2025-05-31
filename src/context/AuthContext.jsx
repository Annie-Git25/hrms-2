import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../services/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (session) => {
    console.log("🔍 Debug: fetchUserProfile called with session:", session);

    if (!session?.user) {
        console.warn("⚠️ No user found, setting user to null.");
        setUser(null);
        setLoading(false); // ✅ Ensure loading stops if session is missing
        return;
    }

    try {
        console.log("Fetching profile for:", session.user.id);
        const { data: profile, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

        if (error || !profile) {
            console.warn("⚠️ Profile fetch issue, using session user.");
            setUser(session.user);
        } else {
            console.log("✅ Profile fetched successfully:", profile);
            setUser({ ...session.user, ...profile });
        }
    } catch (err) {
        console.error("🔥 Unexpected error:", err.message);
        setUser(session.user);
    } finally {
        setLoading(false); // ✅ Ensures loading stops no matter what
    }
};

    useEffect(() => {
    let isMounted = true; // ✅ Prevents unnecessary calls on component unmount

    const getInitialSession = async () => {
        console.log("🌐 Getting initial session from Supabase...");
        setLoading(true);

        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) console.error("❌ Error getting initial session:", error.message);

            console.log("Session result:", session);
            if (isMounted) await fetchUserProfile(session);
        } catch (err) {
            console.error("🔥 Unexpected error during session retrieval:", err.message);
        } finally {
            if (isMounted) {
                setLoading(false);
                console.log("✅ Initial session check complete.");
            }
        }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        console.log(`⚡ Auth event: ${_event}, Session:`, session);

        if (_event === "SIGNED_IN") {
            setLoading(true);
            if (!session) {
                console.warn("⚠️ SIGNED_IN event triggered, but session is null! Fetching session...");
                const { data } = await supabase.auth.getSession();
                session = data.session;
            }
            await fetchUserProfile(session);
        } else {
            setUser(null);
        }

        setLoading(false);
    });

    return () => {
        console.log("🔄 Cleaning up auth listener.");
        authListener?.subscription?.unsubscribe();
        isMounted = false; // ✅ Prevents state updates on unmount
    };
}, []);

    const login = async (email, password) => {
        console.log(`🔐 Attempting login for ${email}`);
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            console.log("✅ Login successful. Fetching user profile...");
            await fetchUserProfile(data.session);

            return { success: true, user: data.user, role: user?.role || "Unknown" };
        } catch (error) {
            console.error("❌ Login error:", error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        console.log("🚪 Logging out...");
        setLoading(true);

        try {
            const { error } = await supabase.auth.signOut();
            if (error) console.error("❌ Logout error:", error.message);

            setUser(null);
        } catch (error) {
            console.error("🔥 Unexpected error during logout:", error.message);
        } finally {
            setLoading(false);
            console.log("✅ Logout complete.");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);