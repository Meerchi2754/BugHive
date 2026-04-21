import { ClaimType, claimVisibilityType } from "@/lib/validations/claims";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type claimDetailType = {
    id: string;
    user_id: string;
    claim_title: string;
    pr_url: string;
    claim_type: ClaimType;
    description: string;
    verification_status: "PENDING" | "ACCEPT" | "DECLINED" | "EXPIRED";
    visibility_level: claimVisibilityType;
    verifier_count: number;
    claim_impact_score: number;
    created_at: Timestamp;
    verifications: {
      technical_complexity: number;
      codebase_impact: number;
      collaboration_quality: number;
    }[];
    pr_table: {
      pr_url: string;
      additions: number;
      deletions: number;
      changed_files_count: number;
      file_changes: string[];
      merged_at: string;
    };
};
