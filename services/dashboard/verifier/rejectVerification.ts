import { createClient } from "@/lib/supabase/admin";

export async function rejectVerification(claimId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("verifications")
    .update({ status: "DECLINED" })
    .eq("claim_Id", claimId)
    .select("claim_Id, status")
    .maybeSingle();

  console.log("rejectVerification", { data, error });
  return data;
}
