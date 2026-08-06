"use client";
// components/admin/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  AlertCircle,
  Settings,
  ChevronLeft,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard",   label: "لوحة التحكم",    icon: LayoutDashboard },
  { href: "/admin/users",       label: "المستخدمون",     icon: Users },
  { href: "/admin/centers",     label: "المراكز",         icon: Building2 },
  { href: "/admin/billing",     label: "الفواتير",        icon: CreditCard },
  { href: "/admin/complaints",  label: "الشكاوى",         icon: AlertCircle },
  { href: "/admin/settings",    label: "الإعدادات",       icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const accent = "#6B4C93";

export default function AdminSidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-white border-l border-[#E5D9F2] flex flex-col h-full transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Brand */}
      <div
        className="p-4 flex flex-col items-center justify-center border-b border-[#E5D9F2]"
        style={{ minHeight: "85px" }}
      >
        {!collapsed ? (
          <div className="flex flex-col items-center gap-1.5 w-full">
            <img
              src="/logo-autholink.png"
              alt="AutiLink DZ"
              className="h-14 w-auto max-w-[170px] object-contain"
            />
            <p className="text-xs font-700 text-[#6B4C93]">لوحة الإدارة</p>
          </div>
        ) : (
          <img
            src="/logo-autholink.png"
            alt="AutiLink DZ"
            className="w-10 h-10 object-contain mx-auto"
          />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                active
                  ? "text-white shadow-sm"
                  : "text-[#6B7280] hover:bg-[#F0EBF8] hover:text-[#1F2937]"
              }`}
              style={active ? { backgroundColor: accent } : {}}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-600">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse + Logout */}
      <div className="p-3 border-t border-[#E5D9F2] space-y-1">
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6B7280] hover:bg-[#F0EBF8] transition-colors"
        >
          <ChevronLeft
            className={`w-5 h-5 flex-shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
          {!collapsed && <span className="text-sm font-600">طي القائمة</span>}
        </button>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-600">تسجيل الخروج</span>}
        </Link>
      </div>
    </aside>
  );
}
