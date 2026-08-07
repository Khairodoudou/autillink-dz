// app/api/admin/billing/route.ts
import { NextRequest } from "next/server";
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
        select: { id: true, name: true, email: true, phone: true, wilaya: true, createdAt: true },
      }),
      db.user.findMany({
        where: { role: "SPECIALIST" },
        select: { id: true, name: true, email: true, phone: true, speciality: true, wilaya: true, experience: true, createdAt: true },
      }),
    ]);

    const planLabel = (plan: string) => {
      if (plan === "PREMIUM") return "البريميوم";
      if (plan === "STANDARD") return "المتوسط";
      if (plan === "PRO") return "المتميز";
      return "الأساسي";
    };

    const statusLabel = (status: string, endDate?: Date) => {
      if (status === "ACTIVE") return "مدفوع";
      if (endDate && endDate < new Date()) return "متأخر";
      return "معلق";
    };

    const formattedCenterSubs = centerSubs.map((s) => ({
      id: s.id,
      userId: null,
      name: s.center.name,
      director: "مركز متخصص",
      type: "مركز",
      plan: planLabel(s.plan),
      price: s.status === "ACTIVE" ? s.price : 0,
      startDate: s.startDate.toISOString().split("T")[0],
      endDate: s.endDate.toISOString().split("T")[0],
      status: statusLabel(s.status, s.endDate),
      wilaya: s.center.wilaya || "الجزائر",
    }));

    const parentSubMap = new Map(parentSubs.map((s) => [s.parentId, s]));

    const formattedParentSubs = allParents.map((p) => {
      const sub = parentSubMap.get(p.id);
      if (sub) {
        return {
          id: sub.id,
          userId: p.id,
          name: p.name || "ولي أمر",
          director: p.email || p.phone || "ولي أمر",
          type: "ولي أمر",
          plan: "المتميز",
          price: sub.status === "ACTIVE" ? sub.price : 0,
          startDate: sub.startDate.toISOString().split("T")[0],
          endDate: sub.endDate.toISOString().split("T")[0],
          status: statusLabel(sub.status, sub.endDate),
          wilaya: p.wilaya || "الجزائر",
        };
      }
      return {
        id: `parent-${p.id}`,
        userId: p.id,
        name: p.name || "ولي أمر",
        director: p.email || p.phone || "ولي أمر",
        type: "ولي أمر",
        plan: "المتميز",
        price: 0,
        startDate: p.createdAt.toISOString().split("T")[0],
        endDate: new Date(p.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "معلق",
        wilaya: p.wilaya || "الجزائر",
      };
    });

    const formattedSpecialists = specialists.map((sp) => {
      const sub = parentSubMap.get(sp.id);
      if (sub) {
        return {
          id: sub.id,
          userId: sp.id,
          name: sp.name,
          director: sp.speciality || sp.email || "أخصائي أرطوفوني",
          type: "أخصائي",
          plan: "المتميز",
          price: sub.status === "ACTIVE" ? sub.price : 0,
          startDate: sub.startDate.toISOString().split("T")[0],
          endDate: sub.endDate.toISOString().split("T")[0],
          status: statusLabel(sub.status, sub.endDate),
          wilaya: sp.wilaya || "الجزائر",
        };
      }
      return {
        id: `spec-${sp.id}`,
        userId: sp.id,
        name: sp.name,
        director: sp.speciality || sp.email || "أخصائي أرطوفوني",
        type: "أخصائي",
        plan: "المتميز",
        price: 0,
        startDate: sp.createdAt.toISOString().split("T")[0],
        endDate: new Date(sp.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "معلق",
        wilaya: sp.wilaya || "الجزائر",
      };
    });

    return ok([...formattedCenterSubs, ...formattedParentSubs, ...formattedSpecialists]);
  } catch (e) {
    console.error("[GET /api/admin/billing]", e);
    return apiErrors.internal();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return apiErrors.unauthorized();

    const body = await req.json();
    const { userId, price = 2800 } = body;

    if (!userId) return apiErrors.badRequest("المستخدم مطلوب");

    const now = new Date();
    const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const sub = await db.individualSubscription.upsert({
      where: { parentId: userId },
      update: {
        price: Number(price),
        status: "ACTIVE",
        startDate: now,
        endDate: oneMonthLater,
      },
      create: {
        parentId: userId,
        price: Number(price),
        status: "ACTIVE",
        startDate: now,
        endDate: oneMonthLater,
      },
    });

    return ok({ message: "تم تأكيد السداد وتفعيل الاشتراك بنجاح", sub });
  } catch (e) {
    console.error("[PATCH /api/admin/billing]", e);
    return apiErrors.internal();
  }
}
