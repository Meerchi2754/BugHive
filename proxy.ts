import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ProxyCookie } from "./types";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const cached = req.cookies.get("x-proxy-data")?.value;
  let proxyData: ProxyCookie | null = null;

  if (cached) {
    try {
      proxyData = JSON.parse(cached);
    } catch {
      proxyData = null;
    }
  }

  if (!proxyData) {
    const { data: userDB } = await supabase
      .from("users")
      .select("role, onboarding_complete")
      .eq("email", user.email!)
      .maybeSingle();

    if (!userDB) return res;

    proxyData = {
      role: userDB.role,
      onboarding_complete: userDB.onboarding_complete,
    };

    res.cookies.set("x-proxy-data", JSON.stringify(proxyData), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1,
      path: "/",
    });
  }

  if (proxyData.role === "MAINTAINER") {
    if (
      !proxyData.onboarding_complete &&
      pathname !== "/onboarding/maintainer"
    ) {
      return NextResponse.redirect(new URL("/onboarding/maintainer", req.url));
    } else if (
      proxyData.onboarding_complete &&
      pathname !== "/maintainer/shortlist"
    ) {
      return NextResponse.redirect(new URL("/maintainer/shortlist", req.url));
    }
  }

  if (
    !proxyData.onboarding_complete &&
    pathname !== "/onboarding" &&
    proxyData.role === "CONTRIBUTOR"
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (
    proxyData.role !== "CONTRIBUTOR" &&
    pathname.startsWith("/dashboard/claims")
  ) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  if (proxyData.role !== "ADMIN" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/noAccess", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/admin",
    "/dashboard/:path*",
    "/dashboard/claims/:path*",
  ],
};
