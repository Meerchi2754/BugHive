// import { useAuth } from "@/context/authContext";
import { findUser } from "@/services/auth/findUser";
import { NextResponse } from "next/server";
import { UserDB } from "@/types";

export async function findUserByEmail(email: string) {
  try {
    const response: UserDB = await findUser(email);
    return response;
  } catch (error: any) {
    console.error("Error in findUserByEmail:", error);
    throw error;
  }
}
