"use client";
import { createClient } from "@/lib/supabase/client";

export async function addToShortlist(
  shortlistId: string,
  contributorId: string,
  note?: string
): Promise<boolean> {
  const supabase = await createClient();

  // Check if already added
  const { data: existing } = await supabase
    .from("shortlist_contributors")
    .select("id")
    .eq("shortlist_id", shortlistId)
    .eq("contributor_id", contributorId)
    .maybeSingle();

  if (existing) {
    throw new Error("Contributor already in this shortlist");
  }

  const { error } = await supabase.from("shortlist_contributors").insert({
    shortlist_id: shortlistId,
    contributor_id: contributorId,
    note: note || null,
  });

  if (error) {
    console.error("Error adding to shortlist:", error);
    return false;
  }

  return true;
}

export async function removeFromShortlist(
  shortlistId: string,
  contributorId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("shortlist_contributors")
    .delete()
    .eq("shortlist_id", shortlistId)
    .eq("contributor_id", contributorId);

  if (error) {
    console.error("Error removing from shortlist:", error);
    return false;
  }

  return true;
}

export async function getShortlistContributors(shortlistId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shortlist_contributors")
    .select(
      `
      id,
      note,
      added_at,
      contributor:users!shortlist_contributors_contributor_id_fkey (
        id,
        username,
        github_username,
        github_avatar_url,
        bio,
        headline,
        location,
        isRemote,
        ecosystem,
        languages
      )
    `
    )
    .eq("shortlist_id", shortlistId);

  if (error) {
    console.error("Error fetching shortlist contributors:", error);
    return [];
  }

  return data || [];
}
