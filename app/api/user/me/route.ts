import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAccessToken } from "@/lib/auth/tokens";
import { ACCESS_COOKIE_NAME } from "@/lib/auth/cookies";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get(ACCESS_COOKIE_NAME)?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", payload.sub)
      .maybeSingle();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
