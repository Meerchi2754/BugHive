import { createClient } from "@/lib/supabase/client";
import { verificationDB } from "@/types/dashboard/verifier/verificationsDB";

export async function getVerifierClaims(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("verifications")
    .select(`*,users(username),claims(claim_title)`)
    .eq("verifier_email", email);
  if (error) {
    console.log("Error fetching claims:", error);
  }
  return { data: data as verificationDB[], error };
}
