import { createClient } from "@/lib/supabase/client";

export async function deleteShortlist(shortlistId: string) {
  const supabase = createClient();

  // First delete associated contributors from the junction table
  const { error: junctionError } = await supabase
    .from("shortlist_contributors")
    .delete()
    .eq("shortlist_id", shortlistId);

  if (junctionError) {
    console.error("Error deleting shortlist contributors.", junctionError);
    throw new Error(junctionError.message);
  }

  // Then delete the shortlist itself
  const { error } = await supabase
    .from("shortlists")
    .delete()
    .eq("id", shortlistId);

  if (error) {
    console.error("Error deleting shortlist.", error);
    throw new Error(error.message);
  }

  return true;
}