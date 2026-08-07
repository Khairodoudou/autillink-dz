// app/api/parent/specialists/route.ts
// Returns the list of specialists available to the parent
// (their children's specialist + all center specialists)
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

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const parent = await getAuthenticatedParent(session);
    if (!parent) return apiErrors.unauthorized();

    // Get all specialists assigned to the parent's children
    const myChildren = await db.child.findMany({
      where: { parentId: parent.id },
      select: { specialistId: true },
    });

    const assignedSpecialistIds = myChildren
      .map((c) => c.specialistId)
      .filter(Boolean) as string[];

    // Get all specialists from the same centers as assigned specialists,
    // plus any globally visible specialists
    const specialists = await db.user.findMany({
      where: {
        role: "SPECIALIST",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        speciality: true,
        phone: true,
        center: { select: { name: true, wilaya: true } },
      },
      orderBy: { name: "asc" },
    });

    const formatted = specialists.map((s) => ({
      id: s.id,
      name: s.name,
      speciality: s.speciality || "أخصائي متابعة",
      phone: s.phone || "",
      centerName: s.center?.name || "المنصة العادية",
      wilaya: s.center?.wilaya || "",
      isAssigned: assignedSpecialistIds.includes(s.id),
    }));

    // Sort: assigned specialists first
    formatted.sort((a, b) => (b.isAssigned ? 1 : 0) - (a.isAssigned ? 1 : 0));

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/parent/specialists]", e);
    return apiErrors.internal();
  }
}
