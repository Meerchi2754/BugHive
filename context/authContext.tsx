"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserDB, Role } from "../types/index";
import { createClient } from "@/lib/supabase/client";
import { logoutAction } from "@/app/actions/auth/logout.action";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<UserDB | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user/me");
      const contentType = res.headers.get("content-type");

      if (res.ok && contentType && contentType.includes("application/json")) {
        const json = await res.json();
        if (json?.data) {
          setUser(json.data);
          setRole(json.data.role as Role);
          return;
        }
      }

      // If token not present or expired, check Supabase auth session
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", authData.user.email)
          .maybeSingle();

        if (dbUser) {
          setUser(dbUser);
          setRole(dbUser.role as Role);
          return;
        }
      }

      // Unauthenticated state
      setUser(null);
      setRole(null);
    } catch (err) {
      console.error("Error fetching authenticated user:", err);
      setUser(null);
      setRole(null);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const logout = async () => {
    try {
      await logoutAction();
      setUser(null);
      setRole(null);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout error in context:", err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await fetchUser();
      setIsLoading(false);
    };

    initAuth();

    // Listen to Supabase auth events if active
    const { data: listener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setRole(null);
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        await fetchUser();
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ role, user, setRole, setUser, isLoading, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
