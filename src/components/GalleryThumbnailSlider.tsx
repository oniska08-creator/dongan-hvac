"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryThumbnailSliderProps {
    images: string[];
    onThumbnailClick: (img: string, index: number) => void;
    activeIndex: number;
    name: string;
}

export default function GalleryThumbnailSlider({ images, onThumbnailClick, activeIndex, name }: GalleryThumbnailSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    // --- Mouse Handlers ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsMouseDown(true);
        setIsDragging(false);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsMouseDown(false);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown || !scrollRef.current) return;
        
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX);

        if (Math.abs(walk) > 5) {
            setIsDragging(true);
            // Only prevent default if we are actually dragging to allow other gestures
            e.preventDefault(); 
        }

        if (isDragging) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    // --- Touch Handlers (Mobile Fix) ---
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!scrollRef.current) return;
        setIsMouseDown(true); 
        setIsDragging(false);
        setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleTouchEnd = () => {
        setIsMouseDown(false);
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isMouseDown || !scrollRef.current) return;
        
        const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX);

        if (Math.abs(walk) > 5) {
            setIsDragging(true);
            // Important: prevent vertical page scroll ONLY when swiping horizontally
            if (e.cancelable) e.stopPropagation(); 
        }

        if (isDragging) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    // Pagination Dots Logic
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const sl = scrollRef.current.scrollLeft;
        const sw = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        const percentage = sl / (sw || 1);
        const index = Math.round(percentage * (images.length - 1));
        setCurrentIndex(index);
    };

    useEffect(() => {
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener("scroll", handleScroll);
            return () => ref.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <div className="relative group w-full px-4 md:px-12 select-none z-40 pointer-events-auto">
            {/* Left Button - Exact Sync with ProductCategoryRow position */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    scroll("left");
                }}
                className="absolute left-8 lg:left-14 top-[140px] z-20 p-3 rounded-full bg-black/50 hover:bg-black/90 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1/2 hidden md:block border border-white/10 hover:border-cyan-500/50 hover:scale-110"
                aria-label="Scroll left"
            >
                <ChevronLeft size={28} />
            </button>

            {/* Scroll Area - frictionless feel as requested */}
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`flex overflow-x-auto gap-6 pb-12 pt-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none touch-pan-y ${
                    isDragging ? "cursor-grabbing snap-none scroll-auto" : "cursor-grab snap-x snap-mandatory scroll-smooth"
                }`}
                style={{ 
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    touchAction: 'pan-y' 
                }}
            >
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        onClick={(e) => {
                            if (isDragging) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                            }
                            onThumbnailClick(img, idx);
                        }}
                        className={`relative w-[200px] sm:w-[240px] md:w-[280px] aspect-square shrink-0 snap-start rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/20 select-none ${
                            activeIndex === idx 
                                ? "border-cyan-400 opacity-100 scale-105 shadow-[0_0_20px_rgba(8,145,178,0.4)] ring-4 ring-cyan-400/20" 
                                : "border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600"
                        }`}
                        onDragStart={(e) => e.preventDefault()}
                    >
                        <img
                            src={img}
                            alt={`${name} ${idx + 1}`}
                            className="w-full h-full object-contain bg-black p-4 pointer-events-none select-none"
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                        />
                    </div>
                ))}
            </div>

            {/* Right Button - Exact Sync with ProductCategoryRow position */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    scroll("right");
                }}
                className="absolute right-8 lg:right-14 top-[140px] z-20 p-3 rounded-full bg-black/50 hover:bg-black/90 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1/2 hidden md:block border border-white/10 hover:border-cyan-500/50 hover:scale-110"
                aria-label="Scroll right"
            >
                <ChevronRight size={28} />
            </button>

            {/* Pagination Dots */}
            {images.length > 1 && (
                <div className="flex justify-center gap-3 mt-4 pb-8">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                idx === currentIndex 
                                    ? "w-10 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                                    : "w-2 bg-slate-700 hover:bg-slate-600"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
