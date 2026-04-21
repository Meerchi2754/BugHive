import { createClient } from "@/lib/supabase/client";

export const getUserRole = async (email: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("email", email)
    .single();

  if (error) return null;

  return data?.role ?? null;
};
