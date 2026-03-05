"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu } from "lucide-react";
// 1. 설계도(타입) 지정
interface InquiryType {
    id: string | number;
    customerName: string;
}

export default function AboutPage() {
    const milestones = [
        { year: "2026", title: "스마트 공조 시스템 글로벌 진출", desc: "AI 기반 빌딩 에너지 관리 시스템(BEMS) 해외 수출 계약 체결" },
        { year: "2020", title: "친환경 환기시스템 라인업 확대", desc: "초미세먼지 대응 전열교환기 자체 개발 및 특허 취득" },
        { year: "2012", title: "대형 상업시설 시공 누적 1,000건 돌파", desc: "주요 대기업 사옥 및 복합 쇼핑몰 공조 시스템 전담 시공사 선정" },
        { year: "2004", title: "DongAn HVAC 설립", desc: "최고의 기술력과 신뢰를 바탕으로 공조설비 전문 기업 출범" },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* 1. Header (GNB) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 transition-colors duration-300 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-extrabold text-white tracking-tight cursor-pointer">
                        DongAn <span className="text-cyan-400 font-light">HVAC</span>
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/about" className="text-cyan-400 font-medium tracking-wide">회사소개</Link>
                        <Link href="/products" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide">제품안내</Link>
                        <Link href="/portfolio" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide">시공사례</Link>
                        <Link href="/contact" className="text-white hover:text-cyan-400 transition-colors font-medium tracking-wide">고객지원</Link>
                    </nav>
                    <button className="md:hidden text-white hover:text-cyan-400 transition-colors" aria-label="Toggle Menu">
                        <Menu size={28} />
                    </button>
                </div>
            </header>

            {/* 2. Sub-Hero Section */}
            <section className="relative h-[40vh] w-full flex items-center justify-center bg-slate-800 pt-24">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900 z-10" />
                <div className="relative z-20 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight"
                    >
                        회사소개
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg text-slate-300 font-light max-w-2xl mx-auto break-keep"
                    >
                        20년의 고집, 보이지 않는 곳에서 공간의 완벽을 만듭니다.
                    </motion.p>
                </div>
            </section>

            {/* 3. Content 1 (철학) */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-[400px] md:h-[500px]"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1541889099354-20d0f4d3819e?q=80&w=1200&auto=format&fit=crop"
                            alt="DongAn HVAC 현장"
                            className="w-full h-full object-cover rounded-2xl shadow-2xl"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white break-keep tracking-tight">
                            기본을 지키는 <span className="text-cyan-400">기술력</span>
                        </h2>
                        <div className="w-12 h-1 bg-cyan-500 rounded-full"></div>
                        <p className="text-slate-400 text-lg leading-relaxed font-light break-keep pt-4">
                            공기의 흐름을 제어하는 것은 단순히 온도를 낮추고 높이는 일차원적인 작업이 아닙니다.
                            그것은 머무는 사람의 건강을 책임지고 비즈니스의 효율성을 극대화하는 가장 근본적인 인프라 설계입니다.
                        </p>
                        <p className="text-slate-400 text-lg leading-relaxed font-light break-keep">
                            DongAn HVAC은 지난 20년간 수많은 산업 현장과 상업 공간에서 묵묵히 완벽에 가까운 공조 시스템을 구축해왔습니다.
                            눈에 보이지 않는 공기이기에, 우리는 더 정직하고 철저하게 기본을 지킵니다.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 4. Content 2 (연혁) */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-800">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                        걸어온 <span className="text-cyan-400">발자취</span>
                    </h2>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 transform md:-translate-x-1/2"></div>

                    <div className="space-y-12">
                        {milestones.map((milestone, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className={`relative flex items-center justify-between flex-col md:flex-row ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Center Dot */}
                                <div className="absolute left-10 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-900 z-10 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>

                                {/* Content Box */}
                                <div className={`w-full md:w-5/12 pl-20 md:pl-0 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'} mb-6 md:mb-0`}>
                                    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-cyan-500/30 transition-colors">
                                        <span className="text-cyan-400 font-extrabold text-xl mb-2 block">{milestone.year}</span>
                                        <h3 className="text-white font-bold text-xl mb-2">{milestone.title}</h3>
                                        <p className="text-slate-400 font-light text-sm break-keep">{milestone.desc}</p>
                                    </div>
                                </div>

                                <div className="hidden md:block w-5/12"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

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
