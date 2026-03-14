"use client";

import { usePathname } from "next/navigation";

export default function KakaoFAB() {
    const pathname = usePathname();

    // Hide on admin routes
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    // Conditionally adjust position for detail pages that have a sticky bottom bar
    const isDetailPage = pathname?.includes('/product/') || pathname?.includes('/portfolio/');
    const bottomClass = isDetailPage ? 'bottom-28' : 'bottom-6';

    return (
        <div className={`fixed ${bottomClass} md:bottom-10 right-6 md:right-10 z-[70] flex flex-col items-end pointer-events-none transition-all duration-300`}>

            {/* Tooltip */}
            <div className="relative mb-3">
                <div className="bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-2xl shadow-lg border border-slate-700 pointer-events-auto cursor-pointer">
                    빠른 견적 문의
                </div>
                {/* Tooltip Tail */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-slate-800 rotate-45 border-r border-b border-slate-700" />
            </div>

            {/* Button Wrapper */}
            <div className="relative flex items-center justify-center pointer-events-auto">
                {/* Main FAB Link with Extremely Subtle Breathing Effect */}
                <a
                    href="http://pf.kakao.com/_YOUR_KAKAO_ID/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-16 h-16 bg-[#FEE500] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center transition-transform hover:scale-110 duration-300 ring-2 ring-transparent hover:ring-[#FEE500]/50 animate-breathing"
                    style={{ 
                        willChange: 'transform',
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d'
                    }}
                    aria-label="카카오톡 상담하기"
                >
                    {/* Kakao Talk Speech Bubble Icon */}
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="#3C1E1E"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 3C6.47715 3 2 6.58172 2 11C2 13.5233 3.44473 15.7749 5.64188 17.1363L4.47545 20.8998C4.38243 21.2001 4.70678 21.4552 4.97864 21.2952L9.58983 18.5794C10.3644 18.8105 11.1685 18.932 12 18.932C17.5228 18.932 22 15.3503 22 11C22 6.58172 17.5228 3 12 3Z"
                        />
                    </svg>
                </a>
                
                {/* 
                    Custom Breathing Animation Style 
                    Subtle scale change (1.0 -> 1.05) with 4s duration for a natural feel.
                */}
                <style jsx global>{`
                    @keyframes breathing {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                    .animate-breathing {
                        animation: breathing 4s ease-in-out infinite;
                    }
                `}</style>
            </div>

        </div>
    );
}
