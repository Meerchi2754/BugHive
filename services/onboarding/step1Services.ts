import { createClient } from "@/lib/supabase/client";
export async function step1Services(username: string, email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ username: username, onboarding_step: 1 })
    .eq("email", email);
  if (error) {
    console.log("Error in Updating Username.", error);
    return error;
  }
  console.log("UPDATED USER1:", data);
  return data;
}
