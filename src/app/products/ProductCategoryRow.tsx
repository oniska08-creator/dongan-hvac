"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductRowProps {
    category: string;
    items: any[];
}

export default function ProductCategoryRow({ category, items }: ProductRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    // 마우스 드래그 핸들러
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsMouseDown(true);
        setIsDragging(false); // 클릭 시점에는 드래그가 아님
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsMouseDown(false);
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        // isDragging 상태는 onClick에서 평가된 직후에 해제되도록 잠시 유지 (setTimeout 사용 혹은 onClick내 처리)
        // 여기서는 브라우저 이벤트 순서 상 MouseUp -> Click 이므로, 
        // 50ms 후 드래그 상태를 해제하여 클릭 핸들러가 isDragging을 감지할 수 있게 방어.
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown || !scrollRef.current) return;
        e.preventDefault();

        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX); // 이동 거리

        // 이동 거리가 5px 이상일 때만 드래그로 판정
        if (Math.abs(walk) > 5) {
            setIsDragging(true);
        }

        if (isDragging) {
            scrollRef.current.scrollLeft = scrollLeft - (walk * 1.5); // 스크롤 속도 가중치 1.5배
        }
    };

    return (
        <section className="w-full select-none">
            {/* 카테고리 제목 */}
            <div className="px-6 md:px-12 max-w-[1600px] mx-auto mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 drop-shadow-md">
                    <span className="w-1.5 h-8 bg-cyan-400 rounded-full inline-block shadow-[0_0_10px_rgba(8,145,178,0.8)]"></span>
                    {category}
                </h2>
            </div>

            {/* 가로 스크롤 컨테이너 + 화살표 래퍼 (relative group) */}
            <div className="relative group px-6 md:px-12 max-w-[1600px] mx-auto">

                {/* 왼쪽 스크롤 버튼 */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-8 lg:left-14 top-[140px] z-20 p-3 rounded-full bg-black/50 hover:bg-black/90 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1/2 hidden md:block border border-white/10 hover:border-cyan-500/50 hover:scale-110"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={28} />
                </button>

                {/* 실제 스크롤 영역 (Netflix View + Drag to scroll) */}
                <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex flex-row overflow-x-auto flex-nowrap gap-6 pb-8 pt-4 select-none
                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                    ${isDragging ? 'cursor-grabbing snap-none scroll-auto' : 'cursor-grab snap-x snap-mandatory scroll-smooth'}`}
                >
                    {items.map((product: any) => (
                        <Link
                            href={`/product/${product.id}`}
                            key={product.id}
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                            // 절대 규격 강제 고정 (w-[280px] shrink-0)
                            // 드래그 중에는 hover 효과들을 잠시 비활성화하거나 클릭 이벤트를 방지하려면 추가 로직 가능하지만 기존 유지
                            className="block w-[280px] shrink-0 snap-start group/card flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 transform hover:-translate-y-2 border border-slate-800 cursor-pointer select-none"
                            onClick={(e) => {
                                // 5px 이상 드래그된 상태면 클릭(링크 이동) 무시
                                if (isDragging) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            {/* Image Box (정사각형 고정: aspect-square w-full) */}
                            <div
                                className="relative aspect-square w-full bg-white overflow-hidden flex items-center justify-center p-4"
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                            >
                                {product.imageUrl ? (
                                    // Pointer events none prevents the image from being dragged as a native ghost element
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover/card:scale-110 transition-transform duration-700 ease-out pointer-events-none"
                                        draggable={false}
                                        onDragStart={(e) => e.preventDefault()}
                                    />
                                ) : (
                                    /* Fallback 이미지 방어 로직 */
                                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500 pointer-events-none">
                                        <ImageOff size={48} className="mb-3 opacity-50" />
                                        <span className="text-sm font-semibold tracking-widest uppercase opacity-50 text-center px-4 leading-tight">DongAn HVAC</span>
                                    </div>
                                )}
                                {/* Image Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>

                            {/* Text & Specs */}
                            <div className="p-6 flex flex-col flex-grow bg-slate-900 border-t border-slate-800/50 relative z-10 transition-colors duration-300 group-hover/card:bg-slate-800 pointer-events-none">
                                <h3 className="text-lg md:text-xl font-extrabold text-white mb-3 line-clamp-2 tracking-tight group-hover/card:text-cyan-400 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 line-clamp-3 font-light leading-relaxed flex-grow">
                                    {product.features}
                                </p>

                                {/* Buttons - Enable pointer events on button so it's clickable */}
                                <div className="mt-auto pointer-events-auto">
                                    <div
                                        className="w-full inline-flex items-center justify-center px-4 py-3 bg-slate-950 text-slate-300 group-hover/card:text-cyan-400 border border-slate-700/50 group-hover/card:border-cyan-500/50 rounded-xl font-bold transition-all duration-300 text-sm shadow-md group-hover/card:shadow-[0_0_15px_rgba(8,145,178,0.2)]"
                                    >
                                        상세보기
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* 오른쪽 스크롤 버튼 */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-8 lg:right-14 top-[140px] z-20 p-3 rounded-full bg-black/50 hover:bg-black/90 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1/2 hidden md:block border border-white/10 hover:border-cyan-500/50 hover:scale-110"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={28} />
                </button>

            </div>
        </section>
    );
}
