import { createClient } from "@/lib/supabase/admin";
import { PublicProfileData } from "@/types/maintainer/publicprofileData";

export async function getPublicProfile(
  username: string
): Promise<PublicProfileData | null> {
  const supabase = await createClient();

  // Fetch user with verified claims
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
      created_at
    `
    )
    .eq("username", username)
    .maybeSingle();
console.log("Data:",user);
  if (userError || !user) {
    console.log("Error fetching user:", userError);
    return null;
  }

  // Fetch verified claims with verifications
  const { data: claims, error: claimsError } = await supabase
    .from("claims")
    .select(
      `
      id,
      claim_title,
      claim_type,
      claim_impact_score,
      pr_url,
      created_at,
      description,
      verifications!inner (
        id,
        credibility_score,
        users!verifications_user_id_fkey (
          username,
          github_username
        )
      )
    `
    )
    .eq("user_id", user.id)
    .eq("verification_status", "ACCEPT")
    .order("created_at", { ascending: false });

  if (claimsError) {
    console.log("Error fetching claims:", claimsError);
    return null;
  }

  // Process claims
  const verifiedClaims = (claims || []).map((claim: any) => ({
    id: claim.id,
    claim_title: claim.claim_title,
    claim_type: claim.claim_type,
    claim_impact_score: claim.claim_impact_score,
    pr_url: claim.pr_url,
    created_at: claim.created_at,
    description: claim.description,
    verifications: Array.isArray(claim.verifications)
      ? claim.verifications.map((v: any) => ({
          id: v.id,
          verifier: {
            username: v.users?.username || "Unknown",
            github_username: v.users?.github_username || null,
          },
          credibility_score: v.credibility_score,
        }))
      : [],
  }));

  // Calculate total impact score
  const totalImpactScore = verifiedClaims.reduce(
    (sum, claim) => sum + claim.claim_impact_score,
    0
  );

  // Build contribution graph (contributions by month)
  const contributionGraph: { [key: string]: number } = {};
  verifiedClaims.forEach((claim) => {
    const date = new Date(claim.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    contributionGraph[monthKey] = (contributionGraph[monthKey] || 0) + 1;
  });

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
    created_at: user.created_at,
    verifiedClaims,
    totalImpactScore,
    contributionGraph,
  };
}
