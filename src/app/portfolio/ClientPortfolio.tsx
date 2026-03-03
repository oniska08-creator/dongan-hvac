"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, Plus, ImageOff } from "lucide-react";

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
            <div className="w-full aspect-video relative overflow-hidden rounded-2xl shadow-lg border border-slate-800/60 bg-slate-900">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="object-cover w-full h-full absolute inset-0 transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500 transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out">
                        <ImageOff size={48} className="mb-3 opacity-60" />
                        <span className="text-sm font-semibold tracking-widest uppercase opacity-60">DongAn HVAC</span>
                    </div>
                )}
            </div>

            {/* Text Area */}
            <h3 className="text-xl font-bold text-white mt-4 group-hover:text-cyan-400 transition-colors duration-300">
                {item.title}
            </h3>
            <div className="text-sm text-gray-400 mt-2 flex gap-3 items-center flex-wrap">
                {item.date && <span>{item.date}</span>}
                {item.clientName && (
                    <span className="px-2 py-1 bg-cyan-900/50 text-cyan-400 rounded-md text-xs">
                        {item.clientName}
                    </span>
                )}
                {item.area && (
                    <span className="px-2 py-1 bg-slate-800/80 text-slate-300 rounded-md text-xs border border-slate-700/50">
                        {item.area}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* 1. Header (GNB) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 transition-colors duration-300 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-extrabold text-white tracking-tight">
                        DongAn <span className="text-cyan-400 font-light">HVAC</span>
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/about" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium tracking-wide">회사소개</Link>
                        <Link href="/products" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium tracking-wide">제품안내</Link>
                        <Link href="/portfolio" className="text-cyan-400 font-medium tracking-wide drop-shadow-[0_0_10px_rgba(8,145,178,0.5)]">시공사례</Link>
                        <Link href="/contact" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium tracking-wide">고객지원</Link>
                    </nav>
                    <button className="md:hidden text-white hover:text-cyan-400 transition-colors" aria-label="Toggle Menu">
                        <Menu size={28} />
                    </button>
                </div>
            </header>

            {/* 2. Sub-Hero Section */}
            <section className="relative w-full flex flex-col items-center justify-center bg-slate-950 pt-32 pb-16">
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
                        className="text-lg text-slate-400 font-light max-w-2xl mx-auto break-keep"
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
                <main className="px-6 md:px-12 max-w-[1400px] mx-auto pb-32">
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

            {/* Footer */}
            <footer className="bg-slate-950 py-12 px-6 border-t border-slate-900 mt-10">
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
            </footer>
        </div>
    );
}
