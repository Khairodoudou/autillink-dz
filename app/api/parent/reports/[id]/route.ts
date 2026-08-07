// app/api/parent/reports/[id]/route.ts
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    const { id } = await params;
    const report = await db.report.findUnique({
      where: { id },
      include: {
        child: { select: { name: true, parentId: true } },
      },
    });

    if (!report) return apiErrors.notFound("الملاحظة / التقرير");
    if (report.child.parentId !== parent.id && report.authorId !== parent.id) {
      return apiErrors.forbidden();
    }

    return ok(report);
  } catch (e) {
    console.error("[GET /api/parent/reports/[id]]", e);
    return apiErrors.internal();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, params);
}

async function handleUpdate(
  req: NextRequest,
  paramsPromise: Promise<{ id: string }>
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    const { id } = await paramsPromise;
    const report = await db.report.findUnique({
      where: { id },
      include: { child: { select: { parentId: true } } },
    });

    if (!report) return apiErrors.notFound("الملاحظة");
    if (report.child.parentId !== parent.id && report.authorId !== parent.id) {
      return apiErrors.forbidden();
    }

    const body = await req.json();
    const { mood, sleepHours, tantrums, newWords, notes, childId } = body;

    const data: any = {};
    if (childId) data.childId = childId;
    if (mood !== undefined) data.mood = Number(mood);
    if (sleepHours !== undefined) data.sleepHours = Number(sleepHours);
    if (tantrums !== undefined) data.tantrums = Number(tantrums);
    if (newWords !== undefined) {
      data.newWords = Array.isArray(newWords)
        ? JSON.stringify(newWords)
        : JSON.stringify([]);
    }
    if (notes !== undefined) data.notes = notes ? notes.trim() : "";

    const updated = await db.report.update({
      where: { id },
      data,
    });

    return ok(updated);
  } catch (e: any) {
    console.error("[UPDATE /api/parent/reports/[id]] Error:", e);
    return apiErrors.badRequest(e?.message || "تعذر تعديل الملاحظة");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    const { id } = await params;
    const report = await db.report.findUnique({
      where: { id },
      include: { child: { select: { parentId: true } } },
    });

    if (!report) return apiErrors.notFound("الملاحظة");
    if (report.child.parentId !== parent.id && report.authorId !== parent.id) {
      return apiErrors.forbidden();
    }

    await db.report.delete({ where: { id } });
    return ok({ message: "تم حذف الملاحظة بنجاح" });
  } catch (e) {
    console.error("[DELETE /api/parent/reports/[id]]", e);
    return apiErrors.internal();
  }
}
