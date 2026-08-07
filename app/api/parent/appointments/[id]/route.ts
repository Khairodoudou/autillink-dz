// app/api/parent/appointments/[id]/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

async function getAuthenticatedParent(session: any) {
  let parent = await db.user.findUnique({ where: { id: session.userId } });
  if (!parent && session.email) {
    parent = await db.user.findUnique({ where: { email: session.email } });
  }
  return parent;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const appointment = await db.appointment.findUnique({
      where: { id },
      include: { child: { select: { parentId: true } } },
    });

    if (!appointment) return apiErrors.notFound("الموعد");
    if (appointment.child.parentId !== parent.id) return apiErrors.forbidden();

    const updated = await db.appointment.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return ok(updated);
  } catch (e) {
    console.error("[PATCH /api/parent/appointments/[id]]", e);
    return apiErrors.internal();
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
    const appointment = await db.appointment.findUnique({
      where: { id },
      include: { child: { select: { parentId: true } } },
    });

    if (!appointment) return apiErrors.notFound("الموعد");
    if (appointment.child.parentId !== parent.id) return apiErrors.forbidden();

    await db.appointment.delete({ where: { id } });
    return ok({ message: "تم إلغاء/حذف الموعد بنجاح" });
  } catch (e) {
    console.error("[DELETE /api/parent/appointments/[id]]", e);
    return apiErrors.internal();
  }
}
