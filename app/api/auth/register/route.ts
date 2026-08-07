// app/api/auth/register/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { ok, apiErrors } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, phone, wilaya, speciality, licenseNumber, experience } = body;

    if (!name || !email || !password || !role) {
      return apiErrors.badRequest("جميع الحقول الإلزامية مطلوبة");
    }

    if (!["PARENT", "SPECIALIST"].includes(role)) {
      return apiErrors.badRequest("الدور غير صالح");
    }

    if (password.length < 6) {
      return apiErrors.badRequest("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return apiErrors.conflict("هذا البريد الإلكتروني مسجّل مسبقاً");
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        phone: phone?.trim() || null,
        wilaya: wilaya?.trim() || null,
        speciality: role === "SPECIALIST" ? speciality?.trim() || null : null,
        licenseNumber: role === "SPECIALIST" ? licenseNumber?.trim() || null : null,
        experience: role === "SPECIALIST" && experience ? Number(experience) : null,
      },
    });

    // Create 3-day grace period pending subscription (0 DA)
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    await db.individualSubscription.create({
      data: {
        parentId: user.id,
        price: 0,
        startDate: now,
        endDate: threeDaysLater,
        status: "PENDING",
      },
    });

    const payload = {
      userId: user.id,
      role: user.role as "PARENT" | "SPECIALIST" | "ADMIN",
      email: user.email,
    };

    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    const redirectMap: Record<string, string> = {
      PARENT: "/parent/dashboard",
      SPECIALIST: "/specialist/dashboard",
    };

    const response = ok({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirectTo: redirectMap[user.role] ?? "/",
    }, 201);

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (e) {
    console.error("[POST /api/auth/register]", e);
    return apiErrors.internal();
  }
}
