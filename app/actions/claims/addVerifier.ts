import { createClient } from "@/lib/supabase/client";

export async function addVerifier(
  userId: string,
  email: string,
  claimId: string,
  token: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("verifications")
    .insert({
      user_id: userId,
      verifier_email: email,
      claim_Id: claimId,
      token: token,
    })
    .select("claim_Id")
    .maybeSingle();

  if (error) {
    console.log(`Error in Adding Verifier:${error}`);
    throw new Error("Error in Adding Verifier");
  }
  return data;
}
