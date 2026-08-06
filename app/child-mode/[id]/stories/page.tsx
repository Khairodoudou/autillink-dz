"use client";
// app/child-mode/[id]/stories/page.tsx
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, FileText, ChevronLeft } from "lucide-react";

const stories = [
  {
    id: "story-001",
    title: "يوم آدم في المدرسة",
    description: "قصة عن يوم مميز في المدرسة حيث تعلم آدم كيف يتعرف على أصدقاء جدد.",
    pages: 8,
    color: "#E97F6B",
    bg: "#E97F6B15",
    badge: "مفضلة",
  },
  {
    id: "story-002",
    title: "المشاعر الجميلة",
    description: "رحلة ممتعة مع مشاعرنا — الفرح والحزن والغضب — وكيف نعبّر عنها.",
    pages: 6,
    color: "#1D5B79",
    bg: "#1D5B7915",
    badge: "جديد",
  },
  {
    id: "story-003",
    title: "حيوانات الغابة",
    description: "قصة عن حيوانات الغابة وأصواتها الجميلة. تعلم معنا أسماء 10 حيوانات.",
    pages: 10,
    color: "#2E8B7E",
    bg: "#2E8B7E15",
    badge: null,
  },
  {
    id: "story-004",
    title: "سوبر طفل",
    description: "أنت البطل! قصة عن طفل شجاع تغلب على خوفه وساعد أصدقاءه.",
    pages: 7,
    color: "#6B4C93",
    bg: "#6B4C9315",
    badge: "رائج",
  },
  {
    id: "story-005",
    title: "يوم في المستشفى",
    description: "لا تخف من الطبيب! تعلم ماذا يحدث عند زيارة الطبيب بطريقة ممتعة.",
    pages: 9,
    color: "#F5B942",
    bg: "#F5B94215",
    badge: null,
  },
];

export default function StoriesPage() {
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
        <h1 className="text-base font-800 text-[#1F2937]">قصص حلوة</h1>
        <div className="w-9" />
      </div>

      <div className="px-4 pt-6 pb-8">
        <p className="text-sm text-[#6B7280] text-center mb-6">
          اختر قصتك واستمتع بالقراءة
        </p>
        <div className="space-y-4">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-[#E8D8C4] p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: story.bg }}
                >
                  <BookOpen className="w-7 h-7" style={{ color: story.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-800 text-[#1F2937]">
                      {story.title}
                    </h3>
                    {story.badge && (
                      <span
                        className="text-xs font-700 px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${story.color}20`,
                          color: story.color,
                        }}
                      >
                        {story.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">
                    {story.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{story.pages} صفحات</span>
                    </div>
                    <button
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-700 text-white transition-all active:scale-95 hover:opacity-90"
                      style={{ backgroundColor: story.color }}
                    >
                      اقرأ القصة
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
