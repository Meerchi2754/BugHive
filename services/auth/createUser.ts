import { createClient } from "@/lib/supabase/server";
import { encrypt } from "@/lib/crypto";

export async function createUser(
  github_username: string,
  github_email: string,
  github_avatar_url: string,
  github_access_token: string,
  role: string,
) {
  const supabase = await createClient();
  const encrypt_token = encrypt(github_access_token);
  const { data, error } = await supabase.from("users").insert({
    github_username: github_username,
    email: github_email,
    github_access_token: encrypt_token.encrytToken,
    ivkey: encrypt_token.iv,
    github_avatar_url: github_avatar_url,
    github_connected: true,
    role: role,
    updated_at: new Date(),
  });

  return data;
}
