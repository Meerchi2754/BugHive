"use server";

import { createClient } from "@/lib/supabase/admin";

export async function verifyClaim(claimId: string) {
  if (!claimId) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select(`*,pr_table(*)`)
    .eq("id", claimId)
    .maybeSingle();

  if (error) throw new Error(`Error in getting Claim:${error}`);
  return data;
}
