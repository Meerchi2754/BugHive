import { createClient } from "@/lib/supabase/client";
import { FormDataResponse } from "@/types";
export async function updateUserDetails(
  FieldData: FormDataResponse,
  email: string,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .update({
      username: FieldData.username,

      headline: FieldData.headline,
      bio: FieldData.bio,
      languages: FieldData.language,

      isRemote: FieldData.remote,
      location: FieldData.location,
      account_mode: FieldData.availability ? "PUBLIC" : "PRIVATE",
    })
    .eq("email", email)
    .select()
    .maybeSingle();

  if (error) {
    console.log("ERROR IN UPDATING:", error);
    return error;
  }
  console.log("UPDATED USER:", data);
  return data;
}
