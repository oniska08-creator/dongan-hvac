"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function ClientHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
      return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[110] bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 transition-colors duration-300 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-white tracking-tight cursor-pointer">
            DongAn <span className="text-cyan-400 font-light">HVAC</span>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide">회사소개</Link>
            <Link href="/products" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide">제품안내</Link>
            <Link href="/portfolio" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide">시공사례</Link>
            <Link href="/contact" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide">고객지원</Link>
            
            <div className="border-l border-slate-700 pl-8 ml-4 flex items-center space-x-4">
              {isAdmin ? (
                <>
                  <Link href="/admin" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-full transition-colors cursor-pointer">
                    관리자 페이지
                  </Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer">
                    로그아웃
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer">
                  관리자 로그인
                </Link>
              )}
            </div>
          </nav>

          {/* 모바일 햄버거 토글 버튼 (최상단 z-index 보장) */}
          <button 
            className="md:hidden text-white hover:text-cyan-400 transition-colors cursor-pointer z-[120]" 
            aria-label="Toggle Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* 모바일 네비게이션 (Full Screen Dropdown) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[105] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 pt-20">
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-white hover:text-cyan-400 font-bold tracking-wide">회사소개</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-white hover:text-cyan-400 font-bold tracking-wide">제품안내</Link>
            <Link href="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-white hover:text-cyan-400 font-bold tracking-wide">시공사례</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-white hover:text-cyan-400 font-bold tracking-wide">고객지원</Link>
            
            {isAdmin ? (
                <div className="flex flex-col items-center space-y-4 mt-8">
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full transition-colors">
                    관리자 페이지
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-slate-400 hover:text-white font-medium transition-colors text-lg">
                    로그아웃
                  </button>
                </div>
            ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="mt-8 text-slate-400 hover:text-white font-medium transition-colors text-lg">
                  관리자 로그인
                </Link>
            )}
        </div>
      )}
    </>
  );
}
