import { createClient } from "@/lib/supabase/server";

export async function allClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select(`*,pr_table!inner(*)`);
  console.log("Error:", error);
  if (error) {
    throw new Error(`${error}`);
  }
  return data;
}
