import { getAllUserName } from "@/services/onboarding/getAllusername";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { username } = await body;

    if (!username) {
      return NextResponse.json(
        { message: "Username not found in API." },
        { status: 400 },
      );
    }

    const matchUser = await getAllUserName(username);
    console.log(matchUser);
        

    return NextResponse.json({ data: matchUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
