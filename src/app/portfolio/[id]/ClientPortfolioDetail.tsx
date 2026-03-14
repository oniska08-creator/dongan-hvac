"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ImageOff, X } from "lucide-react";
import GalleryThumbnailSlider from "@/components/GalleryThumbnailSlider";
import { useState, useEffect } from "react";

export default function ClientPortfolioDetail({ project }: { project: any }) {
    const allImages = [project.imageUrl, ...(project.images || [])].filter(Boolean);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(allImages.length > 0 ? allImages[0] : null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModalImage, setSelectedModalImage] = useState<string | null>(null);

    // ESC to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleThumbnailAction = (img: string, idx: number) => {
        // 1. Update hero image immediately
        setSelectedImage(img);
        setActiveIndex(idx);
        
        // 2. Open modal with a tiny delay
        setSelectedModalImage(img);
        setTimeout(() => {
            setIsModalOpen(true);
        }, 10);
    };

    return (
        <>
            <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30 pb-32 md:pb-0">
                {/* 2. Hero Section (Static View) */}
                <section 
                    className="relative h-[50vh] md:h-[70vh] w-full flex items-center justify-center pt-16 pointer-events-none select-none"
                >
                    <div className="absolute inset-0 w-full h-full z-0 bg-black flex items-center justify-center">
                        {selectedImage ? (
                            <img 
                                src={selectedImage} 
                                alt={project.title} 
                                className="w-full h-full object-contain"
                                draggable={false}
                            />
                        ) : (
                            <div className="flex flex-col items-center text-slate-700">
                                <ImageOff size={80} className="mb-4 opacity-50" />
                            </div>
                        )}
                    </div>
                    {/* Darker overlay for better text readability */}
                    <div className="absolute inset-0 bg-slate-950/50 z-10 pointer-events-none" />

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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
                            <div className="px-4 text-center pt-4 md:pt-0">
                                <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-2">고객사</p>
                                <p className="text-white font-extrabold text-lg md:text-xl">{project.clientName || "DongAn 고객사"}</p>
                            </div>
                            <div className="px-4 text-center pt-8 md:pt-0">
                                <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-2">시공일자</p>
                                <p className="text-white font-extrabold text-lg md:text-xl">{project.date}</p>
                            </div>
                            <div className="px-4 text-center pt-8 md:pt-0">
                                <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-2">시공면적</p>
                                <p className="text-cyan-400 font-extrabold text-lg md:text-xl">{project.area || "협의"}</p>
                            </div>
                            <div className="px-4 text-center pt-8 md:pt-0">
                                <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-2">적용솔루션</p>
                                <p className="text-white font-extrabold text-lg md:text-xl break-keep">{project.solution}</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Thumbnail Slider Integration */}
                    {allImages.length > 0 && (
                        <div className="mt-12">
                             <div className="mb-6 px-4">
                                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-cyan-400 rounded-full inline-block"></span>
                                    현장 상세 사진
                                </h3>
                            </div>
                            <GalleryThumbnailSlider 
                                images={allImages}
                                activeIndex={activeIndex}
                                name={project.title}
                                onThumbnailClick={handleThumbnailAction}
                            />
                        </div>
                    )}
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
                                시공 상세 내역
                            </h3>
                            <div className="bg-slate-800/30 rounded-3xl p-8 md:p-12 border border-slate-700/50">
                                <p className="text-slate-300 text-lg md:text-xl leading-loose font-light break-keep whitespace-pre-wrap">
                                    {project.solution}
                                    <br /><br />
                                    동안 공조의 책임 시공으로 완벽하게 마무리된 현장입니다. 고객 만족을 최우선으로 생각하는 저희의 기술력을 직접 확인해 보세요.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
                        <Link
                            href="/portfolio"
                            className="w-full sm:w-auto rounded-full px-6 py-4 bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group cursor-pointer font-medium text-base shadow-sm"
                        >
                            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> 목록으로 돌아가기
                        </Link>
                        <Link
                            href={`/contact?subject=${encodeURIComponent(project.title + ' 시공 사례 관련 문의드립니다.')}`}
                            className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#00A9CE] text-white font-medium text-base hover:bg-[#008BB0] hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(0,169,206,0.4)] flex items-center justify-center gap-3 cursor-pointer"
                        >
                            견적 상담하기 <ArrowRight size={22} />
                        </Link>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-slate-950 py-12 md:py-16 px-6 border-t border-slate-900 mt-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-between items-center sm:items-start md:items-center">
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 md:mb-4 tracking-tight">DongAn <span className="text-cyan-400 font-light">HVAC</span></h2>
                            <p className="text-slate-400 leading-relaxed font-light break-keep text-sm md:text-base">
                                공간의 쾌적함을 넘어, 비즈니스의 성공을 돕는 최적의 공조 파트너입니다.
                            </p>
                        </div>
                        <div className="text-center sm:text-left md:text-right flex flex-col gap-2 text-slate-400 font-light text-sm md:text-[15px]">
                            <div className="flex flex-col sm:flex-row sm:gap-4 md:flex-col lg:flex-row">
                                <span>Email: contact@dongan-hvac.com</span>
                                <span className="hidden sm:inline md:hidden lg:inline">&nbsp;|&nbsp;</span>
                                <span>Tel: 02-123-4567</span>
                                <span className="hidden sm:inline md:hidden lg:inline">&nbsp;|&nbsp;</span>
                                <span>Fax: 02-123-4568</span>
                            </div>
                            <p className="pt-2 md:pt-4 border-t border-slate-800/50 mt-2">Copyright &copy; 2026 DongAn HVAC. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/60 z-[60] flex items-center justify-between gap-4 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <Link
                    href="/portfolio"
                    className="p-4 rounded-full border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center justify-center shrink-0"
                    aria-label="목록으로"
                >
                    <ArrowLeft size={22} />
                </Link>
                <Link
                    href={`/contact?subject=${encodeURIComponent(project.title + ' 시공 사례 관련 문의드립니다.')}`}
                    className="flex-1 py-4 rounded-full bg-[#00A9CE] text-white font-medium text-base hover:bg-[#008BB0] transition-all shadow-[0_0_20px_rgba(0,169,206,0.3)] flex items-center justify-center gap-2"
                >
                    견적 상담하기 <ArrowRight size={20} />
                </Link>
            </div>

            {/* 스마트 모달 (Modal View) */}
            <AnimatePresence>
                {isModalOpen && selectedModalImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 w-full h-full z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-8"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsModalOpen(false);
                            }
                        }}
                    >
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-cyan-400 transition-colors z-50 p-2 cursor-pointer bg-slate-800/50 hover:bg-slate-800 rounded-full shadow-lg"
                        >
                            <X size={28} />
                        </button>
                        <motion.img 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedModalImage} 
                            alt={`${project.title} 상세 확대`} 
                            className="max-w-full max-h-full lg:max-w-7xl lg:max-h-[95vh] object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
