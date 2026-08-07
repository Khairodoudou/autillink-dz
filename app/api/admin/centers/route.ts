// app/api/admin/centers/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return apiErrors.unauthorized();

    const centers = await db.center.findMany({
      include: {
        subscription: true,
        users: { select: { id: true, role: true, children: { select: { id: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = centers.map((c) => {
      const specialistsCount = c.users.filter((u) => u.role === "SPECIALIST").length;
      let childrenCount = 0;
      c.users.forEach((u) => {
        if (u.children) childrenCount += u.children.length;
      });

      const planMap: Record<string, string> = {
        BASIC: "أساسي",
        STANDARD: "متوسط",
        PREMIUM: "مميز",
      };

      const statusMap: Record<string, string> = {
        ACTIVE: "معتمد",
        PENDING: "في انتظار الاعتماد",
        SUSPENDED: "موقوف",
      };

      return {
        id: c.id,
        name: c.name,
        director: c.director || "غير محدد",
        email: c.email || "",
        phone: c.phone || "",
        wilaya: c.wilaya,
        address: c.address || "",
        specialistsCount,
        childrenCount,
        plan: planMap[c.subscription?.plan || "BASIC"] || "أساسي",
        planPrice: c.subscription?.price || 0,
        status: statusMap[c.status] || "معتمد",
        joinDate: c.createdAt.toISOString().split("T")[0],
        paymentStatus: c.subscription?.status === "ACTIVE" ? "مدفوع" : "معلق",
        nextPaymentDate: c.subscription?.endDate ? c.subscription.endDate.toISOString().split("T")[0] : "",
      };
    });

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/admin/centers]", e);
    return apiErrors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return apiErrors.unauthorized();

    const body = await req.json();
    const { name, director, email, phone, wilaya, address, plan, price } = body;

    if (!name || !wilaya) return apiErrors.badRequest("اسم المركز والولاية مطلوبة");

    const center = await db.center.create({
      data: {
        name: name.trim(),
        director: director?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        wilaya: wilaya.trim(),
        address: address?.trim() || null,
        status: "ACTIVE",
        subscription: {
          create: {
            plan: plan || "STANDARD",
            price: price ? Number(price) : 18000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            status: "ACTIVE",
          },
        },
      },
    });

    return ok(center, 201);
  } catch (e) {
    console.error("[POST /api/admin/centers]", e);
    return apiErrors.internal();
  }
}
