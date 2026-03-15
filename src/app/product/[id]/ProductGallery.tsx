"use client";
import React, { useState, useEffect } from 'react';
import { ImageOff, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryThumbnailSlider from '@/components/GalleryThumbnailSlider';

interface ProductGalleryProps {
    images: string[];
    fallbackUrl: string | null;
    name: string;
    children?: React.ReactNode;
}

export default function ProductGallery({ images, fallbackUrl, name, children }: ProductGalleryProps) {
    const allImages = images && images.length > 0 ? images : (fallbackUrl ? [fallbackUrl] : []);
    const [selectedImage, setSelectedImage] = useState<string | null>(allImages.length > 0 ? allImages[0] : null);
    const [activeIndex, setActiveIndex] = useState(0);

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
                const newIdx = activeIndex + 1;
                setActiveIndex(newIdx);
                setSelectedImage(allImages[newIdx]);
            }
        } else if (info.offset.x > swipeThreshold) {
            if (activeIndex > 0) {
                const newIdx = activeIndex - 1;
                setActiveIndex(newIdx);
                setSelectedImage(allImages[newIdx]);
            }
        }
    };

    return (
        <div className="flex flex-col w-full">
            {/* [PC VERSION - WIDE SLIDE LAYOUT] */}
            <div className="hidden sm:flex flex-col w-full gap-4 md:gap-6">
                {/* Main Wide Slider Area */}
                <div className="max-w-screen-xl mx-auto w-full px-6 overflow-hidden">
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
                        
                        {/* Navigation Arrows (Visible on Hover) */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                const newIdx = activeIndex === 0 ? allImages.length - 1 : activeIndex - 1;
                                setActiveIndex(newIdx);
                                setSelectedImage(allImages[newIdx]);
                            }}
                            className="absolute left-8 p-5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-cyan-500 hover:border-cyan-400 hover:scale-110 z-20"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                const newIdx = activeIndex === allImages.length - 1 ? 0 : activeIndex + 1;
                                setActiveIndex(newIdx);
                                setSelectedImage(allImages[newIdx]);
                            }}
                            className="absolute right-8 p-5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-cyan-500 hover:border-cyan-400 hover:scale-110 z-20"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Gradient Overlays */}
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* PC Detailed Photo Slider (Integrated GalleryThumbnailSlider) */}
                <div className="max-w-7xl mx-auto w-full py-4">
                    <GalleryThumbnailSlider 
                        images={allImages}
                        name={name}
                        activeIndex={activeIndex}
                        onThumbnailClick={(img, idx) => {
                            setActiveIndex(idx);
                            setSelectedImage(img);
                        }}
                    />
                </div>


                {/* PC Info Section (Wide) */}
                {children && (
                    <div className="w-full max-w-7xl mx-auto px-6 py-2 md:py-4">
                        <div className="text-center mb-2 md:mb-4">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter"
                            >
                                {name}
                            </motion.h1>
                        </div>
                        {children}
                    </div>
                )}
            </div>

            {/* [MOBILE VERSION GALLERY] - Restored */}
            <div className="block sm:hidden w-full">
                <div className="relative w-full aspect-square bg-black overflow-hidden flex items-center justify-center touch-pan-y">
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

                {/* Mobile Thumbnail Slider (Free Mode) */}
                <div className="mt-4 px-6 overflow-x-auto scrollbar-none flex gap-3 pb-6">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setActiveIndex(idx);
                                setSelectedImage(img);
                            }}
                            className={`relative w-20 h-20 shrink-0 aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                activeIndex === idx 
                                    ? "border-cyan-400 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                                    : "border-slate-800 opacity-60"
                            }`}
                        >
                            <img src={img} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* Mobile Info Area */}
                {children && <div className="px-6 py-4">{children}</div>}
            </div>


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
        </div>
    );
}
