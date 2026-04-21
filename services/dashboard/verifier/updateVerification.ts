"use server";
import { createClient } from "@/lib/supabase/admin";

export async function updateVerification(
  claimId: string,
  technicalComplexity: number,
  codebaseImpact: number,
  collaborationQuality: number,
  description: string,
  wouldRecommend: boolean,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("verifications")
    .update({
      descriptions: description,
      technical_complexity: technicalComplexity,
      codebase_impact: codebaseImpact,
      collaboration_quality: collaborationQuality,
      would_recommend: wouldRecommend,
      status: "ACCEPT",
    })
    .eq("claim_Id", claimId)
    .select("claim_Id");

  const { data: cData, error: cError } = await supabase
    .from("claims")
    .update({
      verification_status: "ACCEPT",
      verifier_count: 1,
    })
    .eq("id", claimId)
    .select("id");

  console.log("UPDATE VERIFICATION DATA:", data);
  console.log("UPDATE CLAIM DATA:", cData);

  console.log("UPDATE VERIFICATION ERROR:", error);
  console.log("UPDATE CLAIM ERROR:", cError);

  return cData;
}
