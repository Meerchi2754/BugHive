import { Role } from "@/types";

export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/get-started",
  "/register",
  "/noAccess",
  "/test.html",
  "/manifest.webmanifest",
  "/manifest.json",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/u/")) return true; // public contributor profiles
  if (pathname.startsWith("/api/")) return true; // API routes handle their own JSON auth/errors
  if (pathname.startsWith("/_next/")) return true;
  return false;
}

export interface RBACCheckResult {
  allowed: boolean;
  redirectTo?: string;
}

/**
 * Validate role and onboarding status against the requested path.
 */
export function checkRoleAccess(
  pathname: string,
  role: Role,
  onboarding_complete: boolean,
): RBACCheckResult {
  // If user has no valid role
  if (!role) {
    return { allowed: false, redirectTo: "/login" };
  }

  // Admin section protection
  if (pathname.startsWith("/admin")) {
    if (role === "ADMIN") {
      return { allowed: true };
    }
    return { allowed: false, redirectTo: "/noAccess" };
  }

  // Maintainer section & onboarding flow
  if (role === "MAINTAINER") {
    if (!onboarding_complete) {
      if (pathname !== "/onboarding/maintainer") {
        return { allowed: false, redirectTo: "/onboarding/maintainer" };
      }
      return { allowed: true };
    }

    if (pathname === "/onboarding/maintainer") {
      return { allowed: false, redirectTo: "/maintainer/shortlist" };
    }

    if (
      pathname.startsWith("/maintainer") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/claims")
    ) {
      return { allowed: true };
    }

    return { allowed: false, redirectTo: "/maintainer/shortlist" };
  }

  // Contributor section & onboarding flow
  if (role === "CONTRIBUTOR") {
    if (!onboarding_complete) {
      if (pathname !== "/onboarding") {
        return { allowed: false, redirectTo: "/onboarding" };
      }
      return { allowed: true };
    }

    if (pathname === "/onboarding") {
      return { allowed: false, redirectTo: "/dashboard/claims" };
    }

    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/claims")
    ) {
      return { allowed: true };
    }

    return { allowed: false, redirectTo: "/dashboard/claims" };
  }

  // Verifier section
  if (role === "VERIFIER") {
    if (
      pathname.startsWith("/verify") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/claims")
    ) {
      return { allowed: true };
    }

    return { allowed: false, redirectTo: "/verify/claims" };
  }

  // Default fallback
  return { allowed: true };
}
