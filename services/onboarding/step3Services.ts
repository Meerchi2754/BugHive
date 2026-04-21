import { createClient } from "@/lib/supabase/client";
export async function step3Services(
  remote: boolean,
  location: string | undefined,
  availability: boolean,
  email: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({
      isRemote: remote,
      location: location,
      account_mode: availability ? "PUBLIC" : "PRIVATE",
      onboarding_step: 3,
    })
    .eq("email", email);
  if (error) {
    console.log("Error in Updating Username.", error);
    return error;
  }
  console.log("UPDATED DATA3:", data);
  return data;
}
