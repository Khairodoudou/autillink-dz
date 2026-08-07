// app/api/admin/complaints/route.ts
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return apiErrors.unauthorized();

    const complaints = await db.complaint.findMany({
      orderBy: { createdAt: "desc" },
    });

    const statusMap: Record<string, "نشط" | "معالج" | "مغلق"> = {
      OPEN: "نشط",
      IN_PROGRESS: "نشط",
      RESOLVED: "معالج",
      CLOSED: "مغلق",
    };

    const priorityMap: Record<string, "عالية" | "متوسطة" | "منخفضة"> = {
      HIGH: "عالية",
      MEDIUM: "متوسطة",
      LOW: "منخفضة",
    };

    const formatted = complaints.map((c) => ({
      id: c.id,
      userId: c.id,
      userName: c.fromName,
      userRole: c.fromRole || "مستخدم",
      subject: c.subject,
      description: c.message,
      date: c.createdAt.toISOString().split("T")[0],
      status: statusMap[c.status] || "نشط",
      priority: priorityMap[c.priority] || "متوسطة",
      assignedTo: c.assignedTo || "فريق الدعم",
      resolution: c.resolution || undefined,
    }));

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/admin/complaints]", e);
    return apiErrors.internal();
  }
}
