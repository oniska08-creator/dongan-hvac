"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, Plus, ImageOff } from "lucide-react";

import Image from "next/image";

export default function ClientPortfolio({ portfolios: dbPortfolios }: { portfolios: any[] }) {
    const dataList = dbPortfolios || [];

    // 더보기 로직용 state
    const [visibleCount, setVisibleCount] = useState(6);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    // Card 컴포넌트 내부 렌더러
    const renderCardContent = (item: any) => (
        <div className="group flex flex-col w-full h-full cursor-pointer">
            {/* Image Container (16:9 ratio) */}
            <div className="w-full aspect-video relative overflow-hidden rounded-2xl shadow-xl border border-slate-800/60 bg-slate-900 leading-none mb-5">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out block"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500 transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out">
                        <ImageOff size={48} className="mb-3 opacity-60" />
                        <span className="text-base font-semibold tracking-widest uppercase opacity-60">DongAn HVAC</span>
                    </div>
                )}
            </div>

            {/* Title Area - Minimalist */}
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight group-hover:text-cyan-400 transition-colors duration-300 tracking-tight break-keep text-center px-4">
                {item.title}
            </h3>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* Header is handled globally in layout.tsx via ClientHeader */}

            {/* 2. Sub-Hero Section */}
            <section className="relative w-full flex flex-col items-center justify-center pt-24 md:pt-32 pb-4 md:pb-6">
                <div className="relative z-20 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl"
                    >
                        <span className="text-white">프리미엄</span> <br className="md:hidden" />
                        <span className="text-cyan-400">시공 사례</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-slate-400 font-light max-w-2xl mx-auto break-keep"
                    >
                        최고의 기술력과 타협 없는 철학이 완성한 동안공조의 하이엔드 시공 파노라마.
                    </motion.p>
                </div>
            </section>

            {dataList.length === 0 && (
                <main className="py-24 px-6 md:px-12 max-w-7xl mx-auto flex items-center justify-center min-h-[40vh]">
                    <div className="text-center text-slate-500 text-lg font-light flex flex-col items-center gap-4">
                        <ImageOff size={48} className="text-slate-700" />
                        <p>등록된 시공사례가 없습니다.</p>
                    </div>
                </main>
            )}

            {/* 3. Main Grid & Load More */}
            {dataList.length > 0 && (
                <main className="py-6 md:py-12 px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dataList.slice(0, visibleCount).map((project, index) => (
                            <Link href={`/portfolio/${project.id}`} key={project.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
                                >
                                    {renderCardContent(project)}
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < dataList.length && (
                        <div className="flex justify-center mt-16">
                            <button
                                onClick={handleLoadMore}
                                className="group flex items-center justify-center gap-2 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all duration-300 shadow-md border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:scale-105 cursor-pointer"
                            >
                                <Plus size={20} className="text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
                                <span>시공사례 더보기</span>
                            </button>
                        </div>
                    )}
                </main>
            )}

        </div>
    );
}
