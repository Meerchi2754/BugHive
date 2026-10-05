import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyRefreshToken, hashToken, signAccessToken, signRefreshToken } from "@/lib/auth/tokens";
import { REFRESH_COOKIE_NAME, setAuthCookiesOnResponse, clearAuthCookiesOnResponse } from "@/lib/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });
    }

    // 1. Verify token signature and claims
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload || !payload.sub) {
      const res = NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
      clearAuthCookiesOnResponse(res);
      return res;
    }

    const supabase = await createClient();
    const tokenHash = await hashToken(refreshToken);

    // 2. Query token in database
    const { data: dbToken, error: dbError } = await supabase
      .from("refresh_tokens" as any)
      .select("*")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (dbError || !dbToken) {
      const res = NextResponse.json({ error: "Token not found" }, { status: 401 });
      clearAuthCookiesOnResponse(res);
      return res;
    }

    // 3. Reuse detection: if token is already revoked, compromise detected!
    if (dbToken.is_revoked) {
      console.warn(`[SECURITY ALERT] Token reuse detected for user ${payload.sub}. Revoking all sessions.`);
      await supabase
        .from("refresh_tokens" as any)
        .update({ is_revoked: true })
        .eq("user_id", payload.sub);

      const res = NextResponse.json(
        { error: "Token compromised. All sessions revoked." },
        { status: 401 },
      );
      clearAuthCookiesOnResponse(res);
      return res;
    }

    // 4. Check expiration
    if (new Date(dbToken.expires_at) < new Date()) {
      const res = NextResponse.json({ error: "Refresh token expired" }, { status: 401 });
      clearAuthCookiesOnResponse(res);
      return res;
    }

    // 5. Fetch fresh user data from DB to heal any role staleness
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, role, onboarding_complete")
      .eq("id", payload.sub)
      .maybeSingle();

    if (userError || !user) {
      const res = NextResponse.json({ error: "User not found" }, { status: 401 });
      clearAuthCookiesOnResponse(res);
      return res;
    }

    // 6. Generate new rotated token pair
    const newTokenId = crypto.randomUUID();
    const newAccessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role as any,
      onboarding_complete: Boolean(user.onboarding_complete),
    });

    const newRefreshToken = await signRefreshToken({
      sub: user.id,
      jti: newTokenId,
    });

    const newTokenHash = await hashToken(newRefreshToken);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // 7. Atomically invalidate old token and insert new rotated token
    await supabase
      .from("refresh_tokens" as any)
      .update({ is_revoked: true, replaced_by: newTokenId })
      .eq("id", dbToken.id);

    await supabase.from("refresh_tokens" as any).insert({
      id: newTokenId,
      user_id: user.id,
      token_hash: newTokenHash,
      is_revoked: false,
      expires_at: newExpiresAt,
    });

    // 8. Set updated cookies on response
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        onboarding_complete: user.onboarding_complete,
      },
    });

    setAuthCookiesOnResponse(res, newAccessToken, newRefreshToken);
    return res;
  } catch (err: any) {
    console.error("Refresh route error:", err);
    return NextResponse.json({ error: err.message || "Refresh error" }, { status: 500 });
  }
}
