"use client"
import { claimDB } from "@/types/dashboard/contributor/claimDB.types";
import { createClient } from "../supabase/client";

export async function allClaim(id?: string): Promise<claimDB[]> {
  const supabase = createClient();
  let query = supabase.from("claims").select(`*,pr_table(*)`);
  if (id) {
    query = query.eq("id", id);
  }
  const { data, error } = await query;
  console.log("error:", error);
  if (error) throw new Error(`${error}`);
  console.log("DATSDA:", data);
  return data ?? [];
}
