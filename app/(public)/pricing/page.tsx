import type { Metadata } from "next";
import FaqContent from "@/components/public/FaqContent";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة — أوتيلينك دي زي",
  description:
    "إجابات كاملة وشاملة على جميع الأسئلة الشائعة حول منصة أوتيلينك دي زي لأطفال طيف التوحد، طريقة الاستخدام، الحسابات، والأمان.",
};

export default function PricingPage() {
  return <FaqContent />;
}
