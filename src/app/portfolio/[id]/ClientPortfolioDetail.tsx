"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Menu, ArrowRight } from "lucide-react";

export default function ClientPortfolioDetail({ project }: { project: any }) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* 1. Header (GNB) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 transition-colors duration-300 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-extrabold text-white tracking-tight cursor-pointer">
                        DongAn <span className="text-cyan-400 font-light">HVAC</span>
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/about" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide cursor-pointer">회사소개</Link>
                        <Link href="/products" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide cursor-pointer">제품안내</Link>
                        <Link href="/portfolio" className="text-cyan-400 font-medium tracking-wide cursor-pointer">시공사례</Link>
                        <Link href="/contact" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide cursor-pointer">고객지원</Link>
                    </nav>
                    <button className="md:hidden text-white hover:text-cyan-400 transition-colors cursor-pointer" aria-label="Toggle Menu">
                        <Menu size={28} className="cursor-pointer" />
                    </button>
                </div>
            </header>

            {/* 2. Hero Section */}
            <section className="relative h-[60vh] w-full flex items-center justify-center pt-24">
                {/* Background Image */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                    style={{ backgroundImage: `url('${project.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"}')` }}
                />
                <div className="absolute inset-0 bg-slate-950/70 z-10" />

                <div className="relative z-20 text-center px-6 max-w-5xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight break-keep leading-tight"
                    >
                        {project.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-300 font-light"
                    >
                        DongAn HVAC 엔지니어링의 완벽한 기술 적용 사례
                    </motion.p>
                </div>
            </section>

            {/* 3. Project Specs (Glassmorphism Box overlapping Hero) */}
            <section className="relative max-w-7xl mx-auto px-6 z-30 -mt-16 md:-mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-700 w-full"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-700/50">
                        <div className="px-4 text-center">
                            <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-2">고객사</p>
                            <p className="text-white font-extrabold text-lg md:text-xl">{project.clientName || "DongAn 고객사"}</p>
                        </div>
                        <div className="px-4 text-center">
                            <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-2">시공일자</p>
                            <p className="text-white font-extrabold text-lg md:text-xl">{project.date}</p>
                        </div>
                        <div className="px-4 text-center">
                            <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-2">시공면적</p>
                            <p className="text-cyan-400 font-extrabold text-lg md:text-xl">{project.area || "협의"}</p>
                        </div>
                        <div className="px-4 text-center">
                            <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-2">적용솔루션</p>
                            <p className="text-white font-extrabold text-lg md:text-xl break-keep">{project.solution}</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 4. Content Body */}
            <main className="py-24 px-6 max-w-5xl mx-auto space-y-24">
                {/* Description */}
                <div className="space-y-16">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-3xl font-extrabold text-white flex items-center">
                            <span className="w-8 h-1 bg-cyan-500 mr-4 rounded-full"></span>
                            상세 내용
                        </h3>
                        <p className="text-slate-300 text-lg leading-loose font-light break-keep pl-12 whitespace-pre-wrap">
                            {project.solution}
                            <br /><br />
                            동안 공조의 책임 시공으로 완벽하게 마무리된 현장입니다. 고객 만족을 최우선으로 생각하는 저희의 기술력을 직접 확인해 보세요.
                        </p>
                    </motion.div>
                </div>

                {/* Sub Gallery */}
                {project.images && project.images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-slate-800">
                        {project.images.map((imgSrc: string, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="h-80 rounded-2xl overflow-hidden bg-slate-800"
                            >
                                <img src={imgSrc} alt={`현장사진 ${idx + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center items-center gap-4 mt-12 mb-20">
                    <Link
                        href="/portfolio"
                        className="rounded-full px-6 py-3 border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group cursor-pointer font-medium"
                    >
                        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> 목록으로 돌아가기
                    </Link>
                    <Link
                        href="/contact"
                        className="px-10 py-4 rounded-full bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        이런 시스템 문의하기 <ArrowRight size={20} className="cursor-pointer" />
                    </Link>
                </div>
            </main>

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
