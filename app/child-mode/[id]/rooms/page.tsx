"use client";
// app/child-mode/[id]/rooms/page.tsx
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Stethoscope,
  Scissors,
  ShoppingCart,
  GraduationCap,
  Clock,
  ChevronLeft,
} from "lucide-react";

const rooms = [
  {
    id: "clinic",
    title: "عيادة الطبيب",
    description: "تعلم ماذا يحدث عند زيارة الطبيب — الفحص والأدوات والطمأنينة.",
    icon: Stethoscope,
    color: "#1D5B79",
    bg: "from-[#1D5B79] to-[#2478a0]",
    duration: "10 دقائق",
    badge: "الأكثر استخداماً",
  },
  {
    id: "barber",
    title: "صالون الحلاقة",
    description: "تمرّن على زيارة الحلاق — الأصوات والحركات والتعاون.",
    icon: Scissors,
    color: "#E97F6B",
    bg: "from-[#E97F6B] to-[#d4624d]",
    duration: "8 دقائق",
    badge: null,
  },
  {
    id: "shop",
    title: "المتجر الصغير",
    description: "تعلم كيف تطلب ما تريد وتتعامل مع البائع بثقة.",
    icon: ShoppingCart,
    color: "#2E8B7E",
    bg: "from-[#2E8B7E] to-[#22685e]",
    duration: "12 دقائق",
    badge: "جديد",
  },
  {
    id: "classroom",
    title: "الفصل الدراسي",
    description: "استعد للمدرسة — تعلم قواعد الفصل والتفاعل مع المعلم والزملاء.",
    icon: GraduationCap,
    color: "#6B4C93",
    bg: "from-[#6B4C93] to-[#513877]",
    duration: "15 دقائق",
    badge: null,
  },
];

export default function RoomsPage() {
  const params = useParams();
  const childId = params.id as string;

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between">
        <Link
          href={`/child-mode/${childId}`}
          className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-800 text-[#1F2937]">غرف نتمرّن</h1>
        <div className="w-9" />
      </div>

      <div className="px-4 pt-6 pb-8">
        <p className="text-sm text-[#6B7280] text-center mb-6">
          تمرّن على المواقف الحياتية في بيئة آمنة وممتعة
        </p>
        <div className="grid grid-cols-1 gap-4">
          {rooms.map((room) => {
            const Icon = room.icon;
            return (
              <div
                key={room.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8D8C4] shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Top Banner */}
                <div
                  className={`bg-gradient-to-r ${room.bg} p-5 flex items-center gap-4`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-800 text-white">{room.title}</h3>
                      {room.badge && (
                        <span className="text-xs font-700 bg-white/20 text-white px-2 py-0.5 rounded-full">
                          {room.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{room.duration}</span>
                    </div>
                  </div>
                </div>
                {/* Body */}
                <div className="p-4">
                  <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
                    {room.description}
                  </p>
                  <button
                    className="w-full py-3 rounded-xl text-sm font-700 text-white flex items-center justify-center gap-2 transition-all active:scale-95 hover:opacity-90"
                    style={{ backgroundColor: room.color }}
                  >
                    ادخل الغرفة
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
