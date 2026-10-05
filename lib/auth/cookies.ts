import { NextResponse } from "next/server";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const ACCESS_COOKIE_NAME = "bh_access";
export const REFRESH_COOKIE_NAME = "bh_refresh";

const isProduction = process.env.NODE_ENV === "production";

export const ACCESS_COOKIE_MAX_AGE = 15 * 60; // 15 minutes in seconds
export const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const defaultCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

/**
 * Set auth cookies on a NextResponse object
 */
export function setAuthCookiesOnResponse(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  res.cookies.set(ACCESS_COOKIE_NAME, accessToken, {
    ...defaultCookieOptions,
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });

  res.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    ...defaultCookieOptions,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

/**
 * Set auth cookies directly on Next.js cookie store (for Server Actions & Route Handlers)
 */
export async function setAuthCookiesInStore(
  cookieStore: any,
  accessToken: string,
  refreshToken: string,
) {
  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, {
    ...defaultCookieOptions,
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });

  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    ...defaultCookieOptions,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

/**
 * Clear all auth and legacy cache cookies on a NextResponse
 */
export function clearAuthCookiesOnResponse(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE_NAME, "", {
    ...defaultCookieOptions,
    maxAge: 0,
  });
  res.cookies.set(REFRESH_COOKIE_NAME, "", {
    ...defaultCookieOptions,
    maxAge: 0,
  });
  res.cookies.set("x-proxy-data", "", {
    ...defaultCookieOptions,
    maxAge: 0,
  });
}

/**
 * Clear all auth cookies on Next.js cookie store (for Server Actions)
 */
export async function clearAuthCookiesInStore(cookieStore: any) {
  cookieStore.set(ACCESS_COOKIE_NAME, "", {
    ...defaultCookieOptions,
    maxAge: 0,
  });
  cookieStore.set(REFRESH_COOKIE_NAME, "", {
    ...defaultCookieOptions,
    maxAge: 0,
  });
  cookieStore.set("x-proxy-data", "", {
    ...defaultCookieOptions,
    maxAge: 0,
  });
}
