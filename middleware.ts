// middleware.ts
// Protection JWT de toutes les routes privées
import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken, verifyChildToken } from "@/lib/auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/about",
  "/features",
  "/pricing",
  "/contact",
  "/testimonials",
  "/terms",
  "/privacy",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Laisser passer les fichiers statiques et les routes API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ─── Routes publiques ────────────────────────────────────────────────────
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // ─── Routes Child Mode — nécessitent child_token ─────────────────────────
  if (pathname.startsWith("/child-mode")) {
    const childToken = request.cookies.get("child_token")?.value;
    if (!childToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    const childSession = await verifyChildToken(childToken);
    if (!childSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      const response = NextResponse.redirect(url);
      response.cookies.delete("child_token");
      return response;
    }
    // Vérifier que l'ID dans l'URL correspond au token
    const segments = pathname.split("/");
    const idInUrl = segments[2]; // /child-mode/[id]/...
    if (idInUrl && childSession.childId !== idInUrl) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ─── Routes protégées par rôle ───────────────────────────────────────────
  const accessToken = request.cookies.get("access_token")?.value;
  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const session = await verifyAccessToken(accessToken);
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const response = NextResponse.redirect(url);
    response.cookies.delete("access_token");
    return response;
  }

  // Vérification du rôle par espace
  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/parent") && session.role !== "PARENT") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/specialist") && session.role !== "SPECIALIST") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Vérification des routes API privées
  if (pathname.startsWith("/api/admin") && session.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Accès interdit" }, { status: 403 });
  }
  if (pathname.startsWith("/api/parent") && session.role !== "PARENT") {
    return NextResponse.json({ ok: false, error: "Accès interdit" }, { status: 403 });
  }
  if (pathname.startsWith("/api/specialist") && session.role !== "SPECIALIST") {
    return NextResponse.json({ ok: false, error: "Accès interdit" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
