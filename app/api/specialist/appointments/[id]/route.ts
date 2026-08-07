// app/api/specialist/appointments/[id]/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

async function getAuthenticatedSpecialist(session: any) {
  let user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user && session.email) {
    user = await db.user.findUnique({ where: { email: session.email } });
  }
  if (user && user.role !== "SPECIALIST") return null;
  return user;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const specialist = await getAuthenticatedSpecialist(session);
    if (!specialist) return apiErrors.unauthorized();

    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const statusMapReverse: Record<string, string> = {
      "قادم": "CONFIRMED",
      "مكتمل": "DONE",
      "ملغى": "CANCELLED",
      CONFIRMED: "CONFIRMED",
      DONE: "DONE",
      CANCELLED: "CANCELLED",
    };

    const data: any = {};
    if (status) data.status = statusMapReverse[status] || status;
    if (notes !== undefined) data.notes = notes?.trim() || null;

    const appointment = await db.appointment.findUnique({ where: { id } });
    if (!appointment) return apiErrors.notFound("الموعد");

    const updated = await db.appointment.update({
      where: { id },
      data,
    });

    return ok(updated);
  } catch (e) {
    console.error("[PATCH /api/specialist/appointments/[id]]", e);
    return apiErrors.internal();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const specialist = await getAuthenticatedSpecialist(session);
    if (!specialist) return apiErrors.unauthorized();

    const { id } = await params;
    await db.appointment.delete({ where: { id } });

    return ok({ message: "تم إلغاء/حذف الموعد بنجاح" });
  } catch (e) {
    console.error("[DELETE /api/specialist/appointments/[id]]", e);
    return apiErrors.internal();
  }
}
