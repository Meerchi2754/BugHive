import { ClaimType, claimVisibilityType } from "@/lib/validations/claims";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type claimDB = {
  id: string;
  user_id: string;
  claim_title: string;
  pr_url: string;
  claim_type: ClaimType;
  description: string;
  visibility_level: claimVisibilityType;
  verification_status: "PENDING" | "ACCEPT" | "DECLINED" | "EXPIRED";
  verifier_count: number;
  claim_impact_score: number;
  created_at: Timestamp;
  pr_table: {
    id: string;
    body: string | null;
    pr_url: string;
    reviews: string | null;
    additions: number;
    deletions: number;
    issue_url: string;
    merged_at: string;
    file_changes: string[];
    pr_created_at: string;
    pr_updated_at: string;
    evidences: string[];
    changed_files_count: number;
  };
};
