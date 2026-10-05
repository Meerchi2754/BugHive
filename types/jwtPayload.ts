import { Role } from "@/types";

// Existing type — used by claim verification email tokens
export type JWTPAYLOAD = {
  claimId: string;
  contributor_email: string;
  verifier_email: string;
  sended_at: string;
};

// Access Token payload for custom JWT authentication & RBAC
export interface AccessTokenPayload {
  sub: string; // User ID (UUID)
  email: string;
  role: Role;
  onboarding_complete: boolean;
  iat?: number;
  exp?: number;
}

// Refresh Token payload for session rotation
export interface RefreshTokenPayload {
  sub: string; // User ID (UUID)
  jti: string; // Token ID (UUID matching record in refresh_tokens table)
  iat?: number;
  exp?: number;
}
