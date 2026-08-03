import { redirect } from "next/navigation";

// The landing page is served from app/page.tsx (root layout).
// This file exists only to satisfy the route group structure.
export default function PublicHomePage() {
  redirect("/");
}
