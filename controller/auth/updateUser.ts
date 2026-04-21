import { updateGithubDetails } from "@/services/user/updateGithubDetails";
import { NextResponse, NextRequest } from "next/server";
import { encrypt } from "@/lib/crypto";
import { encrypted } from "@/types";

export async function updateUserGithub(
  access_token: string,
  username: string,
  avatar_url: string,
  email: string,
) {
  try {
    const encrypt_token: encrypted = encrypt(access_token);

    const respone = await updateGithubDetails(
      encrypt_token,
      username,
      avatar_url,
      email,
    );
    //console.log("Updated User:", respone);
    return NextResponse.json({ data: respone }, { status: 200 });
  } catch (error) {
    console.log("Controller:", error);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
