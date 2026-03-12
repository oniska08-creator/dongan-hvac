import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImageOff, CheckCircle2, Menu, ArrowRight } from "lucide-react";
import ProductGallery from "./ProductGallery";
import ClientHeader from "@/components/ClientHeader";

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
            {/* 페이지 콘텐츠 (레이아웃 보호 영역) */}
            <div className="relative z-10 pt-20 md:pt-28 pb-32 md:pb-16 px-0 md:px-6">
                {/* 메인 2단 분할 영역 */}
                <main className="max-w-7xl mx-auto md:px-6 pb-12">
                        <ProductGallery 
                            images={(product as any).images as string[]} 
                            fallbackUrl={product.imageUrl} 
                            name={product.name} 
                        >
                            <span className="text-cyan-400 font-bold tracking-widest text-xs md:text-sm lg:text-base mb-4 uppercase drop-shadow-[0_0_8px_rgba(8,145,178,0.5)]">
                                {product.category || "General"}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-8 tracking-tighter drop-shadow-lg">
                                {product.name}
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed mb-12 break-keep">
                                {product.description || product.features || "동안공조가 제안하는 최적의 공조 솔루션으로 공간의 가치를 높여보세요."}
                            </p>

                            {/* 상세 스펙 표 */}
                            {specs.length > 0 && (
                                <div className="pt-6 border-t border-slate-800/50 md:border-none">
                                    <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">제품 상세 스펙</h3>
                                    <ul className="space-y-6">
                                        {specs.map((spec, idx) => (
                                            <li key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pb-6 border-b border-slate-800/30 last:border-0 last:pb-0">
                                                <span className="text-slate-500 font-semibold sm:w-1/3 flex items-center gap-3 tracking-wide">
                                                    <CheckCircle2 size={18} className="text-cyan-600" />
                                                    {spec.key}
                                                </span>
                                                <span className="text-slate-200 font-medium sm:w-2/3 break-words text-lg">
                                                    {spec.value}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Call to Action 버튼 (Desktop) */}
                            <div className="hidden md:flex items-center gap-6 mt-16">
                                <Link
                                    href="/products"
                                    className="rounded-full px-8 py-4 border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer font-bold tracking-wide"
                                >
                                    <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> 목록으로
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-10 py-4 rounded-full bg-cyan-500 text-white font-extrabold text-lg hover:bg-cyan-400 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 cursor-pointer"
                                >
                                    빠른 견적 상담하기 <ArrowRight size={22} />
                                </Link>
                            </div>
                        </ProductGallery>
                </main>
            </div>

            {/* 고정형 액션 버튼 (Floating Action Button - Mobile Sticky) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/60 z-[60] flex items-center justify-between gap-4 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <Link
                    href="/products"
                    className="p-4 rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
                    aria-label="목록으로"
                >
                    <ArrowLeft size={22} />
                </Link>
                <Link
                    href="/contact"
                    className="flex-1 py-4 rounded-full bg-cyan-500 text-white font-bold text-lg hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                >
                    견적 상담하기 <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
}
