"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface DetailImageSliderProps {
    images: string[];
    name: string;
    className?: string;
    onIndexChange?: (index: number) => void;
    goToIndex?: number;
}

export default function DetailImageSlider({ images, name, className = "", onIndexChange, goToIndex }: DetailImageSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const allImages = images && images.length > 0 ? images : [];

    // Allow external control via goToIndex prop
    useEffect(() => {
        if (typeof goToIndex === 'number') {
            scrollTo(goToIndex);
        }
    }, [goToIndex]);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.clientWidth;
        const index = Math.round(scrollRef.current.scrollLeft / width);
        setActiveIndex(index);
        if (onIndexChange) onIndexChange(index);
    };

    const scrollTo = (index: number) => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.clientWidth;
        scrollRef.current.scrollTo({
            left: index * width,
            behavior: "smooth"
        });
    };

    const next = () => {
        if (activeIndex < allImages.length - 1) {
            scrollTo(activeIndex + 1);
        } else {
            scrollTo(0); // Loop back
        }
    };

    const prev = () => {
        if (activeIndex > 0) {
            scrollTo(activeIndex - 1);
        } else {
            scrollTo(allImages.length - 1); // Loop to end
        }
    };

    // Mouse Drag logic (Netflix Style)
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
        // Delay resetting isDragging to avoid accidental clicks
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX);
        if (Math.abs(walk) > 5) {
            setIsDragging(true);
        }
        if (isDragging) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    if (allImages.length === 0) {
        return (
            <div className={`w-full aspect-square bg-slate-900 flex flex-col items-center justify-center text-slate-600 rounded-3xl border border-slate-800 ${className}`}>
                <ImageOff size={64} className="mb-4 opacity-50" />
                <span className="uppercase tracking-widest font-semibold opacity-50">Image Ready</span>
            </div>
        );
    }

    return (
        <div className={`relative group w-full overflow-hidden ${className}`}>
            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
                    isDragging ? "cursor-grabbing snap-none scroll-auto" : "cursor-grab snap-x snap-mandatory scroll-smooth"
                }`}
            >
                {allImages.map((img, idx) => (
                    <div
                        key={idx}
                        className="w-full h-full flex-shrink-0 snap-center bg-black flex items-center justify-center"
                    >
                        <img
                            src={img}
                            alt={`${name} ${idx + 1}`}
                            className="w-full h-full object-contain pointer-events-none"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows (PC only) */}
            {allImages.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block border border-white/10 hover:border-cyan-500 hover:scale-110"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block border border-white/10 hover:border-cyan-500 hover:scale-110"
                        aria-label="Next image"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {allImages.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
                    {allImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollTo(idx)}
                            className={`h-2 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                                idx === activeIndex ? "w-8 bg-cyan-400" : "w-2 bg-white/40 hover:bg-white/60"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
