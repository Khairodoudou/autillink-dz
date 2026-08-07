// app/api/auth/logout/route.ts
import { ok } from "@/lib/api/response";

export async function POST() {
  const response = ok({ message: "تم تسجيل الخروج بنجاح" });
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("child_token");
  return response;
}
