import Link from "next/link";
import { Menu, ImageOff } from "lucide-react";
import prisma from "@/lib/prisma";
import ProductCategoryRow from "./ProductCategoryRow";

export const revalidate = 60; // 60초 주기로 백그라운드에서 캐시 갱신 (ISR)

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        where: { isVisible: true },
        orderBy: { createdAt: 'desc' }
    });

    // 카테고리별 그룹화 로직
    const groupedProducts = products.reduce((acc: any, product: any) => {
        const category = product.category || '기타 제품';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* 1. Header (GNB) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 transition-colors duration-300 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-extrabold text-white tracking-tight cursor-pointer">
                        DongAn <span className="text-cyan-400 font-light">HVAC</span>
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/about" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium tracking-wide">회사소개</Link>
                        <Link href="/products" className="text-cyan-400 font-medium tracking-wide drop-shadow-[0_0_10px_rgba(8,145,178,0.5)]">제품안내</Link>
                        <Link href="/portfolio" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium tracking-wide">시공사례</Link>
                        <Link href="/contact" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium tracking-wide">고객지원</Link>
                    </nav>
                    <button className="md:hidden text-white hover:text-cyan-400 transition-colors" aria-label="Toggle Menu">
                        <Menu size={28} />
                    </button>
                </div>
            </header>

            {/* 2. Sub-Hero Section */}
            <section className="relative w-full flex flex-col items-center justify-center bg-slate-950 pt-32 pb-16">
                <div className="relative z-20 text-center px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl">
                        완벽한 공조를 위한 <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">라인업 쇼케이스</span>
                    </h1>
                    <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto break-keep">
                        상업 공간부터 주거 공간까지, 목적에 맞는 최고의 시스템을 넷플릭스 스타일로 감상하세요.
                    </p>
                </div>
            </section>

            {/* 3. Netflix-Style Showcase Content Section */}
            <main className="py-12 mx-auto w-full space-y-20 pb-32">
                {Object.keys(groupedProducts).length === 0 && (
                    <div className="text-center text-slate-500 py-12 flex flex-col items-center justify-center min-h-[30vh]">
                        <ImageOff size={48} className="mb-4 text-slate-700" />
                        <p className="font-light text-lg">등록된 제품이 없습니다.</p>
                    </div>
                )}

                {Object.entries(groupedProducts).map(([category, items]: [string, any]) => (
                    <ProductCategoryRow key={category} category={category} items={items} />
                ))}
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 py-12 px-6 border-t border-slate-900 mt-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight">DongAn <span className="text-cyan-400 font-light">HVAC</span></h2>
                        <p className="text-slate-400 leading-relaxed font-light break-keep">
                            공간의 쾌적함을 넘어, 비즈니스의 성공을 돕는 최적의 공조 파트너입니다.
                        </p>
                    </div>
                    <div className="text-center md:text-right text-slate-400 font-light space-y-2 text-[15px]">
                        <p>Email: contact@dongan-hvac.com &nbsp;|&nbsp; Tel: 02-123-4567 &nbsp;|&nbsp; Fax: 02-123-4568</p>
                        <p className="pt-2">Copyright &copy; 2026 DongAn HVAC. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
