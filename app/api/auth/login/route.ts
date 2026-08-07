// app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { comparePassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { ok, apiErrors } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiErrors.badRequest("البريد الإلكتروني وكلمة المرور مطلوبان");
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return apiErrors.badRequest("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    if (!user.isActive) {
      return apiErrors.forbidden();
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return apiErrors.badRequest("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    // Mettre à jour lastLoginAt
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      userId: user.id,
      role: user.role as "PARENT" | "SPECIALIST" | "ADMIN",
      email: user.email,
    };

    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // Redirection selon le rôle
    const redirectMap: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      PARENT: "/parent/dashboard",
      SPECIALIST: "/specialist/dashboard",
    };
    const redirectTo = redirectMap[user.role] ?? "/";

    const response = ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo,
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    return response;
  } catch (e) {
    console.error("[POST /api/auth/login]", e);
    return apiErrors.internal();
  }
}
