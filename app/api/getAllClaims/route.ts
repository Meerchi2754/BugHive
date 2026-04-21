import { allClaims } from "@/services/claim/allClaims";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const allClaim = await allClaims();
    return NextResponse.json({ data: allClaim }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
