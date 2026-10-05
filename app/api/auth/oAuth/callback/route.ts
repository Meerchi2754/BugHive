import { userController } from "@/controller/auth/createUsers";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { UserDB } from "@/types";
import { createUserGoogle } from "@/services/auth/createUserGoogle";
import { updateUserGithub } from "@/controller/auth/updateUser";
import { issueSessionOnResponse } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const roleParam = searchParams.get("role");
    const action = searchParams.get("action");
    const token = searchParams.get("token");

    // Whitelist role to prevent privilege escalation
    const allowedRoles = ["CONTRIBUTOR", "VERIFIER", "MAINTAINER"];
    const role = allowedRoles.includes(roleParam ?? "") ? roleParam! : "CONTRIBUTOR";

    if (!code) {
      console.log("Error in getting GITHUB/GOOGLE CODE.");
      return NextResponse.json(
        { error: "Error in getting OAuth Code" },
        { status: 400 },
      );
    }

    const { data, error } =
      await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      console.log("Error exchanging code for session:", error);
      return NextResponse.json(
        { error: "Error exchanging code for session" },
        { status: 400 },
      );
    }

    const appProvider = data.user.app_metadata.provider;

    // Look up existing user
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", data.user.email!)
      .maybeSingle();

    let targetUrl = "/onboarding";

    if (existingUser) {
      if (!existingUser.github_connected && action === "connect_github") {
        await updateUserGithub(
          data.session.provider_token!,
          data.user.user_metadata?.user_name,
          data.user.user_metadata?.avatar_url,
          data.user.email!,
        );
        targetUrl = "/dashboard/claims";
      } else if (existingUser.role === "VERIFIER" && action === "redirect" && token) {
        targetUrl = `/verify/claims/${token}`;
      } else if (existingUser.role === "VERIFIER" && action === "register") {
        targetUrl = "/verify/claims";
      } else if (existingUser.role === "CONTRIBUTOR" && action === "redirect" && token) {
        targetUrl = "/dashboard/verifier";
      } else if (existingUser.onboarding_complete) {
        targetUrl = existingUser.role === "MAINTAINER" ? "/maintainer/shortlist" : "/dashboard/claims";
      } else if (existingUser.role === "MAINTAINER" && !existingUser.onboarding_complete) {
        targetUrl = "/onboarding/maintainer";
      } else {
        targetUrl = "/onboarding";
      }
    } else {
      // Create new user account
      if (appProvider === "github") {
        const username = data.user?.user_metadata.user_name;
        const email = data.user?.email;
        const github_avatar_url = data.user?.user_metadata.avatar_url;

        await userController(
          username,
          email!,
          github_avatar_url!,
          data.session.provider_token!,
          role,
        );
      } else if (appProvider === "google") {
        const username = data.user.user_metadata.full_name!;
        const email = data.user.email!;
        const providerToken = data.session.provider_token || "";
        await createUserGoogle(username, email, providerToken, role);
      }

      if (role === "VERIFIER" && action === "redirect" && token) {
        targetUrl = `/verify/claims/${token}`;
      } else if (role === "VERIFIER" && action === "register") {
        targetUrl = "/verify/claims";
      } else if (role === "MAINTAINER" && action === "register") {
        targetUrl = "/maintainer/shortlist";
      } else {
        targetUrl = role === "MAINTAINER" ? "/onboarding/maintainer" : "/onboarding";
      }
    }

    // Retrieve fresh user record to ensure we have the UUID and up-to-date fields
    const { data: finalUser } = await supabase
      .from("users")
      .select("id, email, role, onboarding_complete")
      .eq("email", data.user.email!)
      .maybeSingle();

    const redirectRes = NextResponse.redirect(new URL(targetUrl, req.url));

    if (finalUser) {
      await issueSessionOnResponse(redirectRes, {
        id: finalUser.id,
        email: finalUser.email,
        role: finalUser.role as any,
        onboarding_complete: Boolean(finalUser.onboarding_complete),
      });
    }

    return redirectRes;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown Error";
    console.error("OAuth callback error:", message);
    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}
