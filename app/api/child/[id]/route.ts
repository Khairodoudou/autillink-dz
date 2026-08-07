// app/api/child/[id]/route.ts
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

    const child = await db.child.findUnique({
      where: { id },
      include: {
        gameScores: true,
      },
    });

    if (!child) return apiErrors.notFound("الطفل");

    const totalStars = child.gameScores.reduce((acc, curr) => acc + curr.stars, 0);

    return ok({
      id: child.id,
      name: child.name,
      avatarColor: child.avatarColor,
      avatarInitial: child.avatarInitial || child.name[0],
      stars: totalStars,
      streakDays: Math.max(1, child.gameScores.length),
    });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") return apiErrors.forbidden();
    console.error("[GET /api/child/[id]]", e);
    return apiErrors.internal();
  }
}
