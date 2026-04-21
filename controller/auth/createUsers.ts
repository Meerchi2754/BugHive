// import { useAuth } from "@/context/authContext";
import { createUser } from "@/services/auth/createUser";
import { NextResponse } from "next/server";

export async function userController(
  username: string,
  email: string,
  github_avatar_url: string,
  token: string,
  role: string,
) {
  try {
    const response = await createUser(
      username,
      email,
      github_avatar_url!,
      token,
      role,
    );
    return NextResponse.json(
      { message: "Successfull Created", data: response },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
