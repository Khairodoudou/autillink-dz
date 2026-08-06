"use client";
// app/parent/layout.tsx
import { useState } from "react";
import ParentSidebar from "@/components/parent/Sidebar";
import SpaceSwitcher from "@/components/ui/SpaceSwitcher";
import { Bell, Menu } from "lucide-react";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FDF6EC] overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full flex-shrink-0">
        <ParentSidebar
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
            <ParentSidebar onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#E8D8C4] px-4 md:px-6 h-[60px] flex items-center justify-between flex-shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <SpaceSwitcher />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E97F6B] rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-[#2E8B7E] flex items-center justify-center text-white text-sm font-800">
              م
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
