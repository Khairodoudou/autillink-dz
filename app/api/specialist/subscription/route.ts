// app/api/specialist/subscription/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    let sub = await db.individualSubscription.findUnique({
      where: { parentId: session.userId },
    });

    const now = new Date();

    if (!sub) {
      // Create default 3-day grace period pending subscription if missing
      const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      sub = await db.individualSubscription.create({
        data: {
          parentId: session.userId,
          price: 0,
          startDate: now,
          endDate: threeDays,
          status: "PENDING",
        },
      });
    }

    const diffMs = sub.endDate.getTime() - now.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const isSuspended = sub.status !== "ACTIVE" && diffMs <= 0;

    const formatted = {
      id: sub.id,
      plan: sub.status === "ACTIVE" ? "المتميز" : "الخطة التجريبية (3 أيام)",
      price: sub.price,
      currency: "DA",
      status: sub.status, // ACTIVE | PENDING | EXPIRED
      statusLabel: sub.status === "ACTIVE" ? "نشط" : isSuspended ? "معطّل" : "معلق",
      startDate: sub.startDate.toISOString().split("T")[0],
      endDate: sub.endDate.toISOString().split("T")[0],
      daysLeft,
      isSuspended,
      autoRenew: sub.status === "ACTIVE",
    };

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/specialist/subscription]", e);
    return apiErrors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SPECIALIST") return apiErrors.unauthorized();

    const body = await req.json().catch(() => ({}));
    const price = Number(body.price) || 3200;
    const isYearly = body.billingCycle === "yearly";

    const now = new Date();
    const endDate = new Date(
      now.getTime() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000
    );

    const sub = await db.individualSubscription.upsert({
      where: { parentId: session.userId },
      update: {
        price,
        startDate: now,
        endDate: endDate,
        status: "ACTIVE",
      },
      create: {
        parentId: session.userId,
        price,
        startDate: now,
        endDate: endDate,
        status: "ACTIVE",
      },
    });

    return ok({
      message: "تم تفعيل اشتراك الأخصائي بنجاح",
      subscription: {
        id: sub.id,
        price: sub.price,
        status: sub.status,
        endDate: sub.endDate.toISOString().split("T")[0],
      },
    });
  } catch (e) {
    console.error("[POST /api/specialist/subscription]", e);
    return apiErrors.internal();
  }
}
