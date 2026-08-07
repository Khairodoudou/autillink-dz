// app/api/complaints/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiErrors.unauthorized();

    const complaints = await db.complaint.findMany({
      where: {
        fromEmail: session.email,
      },
      orderBy: { createdAt: "desc" },
    });

    const statusMap: Record<string, string> = {
      OPEN: "نشط",
      IN_PROGRESS: "نشط",
      RESOLVED: "معالج",
      CLOSED: "مغلق",
    };

    const priorityMap: Record<string, string> = {
      HIGH: "عالية",
      MEDIUM: "متوسطة",
      LOW: "منخفضة",
    };

    const formatted = complaints.map((c) => ({
      id: c.id,
      subject: c.subject,
      description: c.message,
      date: c.createdAt.toISOString().split("T")[0],
      status: statusMap[c.status] || "نشط",
      priority: priorityMap[c.priority] || "متوسطة",
      resolution: c.resolution || undefined,
    }));

    return ok(formatted);
  } catch (e) {
    console.error("[GET /api/complaints]", e);
    return apiErrors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { subject, message, priority, fromEmail, fromName } = body;

    if (!subject || !message) {
      return apiErrors.badRequest("موضوع الشكوى والتفاصيل مطلوبة");
    }

    const priorityMapReverse: Record<string, string> = {
      "عاجلة": "HIGH",
      "عالية": "HIGH",
      "متوسطة": "MEDIUM",
      "منخفضة": "LOW",
    };

    const complaint = await db.complaint.create({
      data: {
        fromEmail: session?.email || fromEmail || "user@autillink.dz",
        fromName: session?.name || fromName || "مستخدم المنصة",
        fromRole: session?.role === "PARENT" ? "ولي أمر" : session?.role === "SPECIALIST" ? "أخصائي" : "مستخدم",
        subject: subject.trim(),
        message: message.trim(),
        priority: priorityMapReverse[priority] || priority || "MEDIUM",
        status: "OPEN",
      },
    });

    return ok(complaint);
  } catch (e) {
    console.error("[POST /api/complaints]", e);
    return apiErrors.internal();
  }
}
