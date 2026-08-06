"use client";
// app/specialist/layout.tsx
import { useState } from "react";
import SpecialistSidebar from "@/components/specialist/Sidebar";
import SpaceSwitcher from "@/components/ui/SpaceSwitcher";
import { Bell, Menu } from "lucide-react";
import { mockSpecialistProfile } from "@/lib/mock-data";

export default function SpecialistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profile = mockSpecialistProfile;

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
            <SpaceSwitcher />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-[#EAF3F7] flex items-center justify-center text-[#6B7280] hover:bg-[#D6E8F0] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E97F6B] rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1D5B79] flex items-center justify-center text-white text-sm font-800">
                س
              </div>
              <div className="hidden md:block text-right">
                <p className="text-xs font-700 text-[#1F2937] leading-none">{profile.name}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{profile.speciality}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
