// app/(child)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "وضع الطفل — AutiLink DZ",
  description: "فضاء الطفل التفاعلي — AutiLink DZ",
};

export default function ChildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFF8F6]">
      {children}
    </div>
  );
}
