// app/api/parent/children/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    // Verify parent user exists in database (handles post-reseed cookie mismatch)
    let parent = await db.user.findUnique({ where: { id: session.userId } });
    if (!parent && session.email) {
      parent = await db.user.findUnique({ where: { email: session.email } });
    }
    if (!parent) return apiErrors.unauthorized();

    const children = await db.child.findMany({
      where: { parentId: parent.id },
      include: {
        specialist: { select: { name: true, center: { select: { name: true } } } },
        gameScores: true,
        reports: { orderBy: { createdAt: "desc" }, take: 10 },
      },
      orderBy: { createdAt: "desc" },
    });

    const levelMap: Record<string, "خفيف" | "متوسط" | "شديد"> = {
      LEGER: "خفيف",
      MOYEN: "متوسط",
      SEVERE: "شديد",
    };

    const formatted = children.map((c) => {
      const age = new Date().getFullYear() - c.birthDate.getFullYear();
      const stars = c.gameScores.reduce((acc, curr) => acc + curr.stars, 0);

      const dailyReports = c.reports.filter((r) => r.type === "DAILY");
      const recentMoods = dailyReports.map((r) => r.mood || 4).slice(0, 7);
      const recentSleeps = dailyReports.map((r) => r.sleepHours || 8).slice(0, 7);

      while (recentMoods.length < 7) recentMoods.push(4);
      while (recentSleeps.length < 7) recentSleeps.push(8);

      const latestDaily = dailyReports[0];

      return {
        id: c.id,
        name: c.name,
        age: age > 0 ? age : 5,
        birthDate: c.birthDate.toISOString().split("T")[0],
        pin: "****",
        avatarColor: c.avatarColor || "#E97F6B",
        avatarInitial: c.avatarInitial || c.name[0],
        parentId: c.parentId,
        specialistName: c.specialist?.name || "د. سارة كمال",
        centerName: c.specialist?.center?.name || "مركز الأمل لرعاية التوحد",
        diagnosisLevel: levelMap[c.autismLevel || "MOYEN"] || "متوسط",
        joinDate: c.createdAt.toISOString().split("T")[0],
        stars,
        streakDays: Math.max(1, dailyReports.length),
        lastActivity: latestDaily ? "اليوم" : "مؤخراً",
        stats: {
          mood: latestDaily?.mood || 4,
          sleep: latestDaily?.sleepHours || 8,
          tantrums: latestDaily?.tantrums || 0,
          newWords: latestDaily?.newWords ? JSON.parse(latestDaily.newWords).length : 0,
          exercises: latestDaily?.exercises ? JSON.parse(latestDaily.exercises).length : 0,
          appointments: 2,
        },
        weeklyMood: recentMoods.reverse(),
        weeklySleep: recentSleeps.reverse(),
      };
    });

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/parent/children]", e);
    return apiErrors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    // Verify parent user in database
    let parent = await db.user.findUnique({ where: { id: session.userId } });
    if (!parent && session.email) {
      parent = await db.user.findUnique({ where: { email: session.email } });
    }
    if (!parent) return apiErrors.unauthorized();

    const body = await req.json();
    const { name, age, birthDate, pin, diagnosisLevel, avatarColor } = body;

    if (!name || !name.trim()) return apiErrors.badRequest("اسم الطفل مطلوب");
    if (!pin || pin.toString().length < 4) return apiErrors.badRequest("رمز PIN يجب أن يتكون من 4 أرقام");

    const hashedPin = await hashPassword(pin.toString());

    const levelMapReverse: Record<string, "LEGER" | "MOYEN" | "SEVERE"> = {
      "خفيف": "LEGER",
      "متوسط": "MOYEN",
      "شديد": "SEVERE",
    };

    let childBirthDate: Date;
    if (birthDate) {
      childBirthDate = new Date(birthDate);
    } else {
      const year = new Date().getFullYear() - (Number(age) || 5);
      childBirthDate = new Date(`${year}-01-01`);
    }

    if (isNaN(childBirthDate.getTime())) {
      childBirthDate = new Date();
    }

    // Inherit specialistId from sibling if exists
    const siblingWithSpecialist = await db.child.findFirst({
      where: { parentId: parent.id, specialistId: { not: null } },
      select: { specialistId: true },
    });

    const child = await db.child.create({
      data: {
        id: `child-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        birthDate: childBirthDate,
        autismLevel: levelMapReverse[diagnosisLevel] || "MOYEN",
        pinCode: hashedPin,
        avatarColor: avatarColor || "#2E8B7E",
        avatarInitial: name.trim()[0] || "ط",
        parentId: parent.id,
        specialistId: siblingWithSpecialist?.specialistId || null,
      },
    });

    return ok(child, 201);
  } catch (e: any) {
    console.error("[POST /api/parent/children] Error:", e);
    return apiErrors.badRequest(e?.message || "تعذر إضافة الطفل");
  }
}
