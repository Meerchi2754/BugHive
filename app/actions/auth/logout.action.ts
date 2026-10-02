"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function logoutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    const cookieStore = await cookies();
    cookieStore.delete("x-proxy-data");
    return { success: true };
  } catch (error) {
    console.error("Logout action error:", error);
    return { success: false, error: (error as Error).message };
  }
}
