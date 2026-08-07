// app/api/admin/complaints/[id]/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return apiErrors.unauthorized();

    const { id } = await params;
    const body = await req.json();
    const { status, resolution, assignedTo } = body;

    const complaint = await db.complaint.findUnique({ where: { id } });
    if (!complaint) return apiErrors.notFound("الشكوى");

    const statusMapReverse: Record<string, string> = {
      "نشط": "IN_PROGRESS",
      "معالج": "RESOLVED",
      "مغلق": "CLOSED",
    };

    const updated = await db.complaint.update({
      where: { id },
      data: {
        ...(status ? { status: statusMapReverse[status] || status } : {}),
        ...(resolution ? { resolution: resolution.trim() } : {}),
        ...(assignedTo ? { assignedTo: assignedTo.trim() } : {}),
      },
    });

    return ok(updated);
  } catch (e) {
    console.error("[PATCH /api/admin/complaints/[id]]", e);
    return apiErrors.internal();
  }
}
