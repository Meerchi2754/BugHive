import { createClient } from "@/lib/supabase/admin";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("pr_table").select("pr_url");
    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
