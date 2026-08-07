// app/api/auth/refresh/route.ts
import { NextRequest } from "next/server";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth/jwt";
import { ok, apiErrors } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;
    if (!refreshToken) return apiErrors.unauthorized();

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) return apiErrors.unauthorized();

    const newAccessToken = await signAccessToken({
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
    });

    const response = ok({ message: "Token renouvelé" });
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });
    return response;
  } catch (e) {
    console.error("[POST /api/auth/refresh]", e);
    return apiErrors.internal();
  }
}
