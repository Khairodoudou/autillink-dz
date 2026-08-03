import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import StatsSection from "@/components/public/StatsSection";
import FeaturesPreview from "@/components/public/FeaturesPreview";
import HowItWorks from "@/components/public/HowItWorks";
import CtaBanner from "@/components/public/CtaBanner";

export const metadata: Metadata = {
  title: "أوتيلينك دي زي — منصة متابعة طفل التوحد في الجزائر",
  description:
    "منصة رقمية جزائرية تربط الأسرة بالأخصائيين ومراكز رعاية أطفال التوحد لمتابعة يومية منظّمة وفعّالة.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF6EC]">
      <Navbar />
      <main className="flex-1 pt-18 md:pt-[88px] lg:pt-[120px]">
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <FeaturesPreview />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
