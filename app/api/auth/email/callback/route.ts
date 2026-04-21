import { createMaintainer } from "@/controller/auth/createMaintainer";
import { createClient } from "@/lib/supabase/server";
import { findMaintainer } from "@/services/auth/findMaintainer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const baseUrl = req.nextUrl.origin;

    if (!code) {
      console.log("Error to verify the Email. Please Try Agian");
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
    console.log("DATA:SESSION EMAIL:", data);
    console.log("ERROR:SESSION EMAIL:", error);
    if (error) {
      return NextResponse.json(
        {
          error: error,
        },
        {
          status: 400,
        },
      );
    }
    console.log("EXISTED:");

    const existingUser = await findMaintainer(data.user.email!);
    if (existingUser) {
      
      if (!existingUser.email_confirmed_at) {
        return NextResponse.redirect(`${baseUrl}/`);
      }

      return NextResponse.redirect(`${baseUrl}/onboarding/maintainer`);
    }
    console.log("CREATED");

    const createUser = await createMaintainer(
      data.user.email!,
      data.session.user.email_confirmed_at!,
    );
    console.log(createUser);
    if (!createUser) {
      console.error("Unexpected error in email verification:", error);
      return NextResponse.json(
        { error: "Failed to create Maintainer Account" },
        { status: 400 },
      );
    }
    return NextResponse.redirect(`${baseUrl}/onboarding/maintainer`);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
