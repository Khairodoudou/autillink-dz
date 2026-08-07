// app/api/parent/children/[id]/verify-pin/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { comparePassword } from "@/lib/auth/password";
import { signChildToken } from "@/lib/auth/jwt";
import { getSession } from "@/lib/auth/session";
import { ok, apiErrors } from "@/lib/api/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") return apiErrors.unauthorized();

    const { id: childId } = await params;
    const { pin } = await req.json();

    if (!pin) return apiErrors.badRequest("رمز PIN مطلوب");

    // Vérifier que l'enfant appartient au parent
    const child = await db.child.findUnique({
      where: { id: childId },
      select: { id: true, name: true, pinCode: true, parentId: true, avatarColor: true, avatarInitial: true },
    });

    if (!child) return apiErrors.notFound("الطفل");
    if (child.parentId !== session.userId) return apiErrors.forbidden();

    const isValid = await comparePassword(pin, child.pinCode);
    if (!isValid) {
      return apiErrors.badRequest("رمز PIN غير صحيح");
    }

    const childToken = await signChildToken({
      childId: child.id,
      parentId: session.userId,
      scope: "child-mode",
    });

    const response = ok({
      childId: child.id,
      name: child.name,
      redirectTo: `/child-mode/${child.id}`,
    });

    response.cookies.set("child_token", childToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 heures
      path: "/",
    });

    return response;
  } catch (e) {
    console.error("[POST /api/parent/children/[id]/verify-pin]", e);
    return apiErrors.internal();
  }
}
