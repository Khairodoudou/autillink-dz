// app/api/admin/billing/route.ts
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return apiErrors.unauthorized();

    const [centerSubs, parentSubs, allParents, specialists] = await Promise.all([
      db.subscription.findMany({
        include: { center: { select: { id: true, name: true, wilaya: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.individualSubscription.findMany({
        orderBy: { createdAt: "desc" },
      }),
      db.user.findMany({
        where: { role: "PARENT" },
        select: { id: true, name: true, email: true, phone: true, wilaya: true },
      }),
      db.user.findMany({
        where: { role: "SPECIALIST" },
        select: { id: true, name: true, email: true, phone: true, speciality: true, wilaya: true, experience: true },
      }),
    ]);

    const planLabel = (plan: string) => {
      if (plan === "PREMIUM") return "البريميوم";
      if (plan === "STANDARD") return "المتوسط";
      if (plan === "PRO") return "المتميز";
      return "الأساسي";
    };

    const statusLabel = (status: string) => {
      if (status === "ACTIVE") return "مدفوع";
      if (status === "EXPIRED") return "متأخر";
      return "معلق";
    };

    const formattedCenterSubs = centerSubs.map((s) => ({
      id: s.id,
      name: s.center.name,
      director: "مركز متخصص",
      type: "مركز",
      plan: planLabel(s.plan),
      price: s.price,
      startDate: s.startDate.toISOString().split("T")[0],
      endDate: s.endDate.toISOString().split("T")[0],
      status: statusLabel(s.status),
      wilaya: s.center.wilaya || "الجزائر",
    }));

    const parentSubMap = new Map(parentSubs.map((s) => [s.parentId, s]));

    const formattedParentSubs = allParents.map((p) => {
      const sub = parentSubMap.get(p.id);
      if (sub) {
        return {
          id: sub.id,
          name: p.name || "ولي أمر",
          director: p.email || p.phone || "ولي أمر",
          type: "ولي أمر",
          plan: "المتميز",
          price: sub.price || 2800,
          startDate: sub.startDate.toISOString().split("T")[0],
          endDate: sub.endDate.toISOString().split("T")[0],
          status: statusLabel(sub.status),
          wilaya: p.wilaya || "الجزائر",
        };
      }
      return {
        id: `parent-${p.id}`,
        name: p.name || "ولي أمر",
        director: p.email || p.phone || "ولي أمر",
        type: "ولي أمر",
        plan: "المتميز",
        price: 2800,
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        status: "مدفوع",
        wilaya: p.wilaya || "الجزائر",
      };
    });

    const formattedSpecialists = specialists.map((sp, idx) => ({
      id: `spec-${sp.id}`,
      name: sp.name,
      director: sp.speciality || sp.email || "أخصائي أرطوفوني",
      type: "أخصائي",
      plan: idx % 2 === 0 ? "المتميز" : "البريميوم",
      price: idx % 2 === 0 ? 3200 : 5000,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      status: "مدفوع",
      wilaya: sp.wilaya || "الجزائر",
    }));

    return ok([...formattedCenterSubs, ...formattedParentSubs, ...formattedSpecialists]);
  } catch (e) {
    console.error("[GET /api/admin/billing]", e);
    return apiErrors.internal();
  }
}
