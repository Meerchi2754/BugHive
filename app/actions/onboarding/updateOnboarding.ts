import { createClient } from "@/lib/supabase/client";

export async function updateOnboarding(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ onboarding_complete: true })
    .eq("email", email)
    .select()
    .maybeSingle();
  if (error) {
    console.log(error);
    throw new Error(`${error}`);
  }
  return data;
}
