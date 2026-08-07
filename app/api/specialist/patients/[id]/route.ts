// app/api/specialist/patients/[id]/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const { id } = await params;
    const patient = await db.child.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, name: true, phone: true, email: true } },
        reports: { orderBy: { createdAt: "desc" } },
        appointments: { orderBy: { date: "asc" } },
        assessments: { orderBy: { createdAt: "desc" } },
        gameScores: true,
      },
    });

    if (!patient) return apiErrors.notFound("المريض");

    const levelMap: Record<string, "خفيف" | "متوسط" | "شديد"> = {
      LEGER: "خفيف",
      MOYEN: "متوسط",
      SEVERE: "شديد",
    };

    const age = new Date().getFullYear() - patient.birthDate.getFullYear();

    const formatted = {
      id: patient.id,
      name: patient.name,
      age: age > 0 ? age : 6,
      parentName: patient.parent.name,
      parentPhone: patient.parent.phone || "غير محدد",
      parentEmail: patient.parent.email,
      diagnosisLevel: levelMap[patient.autismLevel || "MOYEN"] || "متوسط",
      diagnosisDate: patient.createdAt.toISOString().split("T")[0],
      avatarColor: patient.avatarColor || "#E97F6B",
      avatarInitial: patient.avatarInitial || patient.name[0],
      sessionsCount: patient.appointments.length,
      reports: patient.reports,
      appointments: patient.appointments,
      assessments: patient.assessments,
      gameScores: patient.gameScores,
      skills: {
        communication: 65,
        social: 55,
        sensory: 70,
        motor: 75,
        cognitive: 65,
      },
      skillsHistory: [
        { month: "مايو", communication: 44, social: 30, sensory: 55, motor: 63, cognitive: 50 },
        { month: "يونيو", communication: 48, social: 35, sensory: 60, motor: 67, cognitive: 55 },
        { month: "يوليو", communication: 52, social: 38, sensory: 63, motor: 68, cognitive: 58 },
        { month: "أغسطس", communication: 65, social: 55, sensory: 70, motor: 75, cognitive: 65 },
      ],
      notes: "تقدم ممتاز في المهارات الحركية والتواصلية.",
    };

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/specialist/patients/[id]]", e);
    return apiErrors.internal();
  }
}
