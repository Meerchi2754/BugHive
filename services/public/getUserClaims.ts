"use server"
import { createClient } from "@/lib/supabase/admin";
import { Database } from "@/types/database.types";

export interface UserClaim {
  id: string;
  claim_title: string | null;
  claim_type: Database["public"]["Enums"]["claimtype"] | null;
  claim_impact_score: number;
  pr_url: string;
  created_at: string;
  description: string;
  verifications: Array<{
    id: string;
    verifier: {
      username: string;
      github_username: string | null;
    };
    technical_complexity: number | null;
    codebase_impact: number | null;
    collaboration_quality: number | null;
    descriptions: string | null;
  }>;
}

export async function getUserClaims(
  userId: string
): Promise<{ success: boolean; data?: UserClaim[]; error?: string }> {
  try {
    const supabase = await createClient();

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
          technical_complexity,
          codebase_impact,
          collaboration_quality,
          descriptions,
          status,
          users!verifications_user_id_fkey (
            username,
            github_username
          )
        )
      `)
      .eq("user_id", userId)
      .eq("verification_status", "ACCEPT")
      .eq("visibility_level","PUBLIC")
      .order("created_at", { ascending: false });
    if (claimsError) {
      console.error("Error fetching claims:", claimsError);
      return {
        success: false,
        error: "Failed to fetch claims",
      };
    }

    // Process claims
    const verifiedClaims: UserClaim[] = (claims || []).map((claim: any) => ({
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
            technical_complexity: v.technical_complexity,
            codebase_impact: v.codebase_impact,
            collaboration_quality: v.collaboration_quality,
            descriptions: v.descriptions,
          }))
        : [],
    }));

    return {
      success: true,
      data: verifiedClaims,
    };
  } catch (error: any) {
    console.error("Error in getUserClaims:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred",
    };
  }
}
