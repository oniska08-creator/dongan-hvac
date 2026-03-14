"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryThumbnailSliderProps {
    images: string[];
    onThumbnailClick: (img: string, index: number) => void;
    activeIndex: number;
    name: string;
}

export default function GalleryThumbnailSlider({ images, onThumbnailClick, activeIndex, name }: GalleryThumbnailSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="relative group w-full px-4 md:px-12 select-none z-40 pointer-events-auto">
            {/* Left Button (Desktop only) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    scroll("left");
                }}
                className="absolute left-8 lg:left-14 top-[140px] z-20 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hidden md:block border border-white/10 hover:bg-black transition-all duration-300"
                aria-label="Scroll left"
            >
                <ChevronLeft size={28} />
            </button>

            {/* Scroll Area - CSS Scroll Snap (Ultra Smooth on Mobile) */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-4 pt-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none touch-pan-y snap-x snap-mandatory"
                style={{ 
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    touchAction: 'pan-y',
                    scrollBehavior: 'smooth'
                }}
            >
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        onClick={() => onThumbnailClick(img, idx)}
                        className={`relative w-[240px] md:w-[280px] aspect-square shrink-0 snap-center rounded-2xl overflow-hidden border-2 select-none cursor-pointer transition-all duration-300 ${
                            activeIndex === idx 
                                ? "border-cyan-400 opacity-100" 
                                : "border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600"
                        }`}
                        style={{ 
                            transform: 'translate3d(0,0,0)',
                            willChange: 'transform',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden'
                        }}
                    >
                        <img
                            src={img}
                            alt={`${name} ${idx + 1}`}
                            className="w-full h-full object-contain bg-black p-4 pointer-events-none select-none"
                            draggable={false}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                ))}
            </div>

            {/* Right Button (Desktop only) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    scroll("right");
                }}
                className="absolute right-8 lg:right-14 top-[140px] z-20 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hidden md:block border border-white/10 hover:bg-black transition-all duration-300"
                aria-label="Scroll right"
            >
                <ChevronRight size={28} />
            </button>
        </div>
    );
}
