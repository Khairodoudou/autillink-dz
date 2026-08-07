"use client";
// components/child-mode/ExitPinModal.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Delete, X, Lock, Star } from "lucide-react";

interface ExitPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  onSuccess?: () => void;
}

export default function ExitPinModal({
  isOpen,
  onClose,
  childId,
  onSuccess,
}: ExitPinModalProps) {
  const router = useRouter();
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const digits: (number | null | "del")[] = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    null, 0, "del",
  ];

  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setError(false);
      setShake(false);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (pin.length === 4) {
      setLoading(true);
      fetch(`/api/parent/children/${childId}/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.ok) {
            if (onSuccess) onSuccess();
            else router.push("/parent/children");
          } else {
            handleFailedPin();
          }
        })
        .catch(() => {
          // Fallback demo pin
          if (pin === "1234") {
            if (onSuccess) onSuccess();
            else router.push("/parent/children");
          } else {
            handleFailedPin();
          }
        });
    }
  }, [pin, childId, router, onSuccess]);

  const handleFailedPin = () => {
    setError(true);
    setShake(true);
    setTimeout(() => {
      setPin("");
      setError(false);
      setShake(false);
      setLoading(false);
    }, 700);
  };

  const handleDigit = (d: number | null | "del") => {
    if (loading) return;
    if (d === "del") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (d === null) return;
    if (pin.length >= 4) return;
    setPin((p) => p + String(d));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E8D8C4] shadow-2xl text-center relative overflow-hidden">
        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#F5E8D4]/70 text-[#6B7280] flex items-center justify-center hover:bg-[#F5E8D4] transition-colors"
          title="إلغاء والعودة للعب"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#E97F6B]/15 text-[#E97F6B] flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-900 text-[#1F2937] mb-1">الخروج من وضع الطفل</h2>
        <p className="text-xs text-[#6B7280] mb-6">
          أدخل رمز PIN الخاص بالوالدين للعودة إلى قائمة الأطفال
        </p>

        {/* PIN Indicator Dots */}
        <div
          className={`flex items-center justify-center gap-3 mb-6 ${
            shake ? "animate-bounce" : ""
          }`}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > i
                  ? error
                    ? "bg-red-500 border-red-500 scale-110"
                    : "bg-[#E97F6B] border-[#E97F6B] scale-110"
                  : "bg-white border-[#E8D8C4]"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-700 mb-4 animate-pulse">
            رمز PIN غير صحيح، حاول مجدداً
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-5" dir="ltr">
          {digits.map((d, i) => {
            if (d === null) return <div key={i} />;
            return (
              <button
                key={i}
                onClick={() => handleDigit(d)}
                disabled={loading}
                className={`h-14 rounded-2xl text-xl font-800 transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center ${
                  d === "del"
                    ? "bg-[#F5E8D4] text-[#6B7280]"
                    : "bg-white border-2 border-[#E8D8C4] text-[#1F2937] hover:border-[#E97F6B]"
                }`}
              >
                {d === "del" ? <Delete className="w-5 h-5" /> : d}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-[#9CA3AF] bg-[#FDF6EC] py-2 rounded-xl border border-[#E8D8C4]">
          <Star className="w-3.5 h-3.5 text-[#F5B942]" />
          <span>PIN التجريبي للوالدين: 1234</span>
        </div>
      </div>
    </div>
  );
}
