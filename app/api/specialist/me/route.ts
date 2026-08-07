// app/api/specialist/me/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { hashPassword, comparePassword } from "@/lib/auth/password";
import { ok, apiErrors } from "@/lib/api/response";

async function getAuthenticatedSpecialist(session: any) {
  let user = await db.user.findUnique({
    where: { id: session.userId },
    include: { center: { select: { name: true } } },
  });
  if (!user && session.email) {
    user = await db.user.findUnique({
      where: { email: session.email },
      include: { center: { select: { name: true } } },
    });
  }
  if (user && user.role !== "SPECIALIST") return null;
  return user;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const user = await getAuthenticatedSpecialist(session);
    if (!user) return apiErrors.notFound("المستخدم الأخصائي");

    // Real patients count assigned to this specialist
    const patientsCount = await db.child.count({
      where: { specialistId: user.id },
    });

    // Real sessions this week for this specialist
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const sessionsThisWeek = await db.appointment.count({
      where: {
        specialistId: user.id,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    // Total reports authored by this specialist
    const pendingReports = await db.report.count({
      where: {
        authorId: user.id,
        type: { not: "DAILY" },
      },
    });

    // Unread messages for this specialist
    const unreadMessages = await db.message.count({
      where: {
        receiverId: user.id,
        read: false,
      },
    });

    // Calculate weekly sessions breakdown (Sunday through Thursday)
    const dayCounts = [0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu
    const weekAppointments = await db.appointment.findMany({
      where: {
        specialistId: user.id,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      select: { date: true },
    });

    weekAppointments.forEach((apt) => {
      const day = new Date(apt.date).getDay();
      if (day >= 0 && day <= 4) {
        dayCounts[day] += 1;
      }
    });

    const formatted = {
      id: user.id,
      name: user.name,
      speciality: user.speciality || "أخصائي توحد وتخاطب",
      email: user.email,
      phone: user.phone || "",
      centerName: user.center?.name || "غير مسجل في مركز",
      licenseNumber: user.licenseNumber || "",
      experience: user.experience || 0,
      patientsCount,
      sessionsThisWeek,
      pendingReports,
      unreadMessages,
      weeklyStats: dayCounts,
    };

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/specialist/me]", e);
    return apiErrors.internal();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const user = await getAuthenticatedSpecialist(session);
    if (!user) return apiErrors.notFound("المستخدم");

    const body = await req.json();
    const { name, phone, speciality, experience, currentPassword, newPassword } = body;

    const data: any = {};
    if (name) data.name = name.trim();
    if (phone !== undefined) data.phone = phone?.trim() || null;
    if (speciality !== undefined) data.speciality = speciality?.trim() || null;
    if (experience !== undefined) data.experience = Number(experience);

    if (newPassword) {
      if (!currentPassword) return apiErrors.badRequest("كلمة المرور الحالية مطلوبة");
      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) return apiErrors.badRequest("كلمة المرور الحالية غير صحيحة");
      data.password = await hashPassword(newPassword);
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data,
    });

    return ok(updated);
  } catch (e) {
    console.error("[PATCH /api/specialist/me]", e);
    return apiErrors.internal();
  }
}
