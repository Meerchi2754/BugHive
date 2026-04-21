import { createClient } from "@/lib/supabase/client";
export async function step2Services(
  headline: string,
  bio: string,
  language: string[],
  email: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({
      headline: headline,
      bio: bio,
      languages: language,
      onboarding_step: 2,
    })
    .eq("email", email);
  if (error) {
    console.log("Error in Updating Username.", error);
    return error;
  }
  console.log("UPDATED USER:2", data);
  return data;
}
