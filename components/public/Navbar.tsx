"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Heart,
  Home,
  Info,
  Star,
  HelpCircle,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/about", label: "من نحن", icon: Info },
  { href: "/features", label: "المميزات", icon: Star },
  { href: "/pricing", label: "الأسئلة الشائعة", icon: HelpCircle },
  { href: "/testimonials", label: "آراء الأسر", icon: Heart },
  { href: "/contact", label: "اتصل بنا", icon: Phone },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-[#1D5B79]/8 border-b border-[#E8D8C4]"
          : "bg-transparent"
      }`}
    >
      <div className="container-rtl">
        <div className="flex items-center justify-between py-2 md:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo-autholink.png"
              alt="AutiLink DZ"
              width={320}
              height={104}
              className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[0.9rem] transition-all duration-200 ${
                    isActive
                      ? "bg-[#1D5B79]/10 text-[#1D5B79] border-2 border-[#1D5B79] font-700 shadow-sm"
                      : "text-[#374151] hover:text-[#1D5B79] hover:bg-[#1D5B79]/8 border-2 border-transparent font-500"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-600 text-[#1D5B79] border-2 border-[#1D5B79] hover:bg-[#1D5B79] hover:text-white transition-all duration-200"
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-600 text-white bg-gradient-to-r from-[#1D5B79] to-[#2478a0] hover:from-[#163f56] hover:to-[#1D5B79] transition-all duration-200 shadow-md shadow-[#1D5B79]/25"
            >
              <UserPlus className="w-4 h-4" />
              إنشاء حساب
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#1D5B79] hover:bg-[#1D5B79]/10 transition-colors"
            aria-label="القائمة"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-[#E8D8C4] shadow-xl">
          <div className="container-rtl py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#1D5B79] text-white font-700 shadow-md"
                      : "text-[#374151] hover:text-[#1D5B79] hover:bg-[#1D5B79]/8 font-500"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#1D5B79]"}`} />
                  {link.label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#E8D8C4]">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-600 text-[#1D5B79] border-2 border-[#1D5B79] hover:bg-[#1D5B79]/8 transition-all"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-600 text-white bg-gradient-to-r from-[#1D5B79] to-[#2478a0] transition-all shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
