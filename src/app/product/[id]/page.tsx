import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImageOff, CheckCircle2, Menu, ArrowRight } from "lucide-react";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function ProductDetailPage(props: ProductPageProps) {
    const params = await props.params;
    const productId = parseInt(params.id, 10);

    if (isNaN(productId)) {
        notFound();
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
                <h1 className="text-4xl font-bold mb-4">404 - 제품을 찾을 수 없습니다</h1>
                <p className="mb-8">요청하신 제품 번호에 해당하는 데이터가 존재하지 않습니다.</p>
                <Link href="/products" className="text-cyan-400 hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} />
                    제품 목록으로 돌아가기
                </Link>
            </div>
        );
    }

    // Dynamic specs array from DB
    const specs = (product.specs as Array<{ key: string, value: string }>) || [];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans tracking-tight">

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

            {/* 페이지 콘텐츠 (레이아웃 보호 영역) */}
            <div className="relative z-10 pt-28 pb-16 px-6">
                {/* 메인 2단 분할 영역 */}
                <main className="max-w-7xl mx-auto px-6 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

                        {/* 좌측: 이미지 뷰어 */}
                        <div className="bg-slate-50/5 rounded-3xl p-8 lg:p-12 aspect-square flex items-center justify-center border border-slate-800 shadow-2xl relative group">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-slate-600">
                                    <ImageOff size={80} className="mb-4 opacity-50" />
                                    <span className="uppercase tracking-widest font-semibold opacity-50">Image Ready</span>
                                </div>
                            )}
                            {/* 럭셔리 반사광 효과 */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-3xl" />
                        </div>

                        {/* 우측: 스펙 및 액션 */}
                        <div className="flex flex-col justify-center">
                            <span className="text-cyan-400 font-semibold tracking-wider text-sm lg:text-base mb-2 uppercase drop-shadow-[0_0_8px_rgba(8,145,178,0.5)]">
                                {product.category || "General"}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                                {product.name}
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed mb-8 break-keep">
                                {product.description || product.features || "동안공조가 제안하는 최적의 공조 솔루션으로 공간의 가치를 높여보세요."}
                            </p>

                            {/* 상세 스펙 표 */}
                            {specs.length > 0 && (
                                <div className="border-t border-slate-800/80 pt-8 mt-2">
                                    <h3 className="text-xl font-bold text-white mb-6">제품 상세 스펙</h3>
                                    <ul className="space-y-4">
                                        {specs.map((spec, idx) => (
                                            <li key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pb-4 border-b border-slate-800/40 last:border-0 last:pb-0">
                                                <span className="text-slate-500 font-medium sm:w-1/3 flex items-center gap-2">
                                                    <CheckCircle2 size={16} className="text-cyan-500/70" />
                                                    {spec.key}
                                                </span>
                                                <span className="text-slate-200 font-semibold sm:w-2/3 break-words">
                                                    {spec.value}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Call to Action 버튼 */}
                            <div className="flex justify-center items-center gap-4 mt-12 mb-20">
                                <Link
                                    href="/products"
                                    className="rounded-full px-6 py-3 border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group cursor-pointer font-medium"
                                >
                                    <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> 목록으로 돌아가기
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-10 py-4 rounded-full bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                                >
                                    빠른 견적 상담하기 <ArrowRight size={20} className="cursor-pointer" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
