// app/api/parent/reports/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type"); // DAILY | CLINICAL | MONTHLY | ASSESSMENT

    const myChildren = await db.child.findMany({
      where: { parentId: session.userId },
      select: { id: true, name: true },
    });
    const childIds = myChildren.map((c) => c.id);

    const where: any = { childId: { in: childIds } };

    if (typeParam === "DAILY") {
      where.type = "DAILY";
    } else if (typeParam && typeParam !== "الكل" && typeParam !== "ALL") {
      where.type = typeParam;
    } else {
      // By default for Specialist Reports page, fetch reports sent by Specialists (not DAILY logs)
      where.type = { not: "DAILY" };
    }

    const reports = await db.report.findMany({
      where,
      include: {
        child: { select: { name: true } },
        author: { select: { name: true, role: true, speciality: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = reports.map((r) => {
      let recs = "متابعة الخطة العلاجية والتواصل الدائم مع الأخصائي المتابع.";
      let summaryText = r.notes || "";

      if (r.notes && r.notes.includes("[التوصيات]:")) {
        const parts = r.notes.split("[التوصيات]:");
        if (parts[1]) {
          const recPart = parts[1].split("\n[")[0].trim();
          if (recPart) recs = recPart;
        }
      }

      const typeLabel =
        r.type === "MONTHLY"
          ? "تقرير شهري"
          : r.type === "ASSESSMENT"
          ? "تقرير تقييم"
          : r.type === "CLINICAL"
          ? "تقرير متابعة"
          : "يومي";

      return {
        id: r.id,
        date: r.createdAt.toISOString().split("T")[0],
        time: r.createdAt.toTimeString().slice(0, 5),
        childId: r.childId,
        childName: r.child.name,
        specialistName: r.author.name || "الأخصائي المتابع",
        specialistRole: r.author.speciality || "أخصائي المتابعة",
        type: typeLabel,
        rawType: r.type,
        mood: r.mood || 4,
        sleep: r.sleepHours || 8,
        tantrums: r.tantrums || 0,
        newWords: r.newWords ? JSON.parse(r.newWords) : [],
        exercises: r.exercises ? JSON.parse(r.exercises) : [],
        notes: r.notes || "",
        summary: summaryText,
        recommendations: recs,
        fileName: `تقرير_${r.child.name}_${r.createdAt.toISOString().split("T")[0]}.pdf`,
      };
    });

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/parent/reports]", e);
    return apiErrors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const body = await req.json();
    const { childId, mood, sleepHours, tantrums, newWords, exercises, notes } = body;

    if (!childId) return apiErrors.badRequest("معرّف الطفل مطلوب");

    const child = await db.child.findUnique({ where: { id: childId } });
    if (!child || child.parentId !== session.userId) return apiErrors.forbidden();

    const report = await db.report.create({
      data: {
        childId,
        authorId: session.userId,
        type: "DAILY",
        mood: mood ? Number(mood) : 4,
        sleepHours: sleepHours ? Number(sleepHours) : 8,
        tantrums: tantrums ? Number(tantrums) : 0,
        newWords: Array.isArray(newWords) ? JSON.stringify(newWords) : JSON.stringify([]),
        exercises: Array.isArray(exercises) ? JSON.stringify(exercises) : JSON.stringify([]),
        notes: notes?.trim() || null,
      },
    });

    return ok(report, 201);
  } catch (e) {
    console.error("[POST /api/parent/reports]", e);
    return apiErrors.internal();
  }
}
