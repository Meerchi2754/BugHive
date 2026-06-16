"use client";
import { createClient } from "@/lib/supabase/client";
import { SearchFilters } from "./searchContributors";

export async function saveSearch(
  maintainerId: string,
  name: string,
  filters: SearchFilters
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("saved_searches").insert({
    maintainer_id: maintainerId,
    name,
    filters: filters as any,
  });

  if (error) {
    console.error("Error saving search:", error);
    return false;
  }

  return true;
}

export async function getSavedSearches(maintainerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("maintainer_id", maintainerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved searches:", error);
    return [];
  }

  return data || [];
}

export async function deleteSavedSearch(searchId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("saved_searches")
    .delete()
    .eq("id", searchId);

  if (error) {
    console.error("Error deleting saved search:", error);
    return false;
  }

  return true;
}
