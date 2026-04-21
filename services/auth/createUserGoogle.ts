import { createClient } from "@/lib/supabase/server";

export async function createUserGoogle(
  username: string,
  email: string,
  token: string,
  role: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("users").insert({
    username: username,
    email: email,
    token: token,
    role: role,
    updated_at: new Date(),
  });

  return data;
}
