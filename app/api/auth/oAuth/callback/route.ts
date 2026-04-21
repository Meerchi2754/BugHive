import { userController } from "@/controller/auth/createUsers";
import { createClient } from "@/lib/supabase/server";
import { findUser } from "@/services/auth/findUser";
import { NextRequest, NextResponse } from "next/server";
import { UserDB } from "@/types";
import { createUserGoogle } from "@/services/auth/createUserGoogle";
import { updateUserGithub } from "@/controller/auth/updateUser";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const role = searchParams.get("role");
    const action = searchParams.get("action");
    const token = searchParams.get("token");

    if (!code) {
      console.log("Error in getting GITHUB TOKEN.");
      return NextResponse.json(
        { error: "Error in getting GITHUB TOKEM" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.log("Error in fetching GITHUB ERROR.", error);
      return NextResponse.json(
        { error: "Error in getting GITHUB TOKEN" },
        { status: 400 },
      );
    }

    const appProvider = data.user.app_metadata.provider;
    const existingUser: UserDB = await findUser(data.user.email!);
    if (existingUser) {
      if (!existingUser.github_connected) {
        if (action === "connect_github") {
          await updateUserGithub(
            data.session.provider_token!,
            data.user.user_metadata?.user_name,
            data.user.user_metadata.avatar_url,
            data.user.email!,
          );
        }
        return NextResponse.redirect(new URL("/dashboard/claims", req.url));
      }

      if (existingUser.role === "VERIFIER" && action === "redirect" && token) {
        return NextResponse.redirect(
          new URL(`/verify/claims/${token}`, req.url),
        );
      } else if (existingUser.role === "VERIFIER" && action === "register") {
        return NextResponse.redirect(new URL("/verify/claims", req.url));
      } else if (
        existingUser.role === "CONTRIBUTOR" &&
        action === "redirect" &&
        token
      ) {
        return NextResponse.redirect(new URL("/dashboard/verifier", req.url));
      }

      if (existingUser.onboarding_complete) {
        return NextResponse.redirect(new URL("/dashboard/claims", req.url));
      }

      if (
        existingUser.role === "MAINTAINER" &&
        !existingUser.onboarding_complete
      ) {
        return NextResponse.redirect(
          new URL("/onboarding/maintainer", req.url),
        );
      }
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    if (appProvider === "github") {
      const username = data.user?.user_metadata.user_name;
      const email = data.user?.email!;
      const github_avatar_url = data.user?.user_metadata.avatar_url;

      await userController(
        username,
        email,
        github_avatar_url!,
        data.session?.provider_token!,
        role!,
      );
    } else if (appProvider === "google") {
      const username = data.user.user_metadata.full_name!;
      const email = data.user.email!;
      const token = data.session.provider_token!;
      await createUserGoogle(username, email, token, role!);
    }

    if (role === "VERIFIER" && action === "redirect") {
      return NextResponse.redirect(new URL(`/verify/claims/${token}`, req.url));
    } else if (role === "VERIFIER" && action === "register") {
      return NextResponse.redirect(new URL("/verify/claims", req.url));
    }

    if (role === "MAINTAINER" && action === "register") {
      return NextResponse.redirect(new URL("/onboarding/maintainer", req.url));
    }
    return NextResponse.redirect(new URL("/onboarding", req.url));
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
