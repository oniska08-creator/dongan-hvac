import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import KakaoFAB from "@/components/KakaoFAB";
import ClientHeader from "@/components/ClientHeader";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "동안공조 (DongAn HVAC)",
  description: "최적의 공조 솔루션으로 공간의 가치를 높이는 동안공조입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className="antialiased bg-slate-950 text-slate-100 flex flex-col min-h-screen"
      >
        <AuthProvider>
          <ClientHeader />
          {children}
          <Footer />
          <KakaoFAB />
        </AuthProvider>
      </body>
    </html>
  );
}
