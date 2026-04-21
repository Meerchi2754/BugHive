"use server";
import { createClient } from "@/lib/supabase/admin";

export async function getSearchUser(search: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("email,github_username,github_avatar_url")
    .or(`username.ilike.%${search}%,email.ilike.%${search}%`)
    .in("role", ["CONTRIBUTOR", "VERIFIER"])
    .limit(1);
  if (error) {
    console.log("Error in getting Search User Claim:", error);
    throw new Error(`${error}`);
  }
  return data;
}

export async function getAllUser() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("email,github_username,github_avatar_url")
    .in("role", ["CONTRIBUTOR", "VERIFIER"])
    .limit(2);
  if (error) {
    console.log("Error in getting All User Claim:", error);
    throw new Error(`${error}`);
  }
  return data;
}
