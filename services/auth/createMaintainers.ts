import { createClient } from "@/lib/supabase/server";

export async function createMaintainers(
  email: string,
  email_confirmed_at: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .insert({
      email: email,
      email_confirmed_at: email_confirmed_at,
      created_at: new Date(),
      updated_at: new Date(),
      role: "MAINTAINER",
    })
    .select();
  //console.log("DATA IN CREATING MAINTEAINER:SERVICES", data);
  console.log("ERROR IN CREATING MAINTEAINER:SERVICES", error);
  return { data, error };
}
