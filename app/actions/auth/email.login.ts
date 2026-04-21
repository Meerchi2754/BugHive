import { createClient } from "@/lib/supabase/server";

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

  return data;
}
