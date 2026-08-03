import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF6EC]">
      <Navbar />
      <main className="flex-1 pt-18 flex flex-col justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
