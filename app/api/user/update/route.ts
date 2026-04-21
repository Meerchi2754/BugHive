import { updateUserGithub } from "@/controller/auth/updateUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { access_token, username, avatar_url, email } = body;
    const response = await updateUserGithub(
      access_token,
      username,
      avatar_url,
      email!,
    );
    console.log("Response:", response);

    if (!response.ok) {
      throw new Error(`Updated Response Not Found.`);
    }
    return NextResponse.json({ message: "Github Updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
