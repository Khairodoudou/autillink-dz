// lib/auth/jwt.ts
// JWT avec jose (compatible Edge Runtime / Next.js middleware)

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const accessSecret = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? "autilink_access_secret_dev_fallback"
);
const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? "autilink_refresh_secret_dev_fallback"
);
const childSecret = new TextEncoder().encode(
  process.env.JWT_CHILD_SECRET ?? "autilink_child_secret_dev_fallback"
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserTokenPayload extends JWTPayload {
  userId: string;
  role: "PARENT" | "SPECIALIST" | "ADMIN";
  email: string;
}

export interface ChildTokenPayload extends JWTPayload {
  childId: string;
  parentId: string;
  scope: "child-mode"; // scope limité, jamais confondu avec un token User
}

// ─── Access Token (15 min) ────────────────────────────────────────────────────

export async function signAccessToken(payload: UserTokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret);
}

export async function verifyAccessToken(token: string): Promise<UserTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecret);
    return payload as UserTokenPayload;
  } catch {
    return null;
  }
}

// ─── Refresh Token (7 jours) ──────────────────────────────────────────────────

export async function signRefreshToken(payload: UserTokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(refreshSecret);
}

export async function verifyRefreshToken(token: string): Promise<UserTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload as UserTokenPayload;
  } catch {
    return null;
  }
}

// ─── Child Session Token (2 heures, scope "child-mode") ───────────────────────
// Ce token est DISTINCT du token User. Il ne peut PAS accéder aux routes /api/parent|specialist|admin.
// Chaque route child-mode doit vérifier session.childId === params.id.

export async function signChildToken(payload: ChildTokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(childSecret);
}

export async function verifyChildToken(token: string): Promise<ChildTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, childSecret);
    if ((payload as ChildTokenPayload).scope !== "child-mode") return null;
    return payload as ChildTokenPayload;
  } catch {
    return null;
  }
}
