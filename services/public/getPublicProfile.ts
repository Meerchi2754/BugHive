import { createClient } from "@/lib/supabase/admin";
export interface PublicProfileData {
  id: string;
  username: string;
  github_username: string | null;
  github_avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  isRemote: boolean | null;
  ecosystem: string[] | null;
  languages: string[] | null;
  techstack: string[] | null;
  total_impact_score: number;
  created_at: string;
}


export async function getPublicProfile(
  username: string
): Promise<PublicProfileData | null> {
  const supabase = await createClient();

  const decodedUsername = decodeURIComponent(username);

  const { data: user, error: userError } = await supabase
    .from("users")
    .select(
      `
      id,
      username,
      github_username,
      github_avatar_url,
      bio,
      headline,
      location,
      isRemote,
      ecosystem,
      languages,
      techstack,
      total_impact_score,
      created_at
    `
    )
    .eq("username", decodedUsername)
    .maybeSingle();

  if (userError || !user) {
    console.log("Error fetching user:", userError);
    return null;
  }

  return {
    id: user.id,
    username: user.username!,
    github_username: user.github_username,
    github_avatar_url: user.github_avatar_url,
    bio: user.bio,
    headline: user.headline,
    location: user.location,
    isRemote: user.isRemote,
    ecosystem: user.ecosystem,
    languages: user.languages,
    techstack: user.techstack,
    total_impact_score: user.total_impact_score,
    created_at: user.created_at,
  };
}
