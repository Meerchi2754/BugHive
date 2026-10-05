import { SignJWT, jwtVerify } from "jose";
import { AccessTokenPayload, RefreshTokenPayload } from "@/types/jwtPayload";

// Fallbacks are provided for development safety, but env vars should be set in production
const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "bughive-default-dev-access-secret-32-chars-long!",
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "bughive-default-dev-refresh-secret-32-chars-long!",
);

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

/**
 * Sign a short-lived Access Token (15 minutes).
 */
export async function signAccessToken(
  payload: Omit<AccessTokenPayload, "iat" | "exp">,
): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    onboarding_complete: payload.onboarding_complete,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(ACCESS_SECRET);
}

/**
 * Sign a long-lived Refresh Token (7 days).
 */
export async function signRefreshToken(
  payload: Omit<RefreshTokenPayload, "iat" | "exp">,
): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setJti(payload.jti)
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_SECRET);
}

/**
 * Verify and decode an Access Token. Returns null if invalid or expired.
 */
export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as any,
      onboarding_complete: Boolean(payload.onboarding_complete),
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

/**
 * Verify and decode a Refresh Token. Returns null if invalid or expired.
 */
export async function verifyRefreshToken(
  token: string,
): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return {
      sub: payload.sub as string,
      jti: payload.jti as string,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

/**
 * Cryptographic SHA-256 hash of a token for secure database storage.
 * Uses Web Crypto API for full Edge Runtime and Node.js compatibility.
 */
export async function hashToken(token: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
