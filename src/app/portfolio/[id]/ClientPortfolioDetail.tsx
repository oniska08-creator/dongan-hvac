"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
    ArrowLeft, 
    ArrowRight, 
    ImageOff, 
    X, 
    MapPin as MapPinIcon, 
    Ruler as RulerIcon, 
    Calendar as CalendarIcon, 
    Tag as TagIcon, 
    ChevronLeft, 
    ChevronRight 
} from "lucide-react";
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
        setSelectedImage(img);
        setActiveIndex(idx);
        
        // Only open modal on mobile (sm breakpoint is 640px)
        if (window.innerWidth < 640) {
            setSelectedModalImage(img);
            setTimeout(() => {
                setIsModalOpen(true);
            }, 10);
        }
    };

    // Mobile Swipe Handler
    const onDragEnd = (event: any, info: any) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold) {
            if (activeIndex < allImages.length - 1) {
                const nextIdx = activeIndex + 1;
                setActiveIndex(nextIdx);
                setSelectedImage(allImages[nextIdx]);
            }
        } else if (info.offset.x > swipeThreshold) {
            if (activeIndex > 0) {
                const prevIdx = activeIndex - 1;
                setActiveIndex(prevIdx);
                setSelectedImage(allImages[prevIdx]);
            }
        }
    };

    return (
        <>
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
                
                {/* [PC VERSION - WIDE SLIDE LAYOUT] */}
                <section className="hidden sm:flex flex-col w-full pt-20 md:pt-24 gap-4 md:gap-6">
                    <div className="max-w-7xl mx-auto w-full px-6 overflow-hidden">
                        <div className="relative group/main w-full h-[60vh] md:h-[65vh] lg:h-[70vh] max-h-[850px] aspect-[16/9] bg-black rounded-[2rem] overflow-hidden flex items-center justify-center shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeIndex}
                                    src={allImages[activeIndex]}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full h-full object-contain select-none"
                                    draggable={false}
                                />
                            </AnimatePresence>
                            
                            {/* PC Navigation Arrows */}
                            <button 
                                onClick={() => {
                                    const newIdx = activeIndex === 0 ? allImages.length - 1 : activeIndex - 1;
                                    handleThumbnailAction(allImages[newIdx], newIdx);
                                }}
                                className="absolute left-8 p-6 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 text-white opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-cyan-500 hover:border-cyan-400 hover:scale-110 z-20"
                            >
                                <ChevronLeft size={36} />
                            </button>
                            <button 
                                onClick={() => {
                                    const newIdx = activeIndex === allImages.length - 1 ? 0 : activeIndex + 1;
                                    handleThumbnailAction(allImages[newIdx], newIdx);
                                }}
                                className="absolute right-8 p-6 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 text-white opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-cyan-500 hover:border-cyan-400 hover:scale-110 z-20"
                            >
                                <ChevronRight size={36} />
                            </button>

                            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950 z-10 pointer-events-none" />
                            
                        </div>
                    </div>

                    {/* [PC ONLY] Secondary Thumbnail Slider (Horizontal Wide) */}
                    <div className="max-w-7xl mx-auto w-full py-4">
                        <GalleryThumbnailSlider 
                            images={allImages}
                            activeIndex={activeIndex}
                            name={project.title}
                            onThumbnailClick={handleThumbnailAction}
                        />
                    </div>

                </section>

                {/* [MOBILE VERSION GALLERY] */}
                <section className="block sm:hidden w-full pt-20 bg-black relative">
                    <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center touch-pan-y">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                src={allImages[activeIndex]}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={onDragEnd}
                                className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
                                onClick={() => {
                                    setSelectedModalImage(allImages[activeIndex]);
                                    setIsModalOpen(true);
                                }}
                            />
                        </AnimatePresence>
                        
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white tracking-widest z-20">
                            {activeIndex + 1} / {allImages.length}
                        </div>
                    </div>

                    <div className="mt-4 px-6 overflow-x-auto scrollbar-none flex gap-3 pb-6">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setActiveIndex(idx);
                                    setSelectedImage(img);
                                }}
                                className={`relative w-24 h-24 shrink-0 aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                    activeIndex === idx 
                                        ? "border-cyan-400 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                                        : "border-slate-800 opacity-60"
                                }`}
                            >
                                <img src={img} alt="thumb" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <div className="px-6 py-6 bg-slate-950">
                        <div className="flex gap-2">
                            <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-md border border-cyan-400/20">{project.date}</span>
                            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 uppercase tracking-wider">Solution</span>
                        </div>
                    </div>
                </section>

                {/* [PROJECT SUMMARY CARDS] */}
                <section className="relative max-w-7xl mx-auto px-6 z-30 mb-3 md:mb-6 text-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {/* 프로젝트명 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-800/40 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-700/50 flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6 transition-all hover:bg-slate-800/60 group shadow-lg"
                        >
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-pink-500/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform duration-300">
                                <TagIcon size={22} className="md:size-7" />
                            </div>
                            <div className="text-center md:text-left overflow-hidden">
                                <p className="text-slate-500 text-[9px] md:text-xs font-bold tracking-widest uppercase mb-1">프로젝트명</p>
                                <p className="text-white text-[11px] md:text-xl font-black break-keep truncate">{project.title}</p>
                            </div>
                        </motion.div>
                        {/* 고객사 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-800/40 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-700/50 flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6 transition-all hover:bg-slate-800/60 group shadow-lg"
                        >
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-cyan-500/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                <MapPinIcon size={22} className="md:size-7" />
                            </div>
                            <div className="text-center md:text-left overflow-hidden">
                                <p className="text-slate-500 text-[9px] md:text-xs font-bold tracking-widest uppercase mb-1">고객사</p>
                                <p className="text-white text-[11px] md:text-xl font-black break-keep truncate">{project.clientName || "-"}</p>
                            </div>
                        </motion.div>

                        {/* 시공일자 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-800/40 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6 transition-all hover:bg-slate-800/60 group shadow-lg"
                        >
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-500/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                <CalendarIcon size={22} className="md:size-7" />
                            </div>
                            <div className="text-center md:text-left overflow-hidden">
                                <p className="text-slate-500 text-[9px] md:text-xs font-bold tracking-widest uppercase mb-1">시공일자</p>
                                <p className="text-white text-[11px] md:text-xl font-black break-keep truncate">{project.date || "-"}</p>
                            </div>
                        </motion.div>

                        {/* 시공면적 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-800/40 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6 transition-all hover:bg-slate-800/60 group shadow-lg"
                        >
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-indigo-500/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                <RulerIcon size={22} className="md:size-7" />
                            </div>
                            <div className="text-center md:text-left overflow-hidden">
                                <p className="text-slate-500 text-[9px] md:text-xs font-bold tracking-widest uppercase mb-1">시공면적</p>
                                <p className="text-white text-[11px] md:text-xl font-black break-keep truncate">{project.area || "-"}</p>
                            </div>
                        </motion.div>
                    </div>
                    
                </section>

                {/* [CONTENT BODY] */}
                <main className="py-3 md:py-6 px-6 max-w-7xl mx-auto">
                    <div className="max-w-4xl mx-auto space-y-2 md:space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 text-center md:text-left">
                                상세내용
                            </h3>
                            <div className="bg-slate-800/20 backdrop-blur-sm rounded-[3rem] p-10 md:p-18 shadow-2xl relative overflow-hidden group">
                                <p className="relative z-10 text-slate-300 text-lg md:text-2xl leading-[2.2] md:leading-[2.6] font-light break-keep whitespace-pre-wrap tracking-wide drop-shadow-sm">
                                    {project.solution}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </main>

                {/* [PC ONLY] Final Action Buttons - Catalogue Closing Style */}
                <div className="hidden sm:flex items-center justify-center gap-6 mt-4 md:mt-6 pt-4 md:pt-6 pb-8 md:pb-12 max-w-7xl mx-auto">
                    <Link 
                        href="/portfolio"
                        className="px-10 py-5 rounded-2xl border border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-bold flex items-center gap-3 group text-lg shadow-lg"
                    >
                        <ArrowLeft size={22} className="transition-transform group-hover:-translate-x-1" />
                        목록으로 돌아가기
                    </Link>
                    <Link 
                        href={`/contact?subject=${encodeURIComponent(project.title)}`}
                        className="px-14 py-5 rounded-2xl bg-cyan-500 text-white font-black text-xl hover:bg-cyan-400 transition-all shadow-[0_15px_35px_rgba(8,145,178,0.3)] active:scale-95"
                    >
                        견적 상담하기
                    </Link>
                </div>

            </div>

            {/* [Unified Fixed Bottom Bar] - Mobile Only (md:hidden) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-3xl border-t border-slate-800/60 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] md:hidden">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <Link href="/portfolio" className="p-4 md:px-8 md:py-5 rounded-2xl border border-slate-700 bg-slate-800/50 text-slate-300 items-center justify-center shrink-0 hover:bg-slate-700 hover:text-white transition-all flex group font-bold">
                        <ArrowLeft size={24} className="md:mr-2 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden md:inline">목록으로 돌아가기</span>
                    </Link>
                    <Link href={`/contact?subject=${encodeURIComponent(project.title)}`} className="flex-1 md:flex-none md:px-12 py-4 md:py-5 rounded-2xl bg-cyan-500 text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_12px_30px_rgba(8,145,178,0.4)] hover:bg-cyan-400 transition-all active:scale-[0.98]">
                        견적 상담하기 <ArrowRight size={22} />
                    </Link>
                </div>
            </div>

            {/* Premium Expand Modal */}
            <AnimatePresence>
                {isModalOpen && selectedModalImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 w-full h-full z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
                    >
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white z-50 p-3 md:p-4 bg-slate-800/60 hover:bg-slate-800/80 rounded-full transition-all border border-white/10 backdrop-blur-xl group">
                            <X size={28} className="md:size-8 transition-transform group-hover:scale-110" />
                        </button>
                        <motion.img 
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            src={selectedModalImage} 
                            className="max-w-full max-h-[92vh] object-contain rounded-3xl shadow-[0_50px_120px_rgba(0,0,0,0.9)] border border-white/10"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
