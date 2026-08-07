// app/api/specialist/reports/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const reports = await db.report.findMany({
      where: { authorId: session.userId },
      include: {
        child: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(reports);
  } catch (e) {
    console.error("[GET /api/specialist/reports]", e);
    return apiErrors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const body = await req.json();
    const { childId, notes, type } = body;

    if (!childId || !notes) return apiErrors.badRequest("الطفل وملاحظات التقرير مطلوبة");

    const report = await db.report.create({
      data: {
        childId,
        authorId: session.userId,
        type: type || "CLINICAL",
        notes: notes.trim(),
      },
    });

    return ok(report, 201);
  } catch (e) {
    console.error("[POST /api/specialist/reports]", e);
    return apiErrors.internal();
  }
}
