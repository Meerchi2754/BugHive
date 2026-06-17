import { createClient } from "@/lib/supabase/admin";

export interface SearchFilters {
  username?: string;
}

export interface ContributorClaim {
  verifier_count: number | null;
  verification_status: string | null;
}

export interface ContributorSearchResult {
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
  total_impact_score: number | null;
  claims: ContributorClaim[];
  // Computed fields
  total_verifier_count: number;
  accepted_claims_count: number;
}

export async function searchContributorsAction(
  filters: SearchFilters
): Promise<{ success: boolean; data?: ContributorSearchResult[]; error?: string }> {
  try {
    const supabase = await createClient();

    // Step 1: Build base query for users
    let query = supabase
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
        claims!fk_users (
          verifier_count,
          verification_status
        )
        `
      )
      .eq("role", "CONTRIBUTOR");

    if (filters.username) {
      query = query.or(
        `username.ilike.%${filters.username}%,email.ilike.%${filters.username}%,github_username.ilike.%${filters.username}%`
      );
    }
    // Execute the query
    const { data: users, error: usersError } = await query;

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return {
        success: false,
        error: "Failed to fetch contributors. Please try again.",
      };
    }

    if (!users || users.length === 0) {
      return { success: true, data: [] };
    }

    // Map users to search results
    const results: ContributorSearchResult[] = users.map((user) => {
      const allClaims = user.claims || [];
      
      // Filter only accepted claims
      const acceptedClaims = allClaims.filter(
        (claim) => claim.verification_status === "ACCEPT"
      );
      
      // Calculate computed fields
      const total_verifier_count = acceptedClaims.reduce(
        (sum, claim) => sum + (claim.verifier_count || 0),
        0
      );
      const accepted_claims_count = acceptedClaims.length;

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
        claims: acceptedClaims,
        total_verifier_count,
        accepted_claims_count,
      };
    });

    return { success: true, data: results };
  } catch (error: any) {
    console.log("Error in searchContributorsAction:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred.",
    };
  }
}
