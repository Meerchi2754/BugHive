import { createClient } from "@/lib/supabase/client";
type OAuthProvider = "github" | "google";

export async function oAuth(
  providerAuth: OAuthProvider,
  role: string,
  action: string,
  token?: string | null,
) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: providerAuth,
    options: {
      redirectTo: `http://localhost:3000/api/auth/oAuth/callback?role=${role}&action=${action}&token=${token}`,
      scopes:
        providerAuth === "github"
          ? "read:user user:email repo"
          : "email profile",
    },
  });
  if (error) {
    console.error("OAuth error:", error.message);
    return;
  }
  console.log("AUTH", data);
}
