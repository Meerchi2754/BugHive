"use client";
import { createClient } from "@/lib/supabase/client";

export async function getClaimDetail(claimId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select(
      `*,
    pr_table(
      pr_url,
      additions,
      deletions,
      changed_files_count,
      file_changes,
      merged_at
    ),
    verifications(
      technical_complexity,
      codebase_impact,
      collaboration_quality
    )`,
    )
    .eq("id", claimId)
    .maybeSingle();
  console.log("Error in Claim Details:", error);
  console.log("Data in Claim Details:", data);

  return data;
}
