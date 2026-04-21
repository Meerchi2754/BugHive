import { createClient } from "@/lib/supabase/server";
import { encrypted } from "@/types";

export async function updateGithubDetails(
  access_token: encrypted,
  username: string,
  avatar_url: string,
  email: string,
) {
  const supabase = await createClient();
  console.log("EMAIL:", email);
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  //console.log("Existing user:", existingUser);

  const { data, error } = await supabase
    .from("users")
    .update({
      onboarding_step: 4,
      github_username: username,
      github_connected: true,
      onboarding_complete: true,
      github_avatar_url: avatar_url,
      github_access_token: access_token.encrytToken,
      ivkey: access_token.iv,
    })
    .eq("email", email)
    .select()
    .maybeSingle();

  //console.log("Updated User:", data);
  console.log("Updated User Error:", error);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
