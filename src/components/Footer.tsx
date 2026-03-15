"use client";
import React from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();

    // Hide on admin routes and login page
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
        return null;
    }

    return (
        <footer className="bg-slate-950 py-3 md:py-4 px-6 border-t border-slate-900 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-10 justify-between items-center text-slate-100">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">DongAn <span className="text-cyan-400 font-light text-xl">HVAC</span></h2>
                    <p className="text-slate-500 leading-relaxed font-light break-keep max-w-sm text-sm">
                        공간의 가치를 온도와 공기로 증명합니다. 최첨단 공조 엔지니어링의 표준을 선도하는 파트너입니다.
                    </p>
                </div>
                <div className="text-center md:text-right space-y-2">
                    <p className="text-slate-400 text-sm font-medium">서울특별시 강남구 테헤란로 123 동안빌딩 5층</p>
                    <p className="text-slate-500 text-[10px] tracking-widest uppercase">Copyright &copy; 2026 DongAn HVAC. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
