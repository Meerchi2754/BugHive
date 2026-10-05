"use server";

import { createClient } from "@/lib/supabase/server";
import { issueSessionForUser } from "@/lib/auth/session";
import { cookies } from "next/headers";

export async function emailLogin(email: string, password: string) {
  console.log("LOGIN:", email);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Error in Login: ${error.message}`);
  }

  // Fetch application user profile
  const { data: userDB, error: userError } = await supabase
    .from("users")
    .select("id, email, role, onboarding_complete")
    .eq("email", email)
    .maybeSingle();

  if (userDB) {
    const cookieStore = await cookies();
    await issueSessionForUser(
      {
        id: userDB.id,
        email: userDB.email,
        role: userDB.role as any,
        onboarding_complete: Boolean(userDB.onboarding_complete),
      },
      cookieStore,
    );
  }

  return data;
}
