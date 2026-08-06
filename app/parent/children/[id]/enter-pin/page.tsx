"use client";
// app/parent/children/[id]/enter-pin/page.tsx
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Delete, ChevronRight, Star } from "lucide-react";
import { mockChildren } from "@/lib/mock-data";
import Link from "next/link";

export default function EnterPinPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.id as string;
  const child = mockChildren.find((c) => c.id === childId);

  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const digits: (number | null | "del")[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"];

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === (child?.pin ?? "1234")) {
        router.push(`/child-mode/${childId}`);
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => {
          setPin("");
          setError(false);
          setShake(false);
        }, 700);
      }
    }
  }, [pin, child, childId, router]);

  const handleDigit = (d: number | null | "del") => {
    if (d === "del") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (d === null) return;
    if (pin.length >= 4) return;
    setPin((p) => p + String(d));
  };

  const avatarBg = child?.avatarColor ?? "#E97F6B";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8F6] via-[#FDF6EC] to-[#FFF0EB] px-4">
      {/* Back */}
      <Link
        href="/parent/children"
        className="absolute top-6 right-6 flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
        <span>العودة</span>
      </Link>

      {/* Avatar */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-4xl font-900 shadow-lg mb-4"
        style={{ backgroundColor: avatarBg }}
      >
        {child?.avatarInitial ?? "؟"}
      </div>

      <h1 className="text-2xl font-900 text-[#1F2937] mb-1">
        {child?.name ?? "طفل"}
      </h1>
      <p className="text-sm text-[#6B7280] mb-8">أدخل رمز PIN للدخول</p>

      {/* PIN Dots */}
      <div className={`flex items-center gap-4 mb-8 ${shake ? "animate-[shake_0.5s_ease]" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
              pin.length > i
                ? error
                  ? "bg-red-400 border-red-400 scale-110"
                  : "scale-110"
                : "bg-white border-[#E8D8C4]"
            }`}
            style={
              pin.length > i && !error
                ? { backgroundColor: avatarBg, borderColor: avatarBg }
                : {}
            }
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 font-600 mb-4">رمز PIN غير صحيح، حاول مجدداً</p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs" dir="ltr">
        {digits.map((d, i) => {
          if (d === null) return <div key={i} />;
          return (
            <button
              key={i}
              onClick={() => handleDigit(d)}
              className={`h-16 rounded-2xl text-2xl font-800 transition-all duration-150 active:scale-95 shadow-sm ${
                d === "del"
                  ? "bg-[#F5E8D4] text-[#6B7280] flex items-center justify-center"
                  : "bg-white border-2 border-[#E8D8C4] text-[#1F2937] hover:border-[#E97F6B] hover:shadow-md"
              }`}
            >
              {d === "del" ? (
                <Delete className="w-5 h-5 mx-auto" />
              ) : (
                d
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-8 text-xs text-[#9CA3AF]">
        <Star className="w-3.5 h-3.5 text-[#F5B942]" />
        <span>PIN التجريبي: 1234</span>
      </div>
    </div>
  );
}
