"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
    const [companyInfo, setCompanyInfo] = useState<any>(null);
    const [milestones, setMilestones] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/company');
                if (res.ok) {
                    const data = await res.json();
                    setCompanyInfo(data.companyInfo);
                    setMilestones(data.history);
                }
            } catch (error) {
                console.error("Failed to fetch about data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!companyInfo) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* 2. Sub-Hero Section */}
            <section className="relative w-full flex flex-col items-center justify-center pt-24 md:pt-32 pb-4 md:pb-6">
                <div className="relative z-20 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl"
                    >
                        {companyInfo.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg text-slate-400 font-light max-w-2xl mx-auto break-keep whitespace-pre-wrap"
                    >
                        {companyInfo.subTitle}
                    </motion.p>
                </div>
            </section>

            {/* 3. Content 1 (철학) */}
            <section className="py-6 md:py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-[400px] md:h-[500px]"
                    >
                        <img
                            src={companyInfo.imageUrl}
                            alt="DongAn HVAC 엘리트 시공 시스템"
                            className="w-full h-full object-cover rounded-2xl shadow-2xl border border-slate-800"
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
                            {companyInfo.contentTitle?.includes('</span>') ? (
                                <div dangerouslySetInnerHTML={{ __html: companyInfo.contentTitle }} />
                            ) : (
                                companyInfo.contentTitle.split(' ').map((word: string, i: number) => 
                                    word === '기술력' || word === '완벽한' ? <span key={i} className="text-cyan-400">{word} </span> : word + ' '
                                )
                            )}
                        </h2>
                        <div className="w-12 h-1 bg-cyan-500 rounded-full"></div>
                        <p className="text-slate-400 text-lg leading-relaxed font-light break-keep pt-4 whitespace-pre-wrap">
                            {companyInfo.content1}
                        </p>
                        <p className="text-slate-400 text-lg leading-relaxed font-light break-keep whitespace-pre-wrap">
                            {companyInfo.content2}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 4. Content 2 (연혁) */}
            <section className="py-6 md:py-12 px-6 max-w-7xl mx-auto">
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
        </div>
    );
}
