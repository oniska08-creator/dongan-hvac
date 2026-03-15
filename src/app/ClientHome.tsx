"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu, ImageOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ClientHeader from "@/components/ClientHeader";

export default function ClientHome({ products, portfolios }: { products: any[], portfolios: any[] }) {
  const router = useRouter();

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

  return (
    <>
      <main className="relative bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30">
        <section className="min-h-[70vh] flex items-center justify-center pt-24 md:pt-32 pb-6 md:pb-10">

          <div className="max-w-7xl w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Text & CTA */}
            <div className="flex flex-col text-left z-30 pt-4 md:pt-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 md:mb-6 tracking-tight drop-shadow-2xl leading-tight">
                보이지 않는 쾌적함, <br className="hidden sm:block" />
                <span className="text-cyan-400 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                  공간의 품격을 완성하다
                </span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl mt-4 md:mt-6 max-w-xl font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] break-keep leading-relaxed">
                LG 4WAY 시스템 에어컨의 압도적인 공조 설계.<br className="hidden lg:block" />
                바람이 닿지 않는 사각지대까지 완벽한 온도를 유지합니다.
              </p>

              <div className="flex flex-col sm:flex-row justify-start gap-4 mt-8 md:mt-10 pointer-events-auto w-full sm:w-auto">
                <Link href="/products" className="w-full sm:w-auto text-center px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-base font-bold rounded-2xl md:rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(8,145,178,0.6)] hover:scale-[1.02] md:hover:scale-105 cursor-pointer">
                  솔루션 자세히 보기
                </Link>
                <Link href="/contact" className="w-full sm:w-auto text-center px-6 py-4 bg-transparent hover:bg-white/10 backdrop-blur-md border border-white/50 text-white text-base font-bold rounded-2xl md:rounded-full transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                  도입 문의
                </Link>
              </div>
            </div>

            {/* Right Column: Aspect-Square/Video Container */}
            <div className="relative w-full aspect-[4/3] md:aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(8,145,178,0.2)]">
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
        <section className="py-6 md:py-12 px-6 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-bold text-center mb-10 md:mb-16 text-white break-keep">
            우리의 <span className="text-cyan-400">대표 제품</span>
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 h-[350px] md:h-[450px]">
            {products.map((product, idx) => {
              const roundedClasses = [
                "rounded-tl-3xl", "rounded-tr-3xl", "rounded-bl-3xl", "rounded-br-3xl"
              ];
              const roundedClass = roundedClasses[idx % 4];
              
              return (
                <Link 
                  key={product.id} 
                  href={`/product/${product.id}`} 
                  className={`group relative overflow-hidden ${roundedClass} bg-slate-800 border border-slate-700/50 shadow-xl cursor-pointer h-full w-full`}
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <ImageOff className="text-gray-600 w-10 h-10" />
                    </div>
                  )}
                  
                  {/* Overlay for Product Name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 z-10 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white font-bold text-sm md:text-base lg:text-lg leading-tight drop-shadow-md">
                      {product.name}
                    </p>
                  </div>
                </Link>
              );
            })}
            
            {products.length === 0 && (
              <div className="col-span-2 lg:col-span-4 text-center text-slate-500 py-12 flex items-center justify-center bg-slate-800/50 rounded-2xl border border-slate-700">
                등록된 제품이 없습니다.
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/products" className="text-cyan-400 font-bold flex items-center gap-2 hover:text-cyan-300 transition-colors inline-flex cursor-pointer text-base md:text-lg">
              전체 제품 라인업 보기 <ArrowRight size={20} className="cursor-pointer" />
            </Link>
          </div>
        </section>
        {/* 3. PORTFOLIO & INFO */}
        <section className="py-6 md:py-12 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 break-keep text-white leading-tight">
                20년의 노하우가<br />만드는 확실한 차이
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed break-keep text-lg md:text-xl">
                수많은 시공 실적이 증명하는 완벽한 디테일. DongAn HVAC은 현장의 특성을 정확히 파악하여 가장 효율적이고 안정적인 공조 시스템을 설계부터 유지보수까지 원스톱으로 제공합니다.
              </p>
              <Link href="/portfolio" className="text-cyan-400 font-bold flex items-center justify-center lg:justify-start gap-2 hover:text-cyan-300 transition-colors inline-flex cursor-pointer text-base md:text-lg">
                시공사례 전체 보기 <ArrowRight size={20} className="cursor-pointer" />
              </Link>
            </div>
            {/* 갤러리 그리드 간격 축소 (gap-2) */}
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[350px] md:h-[400px]">
              {portfolios.map((item, idx) => {
                const roundedClasses = [
                  "rounded-tl-3xl", "rounded-tr-3xl", "rounded-bl-3xl", "rounded-br-3xl"
                ];
                const roundedClass = roundedClasses[idx % 4];
                return (
                  <Link key={item.id} href={`/portfolio/${item.id}`} className={`block ${roundedClass} overflow-hidden h-full w-full cursor-pointer group relative shadow-lg`}>
                    {item.imageUrl || (item.images && item.images.length > 0) ? (
                      <Image
                        src={item.imageUrl || item.images[0]}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
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

    </>
  );
}
