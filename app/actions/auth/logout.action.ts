"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { hashToken } from "@/lib/auth/tokens";
import { REFRESH_COOKIE_NAME, clearAuthCookiesInStore } from "@/lib/auth/cookies";

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

    const supabase = await createClient();

    // 1. Invalidate refresh token in database if present
    if (refreshToken) {
      try {
        const tokenHash = await hashToken(refreshToken);
        await supabase
          .from("refresh_tokens" as any)
          .update({ is_revoked: true })
          .eq("token_hash", tokenHash);
      } catch (dbErr) {
        console.error("Error revoking refresh token from database:", dbErr);
      }
    }

    // 2. Sign out from Supabase Auth
    try {
      await supabase.auth.signOut();
    } catch (sbErr) {
      console.error("Error signing out from Supabase:", sbErr);
    }

    // 3. Clear all auth cookies
    await clearAuthCookiesInStore(cookieStore);

    return { success: true };
  } catch (error) {
    console.error("Logout action error:", error);
    return { success: false, error: (error as Error).message };
  }
}
