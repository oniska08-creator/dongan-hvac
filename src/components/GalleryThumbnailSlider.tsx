"use client";

import React, { useRef, useState } from "react";
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
            e.preventDefault(); 
        }

        if (isDragging) {
            // roundLengths: true (Prevent sub-pixel jitter)
            scrollRef.current.scrollLeft = Math.round(scrollLeft - walk);
        }
    };

    // --- Touch Handlers ---
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
            if (e.cancelable) e.stopPropagation(); 
        }

        if (isDragging) {
            // roundLengths: true
            scrollRef.current.scrollLeft = Math.round(scrollLeft - walk);
        }
    };

    return (
        <div className="relative group w-full px-4 md:px-12 select-none z-40 pointer-events-auto">
            {/* Left Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    scroll("left");
                }}
                className="absolute left-8 lg:left-14 top-[140px] z-20 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hidden md:block border border-white/10 hover:bg-black"
                aria-label="Scroll left"
            >
                <ChevronLeft size={28} />
            </button>

            {/* Scroll Area - Optimized Light Engine */}
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`flex overflow-x-auto gap-6 pb-4 pt-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none touch-pan-y ${
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
                        className={`relative w-[200px] sm:w-[240px] md:w-[280px] aspect-square shrink-0 snap-start rounded-2xl overflow-hidden border-2 select-none ${
                            activeIndex === idx 
                                ? "border-cyan-400 opacity-100" 
                                : "border-slate-800 opacity-60"
                        }`}
                        style={{ 
                            transform: 'translate3d(0,0,0)',
                            willChange: 'transform',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden'
                        }}
                        onDragStart={(e) => e.preventDefault()}
                    >
                        <img
                            src={img}
                            alt={`${name} ${idx + 1}`}
                            className="w-full h-full object-contain bg-black p-4 pointer-events-none select-none"
                            draggable={false}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {/* Right Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    scroll("right");
                }}
                className="absolute right-8 lg:right-14 top-[140px] z-20 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hidden md:block border border-white/10 hover:bg-black"
                aria-label="Scroll right"
            >
                <ChevronRight size={28} />
            </button>
        </div>
    );
}
