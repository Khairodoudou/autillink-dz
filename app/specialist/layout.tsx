"use client";
// app/specialist/layout.tsx
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SpecialistSidebar from "@/components/specialist/Sidebar";
import { Bell, Menu, AlertTriangle, Lock, CreditCard } from "lucide-react";

export default function SpecialistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<{ name?: string; speciality?: string }>({});
  const [subInfo, setSubInfo] = useState<{
    status?: string;
    daysLeft?: number;
    endDate?: string;
    isSuspended?: boolean;
  }>({});

  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/specialist/me")
      .then((r) => r.json())
      .then((res) => { if (res.ok) setProfile(res.data); });

    fetch("/api/specialist/subscription")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) {
          setSubInfo(res.data);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const isPending = subInfo.status === "PENDING";
  const isSuspended = subInfo.isSuspended;
  const isSubscriptionPage = pathname === "/specialist/subscription";

  return (
    <div className="flex h-screen bg-[#EFF6FA] overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full flex-shrink-0">
        <SpecialistSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full">
            <SpecialistSidebar onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#D6E8F0] px-4 md:px-6 h-[60px] flex items-center justify-between flex-shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-[#EAF3F7] flex items-center justify-center text-[#6B7280]"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button 
              type="button"
              className="relative w-9 h-9 rounded-xl bg-[#EAF3F7] flex items-center justify-center text-[#6B7280] hover:bg-[#D6E8F0] focus:outline-none transition-colors"
              aria-label="التنبيهات"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E97F6B] rounded-full ring-2 ring-white" />
            </button>

            <div className="h-5 w-px bg-[#D6E8F0]" />

            {/* User Profile */}
            <div className="flex items-center gap-2.5 select-none">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-[#1F2937] leading-none">{profile.name ?? "الأخصائي"}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{profile.speciality ?? "أخصائي"}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#1D5B79] flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                {profile.name ? profile.name[0] : "أ"}
              </div>
            </div>
          </div>
        </header>

        {/* 3-Day Grace Period Warning Banner */}
        {isPending && !isSuspended && (
          <div className="bg-amber-500 text-white px-4 py-3 border-b border-amber-600 flex items-center justify-between gap-3 shadow-sm flex-shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-100" />
              <span>
                تنبيه هام: يلزم سداد الاشتراك خلال 3 أيام (قبل {subInfo.endDate || "3 أيام"})، وإلا سيتم تعطيل الحساب.
              </span>
            </div>
            <a
              href="/specialist/subscription"
              className="px-4 py-1.5 bg-white text-amber-900 font-800 rounded-xl text-xs hover:bg-amber-100 transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <CreditCard className="w-3.5 h-3.5" />
              سداد الاشتراك الآن
            </a>
          </div>
        )}

        {/* Account Suspension Screen */}
        {isSuspended && !isSubscriptionPage ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#EFF6FA]">
            <div className="max-w-md w-full bg-white rounded-3xl border border-red-200 p-8 text-center shadow-xl space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-900 text-gray-900">تم تعطيل الحساب مؤقتاً</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                انتهت فترة المهلة (3 أيام) دون سداد قيمة الاشتراك. يرجى اختيار الباقة وإتمام السداد لإعادة تفعيل الحساب فوراً.
              </p>
              <a
                href="/specialist/subscription"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1D5B79] text-white font-800 rounded-xl text-sm hover:bg-[#17475f] transition-colors shadow"
              >
                <CreditCard className="w-4 h-4" />
                الانتقال لصفحة الدفع والاشتراك
              </a>
            </div>
          </div>
        ) : (
          /* Page Content */
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}
