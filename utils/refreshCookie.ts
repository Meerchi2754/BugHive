"use server";
import { cookies } from "next/headers";

type cookie = { role: string; onboarding_complete: boolean };
export async function refreshCookie() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("x-proxy-data")?.value;
  const data: cookie = JSON.parse(cookieValue!);
  data.onboarding_complete = true;
  cookieStore.set("x-proxy-data", JSON.stringify(data));
}
