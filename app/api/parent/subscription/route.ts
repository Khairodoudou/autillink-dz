// app/api/parent/subscription/route.ts
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    let sub = await db.individualSubscription.findUnique({
      where: { parentId: session.userId },
    });

    if (!sub) {
      // Création automatique si non existant
      sub = await db.individualSubscription.create({
        data: {
          parentId: session.userId,
          price: 800,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: "ACTIVE",
        },
      });
    }

    const formatted = {
      plan: "اشتراك فردي",
      price: sub.price,
      currency: "DA",
      status: sub.status === "ACTIVE" ? "نشط" : "منتهي",
      startDate: sub.startDate.toISOString().split("T")[0],
      endDate: sub.endDate.toISOString().split("T")[0],
      autoRenew: true,
    };

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/parent/subscription]", e);
    return apiErrors.internal();
  }
}
