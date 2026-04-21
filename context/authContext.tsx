"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserDB, Role } from "../types/index";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<UserDB | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async (userEmail: string) => {
    if (!userEmail) return;
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", userEmail)
        .maybeSingle();
      //console.log("AUTH CONTEXT:", data);
      if (data) {
        setUser(data);
        setRole(data.role);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };


  const refreshUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser?.email) {
      await fetchUser(authUser.email);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        //console.log("User found in supabase auth:", user);
        await fetchUser(user.email);
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ role, user, setRole, setUser, isLoading, refreshUser }}
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
