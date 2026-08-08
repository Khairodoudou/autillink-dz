import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PublicChatbot from "@/components/public/PublicChatbot";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF6EC]">
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24">{children}</main>
      <Footer />
      <PublicChatbot />
    </div>
  );
}
