// app/api/parent/appointments/route.ts
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

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    const myChildren = await db.child.findMany({
      where: { parentId: parent.id },
      select: { id: true, name: true, specialistId: true },
    });
    const childIds = myChildren.map((c) => c.id);

    const appointments = await db.appointment.findMany({
      where: { childId: { in: childIds } },
      include: {
        child: { select: { name: true } },
        specialist: { select: { name: true, speciality: true, center: { select: { name: true } } } },
      },
      orderBy: { date: "asc" },
    });

    const statusMap: Record<string, "مؤكد" | "قيد الانتظار" | "مكتمل" | "ملغى"> = {
      CONFIRMED: "مؤكد",
      PENDING: "قيد الانتظار",
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
        childId: a.childId,
        childName: a.child.name,
        specialistName: a.specialist?.name || "د. سارة كمال",
        specialistRole: a.specialist?.speciality || "أخصائية تواصل ونطق",
        centerName: a.specialist?.center?.name || "مركز الأمل لرعاية التوحد",
        type: typeMap[a.type] || "جلسة علاج",
        rawType: a.type,
        status: statusMap[a.status] || "مؤكد",
        rawStatus: a.status,
        location: a.location || a.specialist?.center?.name || "مركز الأمل — عيادة 3",
        notes: a.notes || "",
      };
    });

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/parent/appointments]", e);
    return apiErrors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    const body = await req.json();
    const { childId, specialistId: bodySpecialistId, date, time, type, notes } = body;

    if (!childId || !date) return apiErrors.badRequest("الطفل والتاريخ مطلوبان");

    const child = await db.child.findUnique({ where: { id: childId } });
    if (!child || child.parentId !== parent.id) return apiErrors.forbidden();

    const typeMapReverse: Record<string, string> = {
      "جلسة علاج": "SESSION",
      "تقييم": "ASSESSMENT",
      "استشارة": "CONSULTATION",
      SESSION: "SESSION",
      ASSESSMENT: "ASSESSMENT",
      CONSULTATION: "CONSULTATION",
    };

    const appointmentDate = new Date(date);
    // Use the specialist chosen in form, fallback to child's assigned specialist
    const resolvedSpecialistId = bodySpecialistId || child.specialistId || null;

    const appointment = await db.appointment.create({
      data: {
        childId,
        specialistId: resolvedSpecialistId,
        date: isNaN(appointmentDate.getTime()) ? new Date() : appointmentDate,
        time: time || "10:00",
        type: typeMapReverse[type] || "SESSION",
        notes: notes?.trim() || null,
        status: "PENDING",
        location: "مركز الأمل — عيادة التواصل",
      },
    });

    return ok(appointment, 201);
  } catch (e: any) {
    console.error("[POST /api/parent/appointments] Error:", e);
    return apiErrors.badRequest(e?.message || "تعذر إضافة الموعد");
  }
}
