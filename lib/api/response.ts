// lib/api/response.ts
// Helpers uniformisés pour les réponses API
// Format : { ok: true, data } | { ok: false, error, code }

import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status });
}

export function err(error: string, status = 400, code?: string): NextResponse {
  return NextResponse.json({ ok: false, error, code }, { status });
}

// Codes HTTP sémantiques
export const apiErrors = {
  unauthorized: () => err("Non authentifié", 401, "UNAUTHORIZED"),
  forbidden: () => err("Accès interdit", 403, "FORBIDDEN"),
  notFound: (resource = "Ressource") => err(`${resource} introuvable`, 404, "NOT_FOUND"),
  badRequest: (msg: string) => err(msg, 400, "BAD_REQUEST"),
  internal: () => err("Erreur serveur interne", 500, "INTERNAL_ERROR"),
  conflict: (msg: string) => err(msg, 409, "CONFLICT"),
  tooManyRequests: (msg: string) => err(msg, 429, "TOO_MANY_REQUESTS"),
};
