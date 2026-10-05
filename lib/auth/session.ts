import { createClient } from "@/lib/supabase/server";
import { signAccessToken, signRefreshToken, hashToken } from "./tokens";
import { setAuthCookiesInStore, setAuthCookiesOnResponse } from "./cookies";
import { Role, UserDB } from "@/types";
import { NextResponse } from "next/server";

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Creates an Access Token and Refresh Token, persists the refresh token hash to Supabase,
 * and sets the HTTP-only cookies in the cookie store (for Server Actions).
 */
export async function issueSessionForUser(
  user: { id: string; email: string; role: Role; onboarding_complete: boolean },
  cookieStore?: any,
): Promise<SessionTokens> {
  const supabase = await createClient();
  const tokenId = crypto.randomUUID();

  // 1. Sign tokens
  const accessToken = await signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    onboarding_complete: Boolean(user.onboarding_complete),
  });

  const refreshToken = await signRefreshToken({
    sub: user.id,
    jti: tokenId,
  });

  // 2. Hash refresh token for DB storage
  const tokenHash = await hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // 3. Store in refresh_tokens table
  const { error } = await supabase.from("refresh_tokens" as any).insert({
    id: tokenId,
    user_id: user.id,
    token_hash: tokenHash,
    is_revoked: false,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Failed to store refresh token in database:", error);
  }

  // 4. Set cookies in cookieStore if provided
  if (cookieStore) {
    await setAuthCookiesInStore(cookieStore, accessToken, refreshToken);
  }

  return { accessToken, refreshToken };
}

/**
 * Issues session and attaches cookies directly to a NextResponse object (for Route Handlers).
 */
export async function issueSessionOnResponse(
  res: NextResponse,
  user: { id: string; email: string; role: Role; onboarding_complete: boolean },
): Promise<SessionTokens> {
  const supabase = await createClient();
  const tokenId = crypto.randomUUID();

  const accessToken = await signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    onboarding_complete: Boolean(user.onboarding_complete),
  });

  const refreshToken = await signRefreshToken({
    sub: user.id,
    jti: tokenId,
  });

  const tokenHash = await hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("refresh_tokens" as any).insert({
    id: tokenId,
    user_id: user.id,
    token_hash: tokenHash,
    is_revoked: false,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Failed to store refresh token in database:", error);
  }

  setAuthCookiesOnResponse(res, accessToken, refreshToken);

  return { accessToken, refreshToken };
}
