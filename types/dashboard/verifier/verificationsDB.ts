import { verification_status } from "@/types/claims/verification";

export type verificationDB = {
  claim_Id: string;
  claims: {
    claim_title: string;
  };
  users: {
    username: string;
  };
  codebase_impact: number;
  collaboration_quality: number;
  created_at: string;
  descriptions: string;
  id: string;
  sent_at: string;
  status: verification_status;
  technical_complexity: number;
  token: string;
  updated_at: string;
  user_id: string;
  verifier_email: string;
  would_recommend: boolean;
};
