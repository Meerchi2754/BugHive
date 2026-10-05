import { createMaintainer } from "@/controller/auth/createMaintainer";
import { createClient } from "@/lib/supabase/server";
import { findMaintainer } from "@/services/auth/findMaintainer";
import { issueSessionOnResponse } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const baseUrl = req.nextUrl.origin;

    if (!code) {
      console.log("Error to verify the Email. Please Try Again");
      return NextResponse.json(
        {
          error: "Error to verify Email.",
        },
        {
          status: 400,
        },
      );
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      return NextResponse.json(
        {
          error: error?.message || "Failed to exchange code",
        },
        {
          status: 400,
        },
      );
    }

    let userDB = await findMaintainer(data.user.email!);

    if (!userDB) {
      userDB = await createMaintainer(
        data.user.email!,
        data.session.user.email_confirmed_at || new Date().toISOString(),
      );
    }

    if (!userDB) {
      return NextResponse.json(
        { error: "Failed to create/fetch Maintainer Account" },
        { status: 400 },
      );
    }

    const targetUrl = userDB.onboarding_complete
      ? `${baseUrl}/maintainer/shortlist`
      : `${baseUrl}/onboarding/maintainer`;

    const redirectRes = NextResponse.redirect(targetUrl);

    // Issue JWT access + refresh tokens
    await issueSessionOnResponse(redirectRes, {
      id: userDB.id,
      email: userDB.email,
      role: (userDB.role as any) || "MAINTAINER",
      onboarding_complete: Boolean(userDB.onboarding_complete),
    });

    return redirectRes;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || error }, { status: 400 });
  }
}
