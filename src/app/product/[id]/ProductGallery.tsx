"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ImageOff, X } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    fallbackUrl: string | null;
    name: string;
    children?: React.ReactNode;
}

export default function ProductGallery({ images, fallbackUrl, name, children }: ProductGalleryProps) {
    const allImages = images && images.length > 0 ? images : (fallbackUrl ? [fallbackUrl] : []);
    const [selectedImage, setSelectedImage] = useState<string | null>(allImages.length > 0 ? allImages[0] : null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModalImage, setSelectedModalImage] = useState<string | null>(null);

    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

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

    const handleImageClick = (img: string) => {
        setSelectedModalImage(img);
        setIsModalOpen(true);
    };

    // Track scroll position for Mobile Carousel Pagination
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const handleScroll = () => {
            const scrollLeft = carousel.scrollLeft;
            const width = carousel.clientWidth;
            const index = Math.round(scrollLeft / width);
            setActiveCarouselIndex(index);
        };

        carousel.addEventListener('scroll', handleScroll);
        return () => carousel.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 lg:gap-16 items-start">
                
                {/* 
                 * 모바일: 캐러셀 (Edge-to-Edge) 
                 * 데스크탑: 고정형 메인 뷰어 
                 */}
                <div className="relative w-full overflow-hidden border-b border-slate-800/80 md:border-none md:bg-black md:rounded-3xl md:aspect-square flex items-center justify-center md:border md:border-slate-800 md:shadow-2xl group cursor-pointer">
                    
                    {/* 데스크탑 뷰어 */}
                    <div 
                        className="hidden md:flex w-full h-full items-center justify-center p-4 lg:p-8"
                        onClick={() => selectedImage && handleImageClick(selectedImage)}
                    >
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={name}
                                className="w-full h-full object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-slate-600">
                                <ImageOff size={80} className="mb-4 opacity-50" />
                                <span className="uppercase tracking-widest font-semibold opacity-50">Image Ready</span>
                            </div>
                        )}
                        {/* 데스크탑 럭셔리 반사광 효과 */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-3xl" />
                    </div>

                    {/* 모바일 캐러셀 */}
                    <div 
                        ref={carouselRef}
                        className="flex md:hidden w-full aspect-square overflow-x-auto snap-x snap-mandatory scrollbar-none"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} /* Hide scrollbar */
                    >
                        {allImages.length > 0 ? (
                            allImages.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    className="w-full h-full flex-shrink-0 snap-center bg-black flex items-center justify-center"
                                    onClick={() => handleImageClick(img)}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${name} ${idx + 1}`} 
                                        className="w-full h-full object-contain drop-shadow-2xl" 
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-full flex-shrink-0 snap-center bg-slate-900/50 flex flex-col items-center justify-center text-slate-600">
                                <ImageOff size={60} className="mb-4 opacity-50" />
                                <span className="uppercase font-semibold opacity-50 text-sm">Image Ready</span>
                            </div>
                        )}
                    </div>

                    {/* 모바일 페이지네이션 Dot */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden pointer-events-none">
                            {allImages.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === activeCarouselIndex ? 'w-6 bg-cyan-400' : 'w-1.5 bg-slate-600'
                                    }`} 
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                {/* 우측 정보 영역 (children) */}
                {children && (
                    <div className="flex flex-col justify-center h-full pt-10 px-6 md:pt-0 md:px-0">
                        {children}
                    </div>
                )}
            </div>

            {/* 하단 썸네일 리스트 (데스크탑에서만 표시) */}
            {allImages.length > 1 && (
                <div className="hidden md:block mt-12 border-t border-slate-800/50 pt-10 px-6">
                    <h3 className="text-xl font-bold text-white mb-6 tracking-wide">다양한 각도의 제품 사진</h3>
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-transparent pr-8">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setSelectedImage(img);
                                    handleImageClick(img);
                                }}
                                onMouseEnter={() => setSelectedImage(img)}
                                className={`relative flex-shrink-0 w-48 h-48 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                                    selectedImage === img 
                                        ? 'border-cyan-400 opacity-100 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105' 
                                        : 'border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600'
                                }`}
                            >
                                <img src={img} alt={`${name} 썸네일 ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 이미지 상세 모달 (Modal View) */}
            {isModalOpen && selectedModalImage && (
                <div 
                    className="fixed inset-0 w-full h-full z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-8"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsModalOpen(false);
                        }
                    }}
                >
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-cyan-400 transition-colors z-50 p-2 cursor-pointer bg-slate-800/50 hover:bg-slate-800 rounded-full"
                    >
                        <X size={28} />
                    </button>
                    <img 
                        src={selectedModalImage} 
                        alt={`${name} 상세 확대`} 
                        className="max-w-full max-h-full lg:max-w-7xl lg:max-h-[95vh] object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-xl"
                    />
                </div>
            )}
        </div>
    );
}
