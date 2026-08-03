import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Shield,
  FileText,
  ArrowUpLeft,
} from "lucide-react";

/* ─── Social Brand Icons ─────────────────────────────────── */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111827] text-gray-300 pt-16 pb-8 relative overflow-hidden">
      {/* Top Gradient Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1D5B79] via-[#2E8B7E] to-[#E97F6B]" />

      <div className="container-rtl relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          
          {/* Column 1: Brand Info (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center group -mt-2 mb-2">
                <Image
                  src="/logo-autholink.png"
                  alt="AutiLink DZ"
                  width={220}
                  height={72}
                  className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 brightness-0 invert drop-shadow-md"
                />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6 font-400">
                منصة رقمية جزائرية متخصصة تربط الأسر بالأخصائيين ومراكز رعاية أطفال طيف التوحد لمتابعة يومية منظمة، آمنة وشاملة.
              </p>
            </div>

            {/* Social Media Links */}
            <div>
              <span className="block text-xs font-700 text-gray-500 uppercase tracking-wider mb-3">
                تابعنا عبر المنصات
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-gray-800 text-gray-400 hover:bg-[#1D5B79] hover:text-white flex items-center justify-center transition-all duration-200 border border-gray-700/60 shadow-sm"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-gray-800 text-gray-400 hover:bg-[#E97F6B] hover:text-white flex items-center justify-center transition-all duration-200 border border-gray-700/60 shadow-sm"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-gray-800 text-gray-400 hover:bg-[#2E8B7E] hover:text-white flex items-center justify-center transition-all duration-200 border border-gray-700/60 shadow-sm"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 Cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-800 text-white mb-5 relative inline-block">
              روابط السريعة
              <span className="absolute -bottom-1.5 right-0 w-8 h-1 bg-[#1D5B79] rounded-full" />
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "من نحن" },
                { href: "/features", label: "المميزات والخدمات" },
                { href: "/pricing", label: "خطط الأسعار" },
                { href: "/testimonials", label: "آراء وأصداء الأسر" },
                { href: "/contact", label: "مركز المساعدة والتواصل" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-500 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <ArrowUpLeft className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#2E8B7E] group-hover:-translate-x-0.5 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Contact (3 Cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-800 text-white mb-5 relative inline-block">
              معلومات الاتصال
              <span className="absolute -bottom-1.5 right-0 w-8 h-1 bg-[#2E8B7E] rounded-full" />
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@autilinkdz.com"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-gray-600 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1D5B79]/20 text-[#2478a0] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1D5B79] group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[0.65rem] text-gray-400 font-600">البريد الإلكتروني</span>
                    <span className="text-xs font-600 text-gray-200 truncate block" dir="ltr">contact@autilinkdz.com</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="tel:+213555000000"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-gray-600 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2E8B7E]/20 text-[#2E8B7E] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2E8B7E] group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[0.65rem] text-gray-400 font-600">هاتف الدعم</span>
                    <span className="text-xs font-600 text-gray-200 truncate block" dir="ltr">+213 555 000 000</span>
                  </div>
                </a>
              </li>
              <li className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/50">
                <div className="w-8 h-8 rounded-lg bg-[#E97F6B]/20 text-[#E97F6B] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[0.65rem] text-gray-400 font-600">المقر الرئيسي</span>
                  <span className="text-xs font-600 text-gray-200 truncate block">الجزائر العاصمة، الجزائر</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Quick Action (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-800 text-white mb-5 relative inline-block">
                الأمان والخصوصية
                <span className="absolute -bottom-1.5 right-0 w-8 h-1 bg-[#E97F6B] rounded-full" />
              </h3>
              <ul className="space-y-2.5 mb-6">
                <li>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white font-500 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-[#2E8B7E]" />
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white font-500 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#1D5B79]" />
                    شروط الاستخدام
                  </Link>
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-800/60 border border-gray-700 text-center">
              <span className="block text-xs font-700 text-gray-300 mb-2">
                الانضمام للمنصة
              </span>
              <Link
                href="/register"
                className="inline-block w-full py-2 px-3 rounded-xl bg-[#1D5B79] text-white text-xs font-700 hover:bg-[#2478a0] transition-colors shadow-sm"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            &copy; {year} <span className="font-700 text-white">أوتيلينك دي زي</span>. جميع الحقوق محفوظة.
          </p>

          <div className="flex items-center gap-1 font-500">
            <span>صُمم بكل</span>
            <Heart className="w-3.5 h-3.5 text-[#E97F6B] fill-[#E97F6B] mx-0.5" />
            <span>لأطفال طيف التوحد وأسرهم في الجزائر</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
