/**
 * Enhanced fetch wrapper that handles automatic token refresh on 401 Unauthorized
 * and distinguishes between 401 (token expired) and 403 (insufficient permissions).
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  let response = await fetch(input, init);

  // If unauthorized (token expired), attempt to refresh token once
  if (response.status === 401) {
    // Avoid recursive refresh calls if the refresh endpoint itself or checking me endpoint returns 401
    const urlStr = typeof input === "string" ? input : input.toString();
    if (urlStr.includes("/api/auth/refresh")) {
      return response;
    }

    try {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (refreshRes.ok) {
        // Retry the original request with the fresh token cookies
        response = await fetch(input, init);
      } else {
        // If refresh fails and we are on a protected page (not /login, /register, or /), redirect
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const isPublic =
            currentPath === "/" ||
            currentPath === "/login" ||
            currentPath === "/register" ||
            currentPath === "/get-started" ||
            currentPath.startsWith("/u/");

          // Only redirect if this is an explicit data fetch from a protected page, not a background user check
          if (!isPublic && !urlStr.includes("/api/user/me")) {
            window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
          }
        }
      }
    } catch (refreshErr) {
      console.error("Auto token refresh failed:", refreshErr);
    }
  }

  // If forbidden (role / permission mismatch), do not retry
  if (response.status === 403) {
    console.error("Forbidden: You do not have permission to perform this action.");
  }

  return response;
}
