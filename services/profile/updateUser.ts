import { createClient } from "@/lib/supabase/client";
import { claimVisibilityType } from "@/lib/validations/claims";

export async function updateUser(
  userId: string,
  headline?: string,
  bio?: string,
  accountMode?: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .update({ headline: headline, bio: bio, account_mode: accountMode })
    .eq("id", userId)
    .select("id")
    .maybeSingle();
  console.log("Error:", error);
  return data;
}
