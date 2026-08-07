// app/api/admin/centers/[id]/route.ts
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
    const { status, name, director, phone, email, wilaya, address } = body;

    const center = await db.center.findUnique({ where: { id } });
    if (!center) return apiErrors.notFound("المركز");

    const statusMapReverse: Record<string, string> = {
      "معتمد": "ACTIVE",
      "في انتظار الاعتماد": "PENDING",
      "موقوف": "SUSPENDED",
    };

    const updated = await db.center.update({
      where: { id },
      data: {
        ...(status ? { status: statusMapReverse[status] || status } : {}),
        ...(name ? { name: name.trim() } : {}),
        ...(director ? { director: director.trim() } : {}),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(email ? { email: email.trim() } : {}),
        ...(wilaya ? { wilaya: wilaya.trim() } : {}),
        ...(address ? { address: address.trim() } : {}),
      },
    });

    return ok(updated);
  } catch (e) {
    console.error("[PATCH /api/admin/centers/[id]]", e);
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
    const center = await db.center.findUnique({ where: { id } });
    if (!center) return apiErrors.notFound("المركز");

    await db.$transaction([
      db.user.updateMany({ where: { centerId: id }, data: { centerId: null } }),
      db.subscription.deleteMany({ where: { centerId: id } }),
      db.center.delete({ where: { id } }),
    ]);

    return ok({ message: "تم حذف المركز بنجاح" });
  } catch (e) {
    console.error("[DELETE /api/admin/centers/[id]]", e);
    return apiErrors.internal();
  }
}
