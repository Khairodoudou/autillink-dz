// app/api/child/[id]/scores/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireChildSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireChildSession(id);

    const scores = await db.gameScore.findMany({
      where: { childId: id },
      orderBy: { playedAt: "desc" },
    });

    return ok(scores);
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") return apiErrors.forbidden();
    console.error("[GET /api/child/[id]/scores]", e);
    return apiErrors.internal();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireChildSession(id);

    const body = await req.json();
    const { gameType, stars } = body;

    if (!gameType || stars === undefined) return apiErrors.badRequest("نوع اللعبة والنجوم مطلوبة");

    const newScore = await db.gameScore.create({
      data: {
        childId: id,
        gameType: gameType.toUpperCase(),
        stars: Number(stars),
      },
    });

    return ok(newScore, 201);
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") return apiErrors.forbidden();
    console.error("[POST /api/child/[id]/scores]", e);
    return apiErrors.internal();
  }
}
