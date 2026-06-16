"use client";
import { createClient } from "@/lib/supabase/admin";
import { Database } from "@/types/database.types";

export interface SearchFilters {
  ecosystem?: string[];
  minImpactScore?: number;
  claimTypes?: Database["public"]["Enums"]["claimtype"][];
  languages?: string[];
  availability?: "remote" | "any";
  keyword?: string;
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

export async function searchContributors(
  filters: SearchFilters
): Promise<ContributorSearchResult[]> {
  const supabase = await createClient();

  // Build the query for users with CONTRIBUTOR role and PUBLIC account
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
      claims!inner (
        id,
        claim_title,
        claim_type,
        claim_impact_score,
        pr_url,
        created_at,
        verification_status
      )
    `
    )
    .eq("role", "CONTRIBUTOR")

  // Apply filters
  if (filters.ecosystem && filters.ecosystem.length > 0) {
    query = query.overlaps("ecosystem", filters.ecosystem);
  }

  if (filters.languages && filters.languages.length > 0) {
    query = query.overlaps("languages", filters.languages);
  }

  if (filters.availability === "remote") {
    query = query.eq("isRemote", true);
  }

  if (filters.keyword) {
    query = query.or(
      `username.ilike.%${filters.keyword}%,bio.ilike.%${filters.keyword}%,headline.ilike.%${filters.keyword}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error searching contributors:", error);
    return [];
  }

  if (!data) return [];

  // Process and filter results
  const results: ContributorSearchResult[] = [];

  for (const user of data) {
    const claims = Array.isArray(user.claims) ? user.claims : [];
    
    // Filter by claim type if specified
    let filteredClaims = claims;
    if (filters.claimTypes && filters.claimTypes.length > 0) {
      filteredClaims = claims.filter((claim) =>
        filters.claimTypes!.includes(claim.claim_type!)
      );
    }

    // Calculate total impact score
    const totalImpactScore = filteredClaims.reduce(
      (sum, claim) => sum + (claim.claim_impact_score || 0),
      0
    );

    // Filter by minimum impact score
    if (
      filters.minImpactScore &&
      totalImpactScore < filters.minImpactScore
    ) {
      continue;
    }

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
      claims: filteredClaims,
    });
  }

  // Sort by total impact score descending
  results.sort((a, b) => b.totalImpactScore - a.totalImpactScore);

  return results;
}
