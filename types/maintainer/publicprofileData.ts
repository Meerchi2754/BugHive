import { Database } from "@/types/database.types";

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
  created_at: string;
  verifiedClaims: Array<{
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
      credibility_score: number | null;
    }>;
  }>;
  totalImpactScore: number;
  contributionGraph: { [key: string]: number };
}