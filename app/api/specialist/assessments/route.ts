// app/api/specialist/assessments/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const assessments = await db.assessment.findMany({
      where: { authorId: session.userId },
      include: {
        child: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const toolMap: Record<string, { tool: "mchat" | "ados2" | "cars2" | "vbmapp"; name: string }> = {
      MCHAT_R: { tool: "mchat", name: "M-CHAT-R" },
      ADOS2: { tool: "ados2", name: "ADOS-2" },
      CARS2: { tool: "cars2", name: "CARS-2" },
      VB_MAPP: { tool: "vbmapp", name: "VB-MAPP" },
    };

    const formatted = assessments.map((a) => {
      const toolInfo = toolMap[a.type] || { tool: "mchat", name: a.type };
      return {
        id: a.id,
        tool: toolInfo.tool,
        toolName: toolInfo.name,
        patientId: a.childId,
        patientName: a.child.name,
        date: a.createdAt.toISOString().split("T")[0],
        score: a.score,
        maxScore: a.maxScore,
        result: a.result,
        recommendation: a.recommendation || "",
      };
    });

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/specialist/assessments]", e);
    return apiErrors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const body = await req.json();
    const { childId, type, answers, score, maxScore, result, recommendation } = body;

    if (!childId || !type) return apiErrors.badRequest("الطفل ونوع التقييم مطلوبان");

    const assessment = await db.assessment.create({
      data: {
        childId,
        authorId: session.userId,
        type: type.toUpperCase(),
        answers: typeof answers === "string" ? answers : JSON.stringify(answers || {}),
        score: Number(score || 0),
        maxScore: Number(maxScore || 20),
        result: result?.trim() || "نتيجة التقييم",
        recommendation: recommendation?.trim() || null,
      },
    });

    return ok(assessment, 201);
  } catch (e) {
    console.error("[POST /api/specialist/assessments]", e);
    return apiErrors.internal();
  }
}
