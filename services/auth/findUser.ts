import { createClient } from "@/lib/supabase/server";

export async function findUser(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("role", "CONTRIBUTOR")
    .maybeSingle();
  return data;
}
