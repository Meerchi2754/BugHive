import { createClient } from "@/lib/supabase/client";

export async function getShortlistPeople() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("shortlists")
    .select(`
      id,
      maintainer_id,
      name,
      created_at,
      shortlist_contributors (
        contributor_id,
        users!inner (
          github_avatar_url,
          username
        )
      )
    `);

  if (error) {
    console.error("Error fetching shortlist.", error);
    throw new Error(error.message);
  }

  // Transform the data to normalize the users field
  const normalizedData = data?.map((shortlist) => ({
    ...shortlist,
    shortlist_contributors: shortlist.shortlist_contributors.map((contrib: any) => ({
      contributor_id: contrib.contributor_id,
      users: Array.isArray(contrib.users) ? contrib.users[0] : contrib.users,
    })),
  }));

  return normalizedData ?? [];
}