"use client";
// components/ui/TablePagination.tsx
import { ChevronRight, ChevronLeft } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  accentColor?: string;
}

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  accentColor = "#2E8B7E",
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E8D8C4]/60 text-xs text-[#6B7280]">
      <p className="font-600">
        عرض <span className="font-800 text-[#1F2937]">{startItem}</span> إلى{" "}
        <span className="font-800 text-[#1F2937]">{endItem}</span> من إجمالي{" "}
        <span className="font-800 text-[#1F2937]">{totalItems}</span> عنصر
      </p>

      <div className="flex items-center gap-1.5" dir="rtl">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E8D8C4] bg-white font-700 hover:bg-[#F5E8D4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-xl font-800 text-xs transition-all ${
                currentPage === page
                  ? "text-white shadow-sm"
                  : "bg-white border border-[#E8D8C4] hover:bg-[#F5E8D4] text-[#6B7280]"
              }`}
              style={currentPage === page ? { backgroundColor: accentColor } : {}}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E8D8C4] bg-white font-700 hover:bg-[#F5E8D4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          التالي
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
