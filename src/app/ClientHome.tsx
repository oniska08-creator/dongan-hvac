"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu, ImageOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function ClientHome({ products, portfolios }: { products: any[], portfolios: any[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    // Visitor Tracking
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      fetch('/api/visits', { method: 'POST' })
        .then(res => {
          if (res.ok) {
            sessionStorage.setItem("hasVisited", "true");
          }
        })
        .catch(err => console.error("Failed to record visit:", err));
    }
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <>
      {/* 1. Header (GNB) */}
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 transition-colors duration-300 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-extrabold text-white tracking-tight cursor-pointer">
            DongAn <span className="text-cyan-400 font-light">HVAC</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide cursor-pointer">회사소개</Link>
            <Link href="/products" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide cursor-pointer">제품안내</Link>
            <Link href="/portfolio" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide cursor-pointer">시공사례</Link>
            <Link href="/contact" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide cursor-pointer">고객지원</Link>

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
          <button className="md:hidden text-white hover:text-cyan-400 transition-colors cursor-pointer" aria-label="Toggle Menu">
            <Menu size={28} className="cursor-pointer" />
          </button>
        </div>
      </header>

      <main className="relative bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500/30">
        <section className="min-h-screen bg-slate-950 flex items-center justify-center pt-24 pb-12">

          <div className="max-w-7xl w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Text & CTA */}
            <div className="flex flex-col text-left z-30">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
                보이지 않는 쾌적함, <br className="hidden sm:block" />
                <span className="text-cyan-400 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                  공간의 품격을 완성하다
                </span>
              </h1>

              <p className="text-gray-300 text-lg mt-6 max-w-xl font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] break-keep">
                LG 4WAY 시스템 에어컨의 압도적인 공조 설계.<br className="hidden lg:block" />
                바람이 닿지 않는 사각지대까지 완벽한 온도를 유지합니다.
              </p>

              <div className="flex justify-start gap-4 mt-10 pointer-events-auto">
                <Link href="/products" className="px-6 py-3 sm:px-8 sm:py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-sm sm:text-base font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(8,145,178,0.6)] hover:scale-105 cursor-pointer">
                  솔루션 자세히 보기
                </Link>
                <Link href="/contact" className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent hover:bg-white/10 backdrop-blur-md border border-white/50 text-white text-sm sm:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                  도입 문의
                </Link>
              </div>
            </div>

            {/* Right Column: Aspect-Square Video Container */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(8,145,178,0.2)]">
              <video
                className="absolute inset-0 w-full h-full object-cover z-0"
                src="/DongAn_Main.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Optional: Overlay mesh for the video itself if desired */}
              <div className="absolute inset-0 w-full h-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zzBjxgwGkGFkZASRY3d3d4BpAA1SCi3X2D2gAAAAAElFTkSuQmCC')] bg-repeat opacity-30 mix-blend-overlay z-10 pointer-events-none" />
            </div>

          </div>
        </section>
        {/* 2. PRODUCT LINEUP (이미지 꽉 차게 비율 고정) */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white break-keep">
            가장 직관적인 <span className="text-cyan-400">제품 라인업</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link key={product.id} href="/products" className="group rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700 backdrop-blur-sm block">
                <div className="h-64 w-full overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
                      <ImageOff className="text-gray-500" size={48} />
                    </div>
                  )}</div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                  <p className="text-slate-400 text-sm break-keep">{product.features}</p>
                </div>
              </Link>
            ))}
            {products.length === 0 && (
              <div className="col-span-3 text-center text-slate-500 py-12">등록된 제품이 없습니다. 어드민 페이지에서 제품을 추가해주세요.</div>
            )}
          </div>
        </section>
        {/* 3. PORTFOLIO & INFO (그리드 간격 대폭 축소) */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 break-keep text-white leading-tight">
                20년의 노하우가<br />만드는 확실한 차이
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed break-keep">
                수많은 시공 실적이 증명하는 완벽한 디테일. DongAn HVAC은 현장의 특성을 정확히 파악하여 가장 효율적이고 안정적인 공조 시스템을 설계부터 유지보수까지 원스톱으로 제공합니다.
              </p>
              <Link href="/portfolio" className="text-cyan-400 font-bold flex items-center gap-2 hover:text-cyan-300 transition-colors inline-flex cursor-pointer">
                시공사례 전체 보기 <ArrowRight size={18} className="cursor-pointer" />
              </Link>
            </div>
            {/* 갤러리 그리드 간격 축소 (gap-2) */}
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[400px]">
              {portfolios.map((item, idx) => {
                const roundedClasses = [
                  "rounded-tl-2xl", "rounded-tr-2xl", "rounded-bl-2xl", "rounded-br-2xl"
                ];
                const roundedClass = roundedClasses[idx % 4];
                return (
                  <Link key={item.id} href="/portfolio" className={`block ${roundedClass} overflow-hidden h-full w-full cursor-pointer group`}>
                    {item.imageUrl || (item.images && item.images.length > 0) ? (
                      <img src={item.imageUrl || item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <ImageOff className="text-slate-600 w-12 h-12" />
                      </div>
                    )}
                  </Link>
                );
              })}
              {portfolios.length === 0 && (
                <div className="col-span-2 flex items-center justify-center bg-slate-800/50 rounded-2xl border border-slate-700 text-slate-500">
                  등록된 시공사례가 없습니다.
                </div>
              )}
            </div>
          </div>
        </section>
      </main >

      {/* Footer */}
      < footer className="bg-slate-950 py-12 px-6 border-t border-slate-900" >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight">DongAn <span className="text-cyan-400 font-light">HVAC</span></h2>
            <p className="text-slate-400 leading-relaxed font-light break-keep">
              공간의 쾌적함을 넘어, 비즈니스의 성공을 돕는 최적의 공조 파트너입니다.
            </p>
          </div>
          <div className="text-center md:text-right text-slate-400 font-light space-y-2 text-[15px]">
            <p>Email: contact@dongan-hvac.com &nbsp;|&nbsp; Tel: 02-123-4567 &nbsp;|&nbsp; Fax: 02-123-4568</p>
            <p className="pt-2">Copyright &copy; 2026 DongAn HVAC. All rights reserved.</p>
          </div>
        </div>
      </footer >
    </>
  );
}
