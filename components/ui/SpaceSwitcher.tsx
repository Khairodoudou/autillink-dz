"use client";
// components/ui/SpaceSwitcher.tsx
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Stethoscope, Shield, Baby, Home, ChevronDown, Layers } from "lucide-react";

const spaces = [
  { id: "parent", label: "فضاء الأسرة", href: "/parent/dashboard", icon: Users, color: "#2E8B7E", bg: "#2E8B7E15" },
  { id: "specialist", label: "فضاء الأخصائي", href: "/specialist/dashboard", icon: Stethoscope, color: "#1D5B79", bg: "#1D5B7915" },
  { id: "admin", label: "فضاء الإدارة", href: "/admin/dashboard", icon: Shield, color: "#6B4C93", bg: "#6B4C9315" },
  { id: "child", label: "وضع الطفل", href: "/child-mode/child-001", icon: Baby, color: "#E97F6B", bg: "#E97F6B15" },
  { id: "public", label: "الرئيسية", href: "/", icon: Home, color: "#6B7280", bg: "#6B728015" },
];

export default function SpaceSwitcher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSpace =
    spaces.find((s) => s.id !== "public" && pathname.startsWith(`/${s.id}`)) ??
    (pathname.startsWith("/child-mode") ? spaces[3] : spaces[0]);

  const CurrentIcon = currentSpace.icon;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E8D8C4] bg-white hover:bg-[#F5E8D4]/50 transition-all text-xs font-700 shadow-sm"
      >
        <div
          className="w-5 h-5 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: currentSpace.bg }}
        >
          <CurrentIcon className="w-3.5 h-3.5" style={{ color: currentSpace.color }} />
        </div>
        <span className="text-[#1F2937] font-800 hidden sm:inline">{currentSpace.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E8D8C4] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <p className="text-[10px] font-800 text-[#9CA3AF] uppercase tracking-wider px-3 py-1.5">
            التنقل السريع بين الفضاءات
          </p>
          <div className="space-y-1">
            {spaces.map((s) => {
              const Icon = s.icon;
              const isActive = currentSpace.id === s.id;
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-700 transition-all ${
                    isActive
                      ? "bg-[#F5E8D4] text-[#1F2937]"
                      : "text-[#6B7280] hover:bg-[#F5E8D4]/40 hover:text-[#1F2937]"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: s.bg }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  </div>
                  <span className="flex-1 text-right">{s.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B7E]" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
