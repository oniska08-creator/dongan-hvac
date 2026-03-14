"use client";

import React, { useRef, useState, useEffect } from "react";


export interface GalleryThumbnailsProps {
    images: string[];
    activeIndex: number;
    onThumbnailClick: (index: number) => void;
    name: string;
}

export default function GalleryThumbnails({ images, activeIndex, onThumbnailClick, name }: GalleryThumbnailsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Synchronize scroll position when activeIndex changes externally
    useEffect(() => {
        if (!scrollRef.current) return;
        const activeThumb = scrollRef.current.children[activeIndex] as HTMLElement;
        if (activeThumb) {
            const containerWidth = scrollRef.current.clientWidth;
            const thumbOffset = activeThumb.offsetLeft;
            const thumbWidth = activeThumb.clientWidth;
            
            // Center the active thumbnail
            scrollRef.current.scrollTo({
                left: thumbOffset - (containerWidth / 2) + (thumbWidth / 2),
                behavior: "smooth"
            });
        }
    }, [activeIndex]);

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
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 5) {
            setIsDragging(true);
        }
        if (isDragging) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    return (
        <div className="mt-12 border-t border-slate-800/50 pt-10 px-6">
            <h3 className="text-xl font-bold text-white mb-6 tracking-wide">다양한 각도의 상세 사진</h3>
            <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={isDragging ? "cursor-grabbing" : "cursor-grab"}
            >
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                if (!isDragging) {
                                    onThumbnailClick(idx);
                                }
                            }}
                            className={`relative flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 transition-all duration-300 pointer-events-auto ${
                                activeIndex === idx 
                                    ? 'border-cyan-400 opacity-100 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105' 
                                    : 'border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600'
                            }`}
                        >
                            <img 
                                src={img} 
                                alt={`${name} 썸네일 ${idx + 1}`} 
                                className="w-full h-full object-cover pointer-events-none" 
                                draggable={false}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
