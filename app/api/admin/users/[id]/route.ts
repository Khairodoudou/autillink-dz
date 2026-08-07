// app/api/admin/users/[id]/route.ts
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
    const { isActive, role, name, wilaya } = body;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) return apiErrors.notFound("المستخدم");

    const updated = await db.user.update({
      where: { id },
      data: {
        ...(typeof isActive === "boolean" ? { isActive } : {}),
        ...(role ? { role: role.toUpperCase() } : {}),
        ...(name ? { name: name.trim() } : {}),
        ...(wilaya ? { wilaya: wilaya.trim() } : {}),
      },
    });

    return ok(updated);
  } catch (e) {
    console.error("[PATCH /api/admin/users/[id]]", e);
    return apiErrors.internal();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return apiErrors.unauthorized();

    const { id } = await params;
    if (id === session.userId) return apiErrors.badRequest("لا يمكنك حذف حسابك الحالي");

    const user = await db.user.findUnique({ where: { id } });
    if (!user) return apiErrors.notFound("المستخدم");

    // Perform cascade cleanup before deleting user to prevent foreign key constraints
    await db.$transaction([
      db.child.updateMany({ where: { specialistId: id }, data: { specialistId: null } }),
      db.appointment.updateMany({ where: { specialistId: id }, data: { specialistId: null } }),
      db.message.deleteMany({ where: { OR: [{ senderId: id }, { receiverId: id }] } }),
      db.report.deleteMany({ where: { authorId: id } }),
      db.individualSubscription.deleteMany({ where: { parentId: id } }),
      db.child.deleteMany({ where: { parentId: id } }),
      db.user.delete({ where: { id } }),
    ]);

    return ok({ message: "تم حذف المستخدم بنجاح" });
  } catch (e) {
    console.error("[DELETE /api/admin/users/[id]]", e);
    return apiErrors.internal();
  }
}
