"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Profile } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = "taskflow_demo_user";
const DEMO_PROFILE_KEY = "taskflow_demo_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
      }
    } catch {
      // Profile might not exist yet
    }
  };

  useEffect(() => {
    if (isConfigured) {
      // Supabase is configured
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Fallback local storage demo mode
      try {
        const savedUser = localStorage.getItem(DEMO_USER_KEY);
        const savedProfile = localStorage.getItem(DEMO_PROFILE_KEY);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser) as User;
          setUser(parsedUser);
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          } else {
            setProfile({
              id: parsedUser.id,
              full_name: parsedUser.user_metadata?.full_name || "Demo User",
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${parsedUser.id}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Local storage error:", err);
      }
      setLoading(false);
    }
  }, [isConfigured]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isConfigured) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      return { error: null };
    } else {
      // Demo authentication
      const demoId = "demo-user-" + btoa(email).slice(0, 8);
      const demoUser = {
        id: demoId,
        email,
        app_metadata: {},
        user_metadata: { full_name: email.split("@")[0] },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;

      const demoProfile: Profile = {
        id: demoId,
        full_name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoId}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile));
      setUser(demoUser);
      setProfile(demoProfile);
      return { error: null };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: string | null }> => {
    if (isConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) return { error: error.message };

      // In case trigger didn't fire or immediate login
      if (data.user) {
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
          });
        } catch {
          // ignore
        }
      }
      return { error: null };
    } else {
      // Demo signup
      const demoId = "demo-user-" + Date.now();
      const demoUser = {
        id: demoId,
        email,
        app_metadata: {},
        user_metadata: { full_name: fullName },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;

      const demoProfile: Profile = {
        id: demoId,
        full_name: fullName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoId}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile));
      setUser(demoUser);
      setProfile(demoProfile);
      return { error: null };
    }
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.removeItem(DEMO_PROFILE_KEY);
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    if (!user) return { error: "Not authenticated" };

    if (isConfigured) {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) return { error: error.message };
      await fetchProfile(user.id);
      return { error: null };
    } else {
      if (profile) {
        const updated = {
          ...profile,
          ...data,
          updated_at: new Date().toISOString(),
        };
        setProfile(updated);
        localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(updated));
      }
      return { error: null };
    }
  };

  const updatePassword = async (password: string) => {
    if (isConfigured) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { error: error.message };
      return { error: null };
    } else {
      return { error: null };
    }
  };

  const refreshProfile = async () => {
    if (user && isConfigured) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
