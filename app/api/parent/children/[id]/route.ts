// app/api/parent/children/[id]/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { ok, apiErrors } from "@/lib/api/response";

async function getAuthenticatedParent(session: any) {
  let parent = await db.user.findUnique({ where: { id: session.userId } });
  if (!parent && session.email) {
    parent = await db.user.findUnique({ where: { email: session.email } });
  }
  return parent;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    const { id } = await params;
    const child = await db.child.findUnique({
      where: { id },
      include: {
        specialist: { select: { name: true, speciality: true, phone: true } },
        reports: { orderBy: { createdAt: "desc" } },
        appointments: { orderBy: { date: "asc" } },
        assessments: { orderBy: { createdAt: "desc" } },
        gameScores: true,
      },
    });

    if (!child) return apiErrors.notFound("الطفل");
    if (child.parentId !== parent.id) return apiErrors.forbidden();

    return ok(child);
  } catch (e) {
    console.error("[GET /api/parent/children/[id]]", e);
    return apiErrors.internal();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, params);
}

async function handleUpdate(
  req: NextRequest,
  paramsPromise: Promise<{ id: string }>
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    const { id } = await paramsPromise;
    const body = await req.json();
    const { name, age, birthDate, pin, diagnosisLevel, autismLevel, avatarColor } = body;

    const child = await db.child.findUnique({ where: { id } });
    if (!child) return apiErrors.notFound("الطفل");
    if (child.parentId !== parent.id) return apiErrors.forbidden();

    const data: any = {};

    if (name && name.trim()) {
      data.name = name.trim();
      data.avatarInitial = name.trim()[0] || "ط";
    }

    if (pin && pin.toString().length >= 4) {
      data.pinCode = await hashPassword(pin.toString());
    }

    if (avatarColor) {
      data.avatarColor = avatarColor;
    }

    const levelMapReverse: Record<string, "LEGER" | "MOYEN" | "SEVERE"> = {
      "خفيف": "LEGER",
      "متوسط": "MOYEN",
      "شديد": "SEVERE",
      LEGER: "LEGER",
      MOYEN: "MOYEN",
      SEVERE: "SEVERE",
    };

    const targetLevel = diagnosisLevel || autismLevel;
    if (targetLevel && levelMapReverse[targetLevel]) {
      data.autismLevel = levelMapReverse[targetLevel];
    }

    if (birthDate) {
      const parsed = new Date(birthDate);
      if (!isNaN(parsed.getTime())) {
        data.birthDate = parsed;
      }
    } else if (age) {
      const year = new Date().getFullYear() - (Number(age) || 5);
      data.birthDate = new Date(`${year}-01-01`);
    }

    const updated = await db.child.update({
      where: { id },
      data,
    });

    return ok(updated);
  } catch (e: any) {
    console.error("[UPDATE /api/parent/children/[id]] Error:", e);
    return apiErrors.badRequest(e?.message || "تعذر تحديث بيانات الطفل");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    const { id } = await params;
    const child = await db.child.findUnique({ where: { id } });
    if (!child) return apiErrors.notFound("الطفل");
    if (child.parentId !== parent.id) return apiErrors.forbidden();

    await db.child.delete({ where: { id } });
    return ok({ message: "تم حذف ملف الطفل بنجاح" });
  } catch (e) {
    console.error("[DELETE /api/parent/children/[id]]", e);
    return apiErrors.internal();
  }
}
