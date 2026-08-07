// app/api/specialist/appointments/route.ts
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

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const specialist = await getAuthenticatedSpecialist(session);
    if (!specialist) return apiErrors.unauthorized();

    // Fetch appointments for this specialist or unassigned ones
    let appointments = await db.appointment.findMany({
      where: {
        OR: [
          { specialistId: specialist.id },
          { specialistId: null },
        ],
      },
      include: {
        child: { select: { id: true, name: true, autismLevel: true, avatarColor: true } },
      },
      orderBy: { date: "asc" },
    });

    // If no appointments exist in DB yet, fallback to all appointments
    if (appointments.length === 0) {
      appointments = await db.appointment.findMany({
        include: {
          child: { select: { id: true, name: true, autismLevel: true, avatarColor: true } },
        },
        orderBy: { date: "asc" },
      });
    }

    const statusMap: Record<string, "قادم" | "مكتمل" | "ملغى"> = {
      PENDING: "قادم",
      CONFIRMED: "قادم",
      DONE: "مكتمل",
      CANCELLED: "ملغى",
    };

    const typeMap: Record<string, "جلسة علاج" | "تقييم" | "استشارة"> = {
      SESSION: "جلسة علاج",
      ASSESSMENT: "تقييم",
      CONSULTATION: "استشارة",
    };

    const formatted = appointments.map((a) => {
      const dateObj = new Date(a.date);
      const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split("T")[0] : a.date.toString();

      return {
        id: a.id,
        date: dateStr,
        time: a.time || "10:00",
        duration: a.duration || 45,
        patientId: a.childId,
        patientName: a.child.name,
        type: typeMap[a.type] || "جلسة علاج",
        status: statusMap[a.status] || "قادم",
        location: a.location || "غرفة التخاطب 2",
        notes: a.notes || "",
      };
    });

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/specialist/appointments]", e);
    return apiErrors.internal();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const specialist = await getAuthenticatedSpecialist(session);
    if (!specialist) return apiErrors.unauthorized();

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) return apiErrors.badRequest("معرف الموعد والحالة مطلوبان");

    const statusMapReverse: Record<string, string> = {
      "قادم": "CONFIRMED",
      "مكتمل": "DONE",
      "ملغى": "CANCELLED",
    };

    const updated = await db.appointment.update({
      where: { id },
      data: { status: statusMapReverse[status] || status },
    });

    return ok(updated);
  } catch (e) {
    console.error("[PATCH /api/specialist/appointments]", e);
    return apiErrors.internal();
  }
}
