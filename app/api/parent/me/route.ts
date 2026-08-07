// app/api/parent/me/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { hashPassword, comparePassword } from "@/lib/auth/password";
import { ok, apiErrors } from "@/lib/api/response";

async function getAuthenticatedUser(session: any) {
  let user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user && session.email) {
    user = await db.user.findUnique({ where: { email: session.email } });
  }
  return user;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const user = await getAuthenticatedUser(session);
    if (!user) return apiErrors.notFound("المستخدم");

    return ok({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      wilaya: user.wilaya,
      address: user.address,
    });
  } catch (e) {
    console.error("[GET /api/parent/me]", e);
    return apiErrors.internal();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const user = await getAuthenticatedUser(session);
    if (!user) return apiErrors.notFound("المستخدم");

    const body = await req.json();
    const { name, phone, wilaya, address, currentPassword, newPassword } = body;

    const data: any = {};
    if (name !== undefined) data.name = name?.trim() || user.name;
    if (phone !== undefined) data.phone = phone?.trim() || null;
    if (wilaya !== undefined) data.wilaya = wilaya?.trim() || null;
    if (address !== undefined) data.address = address?.trim() || null;

    if (newPassword) {
      if (!currentPassword) return apiErrors.badRequest("كلمة المرور الحالية مطلوبة لتغيير كلمة المرور");
      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) return apiErrors.badRequest("كلمة المرور الحالية غير صحيحة");
      if (newPassword.length < 8) return apiErrors.badRequest("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      data.password = await hashPassword(newPassword);
    }

    if (Object.keys(data).length === 0) return apiErrors.badRequest("لا توجد بيانات للتحديث");

    const updated = await db.user.update({
      where: { id: user.id },
      data,
      select: { id: true, name: true, email: true, phone: true, wilaya: true, address: true },
    });

    return ok(updated);
  } catch (e) {
    console.error("[PATCH /api/parent/me]", e);
    return apiErrors.internal();
  }
}
