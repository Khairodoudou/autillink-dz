// app/api/admin/users/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return apiErrors.unauthorized();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role && ["PARENT", "SPECIALIST", "ADMIN"].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        wilaya: true,
        center: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role.toLowerCase(),
      roleLabel: u.role === "PARENT" ? "ولي أمر" : u.role === "SPECIALIST" ? "أخصائي" : "مدير",
      status: u.isActive ? "نشط" : "غير نشط",
      joinDate: u.createdAt.toISOString().split("T")[0],
      lastLogin: u.lastLoginAt ? u.lastLoginAt.toISOString().split("T")[0] : "لم يدخل بعد",
      centerId: u.center?.id,
      centerName: u.center?.name,
      wilaya: u.wilaya || "غير محدد",
    }));

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/admin/users]", e);
    return apiErrors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return apiErrors.unauthorized();

    const body = await req.json();
    const { name, email, password, role, wilaya, centerId } = body;

    if (!name || !email || !password || !role) {
      return apiErrors.badRequest("الحقول الأساسية مطلوبة");
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) return apiErrors.conflict("البريد الإلكتروني مستخدم بالفعل");

    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role.toUpperCase(),
        wilaya: wilaya?.trim() || null,
        centerId: centerId || null,
      },
    });

    return ok(newUser, 201);
  } catch (e) {
    console.error("[POST /api/admin/users]", e);
    return apiErrors.internal();
  }
}
