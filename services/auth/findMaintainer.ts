import { createClient } from "@/lib/supabase/server";
export async function findMaintainer(email: string) {
  const supabase = await createClient();
  console.log("EMAIL", email);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("role", "MAINTAINER")
    .maybeSingle();
  if (error) {
    throw new Error(`error in Fetching Maintainer Users:${error}`);
  }
  console.log("MAINTAINER ROLE:", data);
  return data;
}
