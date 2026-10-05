import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/tokens";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME, clearAuthCookiesOnResponse } from "@/lib/auth/cookies";
import { isPublicPath, checkRoleAccess } from "@/lib/auth/rbac";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip public assets, metadata, and all API endpoints
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;

  let userPayload = accessToken ? await verifyAccessToken(accessToken) : null;
  let res = NextResponse.next();

  // 2. If access token is expired or absent, attempt background refresh using refresh token
  if (!userPayload && refreshToken) {
    try {
      const refreshUrl = new URL("/api/auth/refresh", req.url);
      const refreshRes = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        userPayload = {
          sub: data.user.id,
          email: data.user.email,
          role: data.user.role,
          onboarding_complete: data.user.onboarding_complete,
        };

        // Forward cookies returned by the refresh endpoint to both browser and request
        const setCookieHeaders = refreshRes.headers.getSetCookie
          ? refreshRes.headers.getSetCookie()
          : [refreshRes.headers.get("set-cookie") || ""];

        setCookieHeaders.forEach((cookieStr) => {
          if (cookieStr) {
            res.headers.append("set-cookie", cookieStr);
          }
        });
      }
    } catch (refreshErr) {
      console.error("Proxy refresh token error:", refreshErr);
    }
  }

  // 3. If still no valid user session, redirect to login
  if (!userPayload) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("returnUrl", pathname);
    const redirectRes = NextResponse.redirect(redirectUrl);
    clearAuthCookiesOnResponse(redirectRes);
    return redirectRes;
  }

  // 4. Enforce RBAC and onboarding flow
  const rbacResult = checkRoleAccess(
    pathname,
    userPayload.role,
    userPayload.onboarding_complete,
  );

  if (!rbacResult.allowed && rbacResult.redirectTo) {
    return NextResponse.redirect(new URL(rbacResult.redirectTo, req.url));
  }

  // 5. Inject user identity headers for downstream Server Components
  res.headers.set("x-user-id", userPayload.sub);
  res.headers.set("x-user-email", userPayload.email);
  res.headers.set("x-user-role", userPayload.role || "");

  return res;
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, manifest files
     * - public files (images, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
