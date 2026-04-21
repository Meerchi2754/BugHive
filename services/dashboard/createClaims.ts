import { createClient } from "@/lib/supabase/server";

export async function createClaims(
  user_id: string,
  title: string,
  pr_url: string,
  claim_type: string,
  description: string,
  visibility: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("claims")
    .insert({
      user_id: user?.id,
      claim_title: title,
      pr_url: pr_url,
      claim_type: claim_type,
      description: description,
      visibility_level: visibility,
      verification_status: "PENDING",
      claim_impact_score: 0,
      created_at: new Date(),
    })
    .select();

  if (error) {
    console.log("CLAIMS ERROR:", error.message);
    throw new Error(`${error.message}`);
  }
  return data;
}
