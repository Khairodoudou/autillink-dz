import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "أوتيلينك دي زي — منصة متابعة طفل التوحد",
  description:
    "منصة رقمية جزائرية تربط الأخصائي والأسرة والإدارة لمتابعة الطفل المصاب بطيف التوحد بشكل يومي ومنظّم.",
  keywords: "توحد، جزائر، متابعة، أطفال، أخصائيين، مراكز توحد",
  authors: [{ name: "AutiLink DZ" }],
  metadataBase: new URL("https://autilinkdz.com"),
  openGraph: {
    title: "أوتيلينك دي زي",
    description:
      "منصة رقمية جزائرية لمتابعة الأطفال المصابين بطيف التوحد",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FDF6EC]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
