import { createClient } from "@/lib/supabase/client";

export async function addEvidences(text: string, id: string) {
  const supabase = await createClient();

  const { data: existingUser, error: fetchError } = await supabase
    .from("pr_table")
    .select("evidences")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    console.log("FETCH ERROR", fetchError);
    throw new Error(`${fetchError}`);
  }

  const updatedEvidence = [...(existingUser?.evidences ?? []), text];

  const { data, error } = await supabase
    .from("pr_table")
    .update({ evidences: updatedEvidence })
    .eq("id", id)
    .select();
  if (error) {
    console.log("ADD EVIDENCE", error);
    throw new Error(`${error}`);
  }
  console.log("Data", data);

  return data;
}
