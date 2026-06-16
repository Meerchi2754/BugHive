import { createClient } from "@/lib/supabase/admin";
import { Database } from "@/types/database.types";

export interface SearchFilters {
  ecosystem?: string[];
  minImpactScore?: number;
  claimTypes?: Database["public"]["Enums"]["claimtype"][];
  languages?: string[];
  availability?: "remote" | "any";
  keyword?: string;
  username?: string;
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
  totalImpactScore: number;
  verifiedClaimsCount: number;
  claims: Array<{
    id: string;
    claim_title: string | null;
    claim_type: Database["public"]["Enums"]["claimtype"] | null;
    claim_impact_score: number;
    pr_url: string;
    created_at: string;
    verification_status: Database["public"]["Enums"]["verificationstatus"] | null;
  }>;
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
        techstack
      `
      )
      .eq("role", "CONTRIBUTOR");

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

    // Step 7: Fetch claims for all users
    const userIds = users.map((u) => u.id);

    const { data: allClaims, error: claimsError } = await supabase
      .from("claims")
      .select(
        `
        id,
        user_id,
        claim_title,
        claim_type,
        claim_impact_score,
        pr_url,
        created_at,
        verification_status
      `
      )
      .in("user_id", userIds)
      .eq("verification_status", "ACCEPT");

    if (claimsError) {
      console.error("Error fetching claims:", claimsError);
      return {
        success: false,
        error: "Failed to fetch claims. Please try again.",
      };
    }

    // Step 8: Group claims by user_id
    const claimsByUserId: { [key: string]: any[] } = {};
    (allClaims || []).forEach((claim) => {
      if (!claimsByUserId[claim.user_id]) {
        claimsByUserId[claim.user_id] = [];
      }
      claimsByUserId[claim.user_id].push(claim);
    });

    // Step 9: Process and filter results
    const results: ContributorSearchResult[] = [];

    for (const user of users) {
      const userClaims = claimsByUserId[user.id] || [];

      // Filter by claim type if specified
      let filteredClaims = userClaims;
      if (filters.claimTypes && filters.claimTypes.length > 0) {
        filteredClaims = userClaims.filter((claim) =>
          filters.claimTypes!.includes(claim.claim_type!)
        );
      }

      // Calculate total impact score
      const totalImpactScore = filteredClaims.reduce(
        (sum, claim) => sum + (claim.claim_impact_score || 0),
        0
      );


      // Add to results
      results.push({
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
        totalImpactScore,
        verifiedClaimsCount: filteredClaims.length,
        claims: filteredClaims.map((claim) => ({
          id: claim.id,
          claim_title: claim.claim_title,
          claim_type: claim.claim_type,
          claim_impact_score: claim.claim_impact_score,
          pr_url: claim.pr_url,
          created_at: claim.created_at,
          verification_status: claim.verification_status,
        })),
      });
    }

    // Step 10: Sort by total impact score descending
    results.sort((a, b) => b.totalImpactScore - a.totalImpactScore);

    return { success: true, data: results };
  } catch (error: any) {
    console.error("Error in searchContributorsAction:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred.",
    };
  }
}
