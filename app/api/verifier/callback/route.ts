import { createClient } from "@/lib/supabase/client";
import { jwtVerify } from "@/utils/jwt/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      console.log("No TOKEN");
      return NextResponse.redirect(new URL("/noAccess", req.url));
    }
    const data = await jwtVerify(token);
    console.log("DATA:", data);
    // If the Contributor and Verifier are same.
    if (data.contributor_email === data.verifier_email) {
      console.log("SAME VERIFIER AND CONTRIBUTOR");
      return NextResponse.redirect(new URL("/noAccess", req.url));
    }

    const current_Date = new Date().toLocaleDateString("en-US");
    const [current_month, current_date, current_year] = current_Date.split("/");
    const [sended_month, sended_date, sended_year] = data.sended_at.split("/");

    if (current_year > sended_year) {
      console.log("LINK EXPIRED YEAR");
      return NextResponse.redirect(new URL("/noAccess", req.url));
    } else if (current_year === sended_year && current_month > sended_month) {
      console.log(current_Date);
      console.log(data.sended_at);
      console.log("LINK EXPIRED MONTH");

      return NextResponse.redirect(new URL("/noAccess", req.url));
    } else if (
      current_year === sended_year &&
      current_month === sended_month &&
      current_date >= sended_date + 7
    ) {
      console.log("LINK EXPIRED DATE");
      return NextResponse.redirect(new URL("/noAccess", req.url));
    }

    const { data: activeSession, error: errorActiveSession } =
      await supabase.auth.getSession();

    if (errorActiveSession) {
      console.log("VERIFIER RO:", errorActiveSession);
      throw new Error(`error:${errorActiveSession}`);
    }
    console.log("SESSION:", activeSession);
    if (activeSession) {
      return NextResponse.redirect(
        new URL(
          `/register?role=VERIFIER&token=${token}&action=redirect`,
          req.url,
        ),
      );
    }

    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    console.log("Error in Verification:", error);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
