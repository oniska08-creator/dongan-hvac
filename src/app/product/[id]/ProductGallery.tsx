"use client";
import React, { useState, useEffect } from 'react';
import { ImageOff, X } from 'lucide-react';
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
        // 1. Update main image immediately
        setSelectedImage(img);
        setActiveIndex(idx);
        
        // 2. Open modal with a tiny delay to ensure interaction clarity
        // This helps the browser prioritize the state change of the main image first
        setSelectedModalImage(img);
        setTimeout(() => {
            setIsModalOpen(true);
        }, 10);
    };

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 lg:gap-16 items-start">
                
                {/* Main Image View (Static, state-driven) */}
                <div 
                    className="relative w-full border-b border-slate-800/80 md:border-none md:rounded-3xl overflow-hidden aspect-square shadow-2xl bg-black flex items-center justify-center pointer-events-none select-none"
                >
                    {selectedImage ? (
                        <img 
                            src={selectedImage} 
                            alt={name} 
                            className="w-full h-full object-contain"
                            draggable={false}
                            loading="eager"
                            style={{ 
                                transform: 'translate3d(0,0,0)',
                                willChange: 'transform',
                                backfaceVisibility: 'hidden'
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center text-slate-600">
                            <ImageOff size={80} className="mb-4 opacity-50" />
                            <span className="uppercase tracking-widest font-semibold opacity-50 text-center px-4">Image Ready</span>
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

            {/* 하단 상세 사진 슬라이더 */}
            {allImages.length > 0 && (
                <div className="mt-16 border-t border-slate-800/50 pt-12">
                    <div className="flex items-center justify-between mb-8 px-6">
                        <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-cyan-400 rounded-full inline-block"></span>
                            다양한 각도의 상세 사진
                        </h3>
                    </div>
                    
                    <GalleryThumbnailSlider 
                        images={allImages}
                        name={name}
                        activeIndex={activeIndex}
                        onThumbnailClick={handleThumbnailAction}
                    />
                </div>
            )}

            {/* 스마트 모달 (Modal View) */}
            {isModalOpen && selectedModalImage && (
                <div 
                    className="fixed inset-0 w-full h-full z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-8 animate-in fade-in duration-300"
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
                    <img 
                        src={selectedModalImage} 
                        alt={`${name} 상세 확대`} 
                        className="max-w-full max-h-full lg:max-w-7xl lg:max-h-[95vh] object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-xl animate-in zoom-in-95 duration-300"
                    />
                </div>
            )}
        </div>
    );
}
