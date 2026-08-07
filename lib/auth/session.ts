// lib/auth/session.ts
// Helpers pour extraire et vérifier les sessions depuis les cookies

import { cookies } from "next/headers";
import {
  verifyAccessToken,
  verifyChildToken,
  type UserTokenPayload,
  type ChildTokenPayload,
} from "@/lib/auth/jwt";

/**
 * Retourne la session User depuis le cookie access_token.
 * Retourne null si absent, expiré ou invalide.
 */
export async function getSession(): Promise<UserTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

/**
 * Retourne la session enfant depuis le cookie child_token.
 * Retourne null si absent, expiré ou scope incorrect.
 */
export async function getChildSession(): Promise<ChildTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("child_token")?.value;
  if (!token) return null;
  return verifyChildToken(token);
}

/**
 * Vérifie que l'utilisateur connecté a le rôle requis.
 */
export async function requireRole(
  role: "PARENT" | "SPECIALIST" | "ADMIN"
): Promise<UserTokenPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (session.role !== role) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

/**
 * Vérifie qu'une session enfant valide existe et correspond au childId donné.
 * CORRECTION SÉCURITÉ : compare session.childId === expectedChildId pour éviter
 * qu'un enfant A accède aux données de l'enfant B en changeant l'ID dans l'URL.
 */
export async function requireChildSession(expectedChildId: string): Promise<ChildTokenPayload> {
  const session = await getChildSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (session.childId !== expectedChildId) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
