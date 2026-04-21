import { createClient } from "@/lib/supabase/client";
import { claimVisibilityType } from "@/lib/validations/claims";

export async function updateVisibility(
  claimId: string,
  changeValue: claimVisibilityType,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("claims")
    .update({ visibility_level: changeValue })
    .eq("id", claimId)
    .select();
  console.log("Error in Updated", error);
  if (error) {
    throw new Error(`${error}`);
  }
  //console.log("Data", data);
  return data;
}
