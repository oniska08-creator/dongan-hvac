import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import ProductGallery from "./ProductGallery";

export const dynamic = 'force-dynamic';

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
            {/* 페이지 콘텐츠 */}
            <div className="relative pt-20 md:pt-24 pb-2 md:pb-4">
                <main className="max-w-7xl mx-auto px-6">
                    <ProductGallery
                        images={(product as any).images as string[]}
                        fallbackUrl={product.imageUrl}
                        name={product.name}
                    >
                        <span className="text-cyan-400 font-bold tracking-widest text-sm md:text-base lg:text-lg mb-4 uppercase drop-shadow-[0_0_8px_rgba(8,145,178,0.5)]">
                            {product.category || "General"}
                        </span>
                        {/* Title - Hidden on PC here because ProductGallery handles it centrally */}
                        <h1 className="sm:hidden text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-8 tracking-tighter drop-shadow-lg">
                            {product.name}
                        </h1>
                        <p className="text-slate-400 text-xl md:text-2xl font-light leading-relaxed mb-6 break-keep">
                            {product.description || product.features || "동안공조가 제안하는 최적의 공조 솔루션으로 공간의 가치를 높여보세요."}
                        </p>

                        {/* 상세 스펙 표 */}
                        {specs.length > 0 && (
                            <div className="pt-0">
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">상세내용</h3>
                                <ul className="space-y-4">
                                    {specs.map((spec, idx) => (
                                        <li key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 last:pb-0">
                                            <span className="text-slate-500 font-semibold sm:w-1/3 flex items-center gap-3 tracking-wide text-lg md:text-xl">
                                                <CheckCircle2 size={20} className="text-cyan-600" />
                                                {spec.key}
                                            </span>
                                            <span className="text-slate-200 font-normal sm:w-2/3 break-words text-xl md:text-2xl tabular-nums">
                                                {spec.value}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                    </ProductGallery>

                    {/* [PC ONLY] Final Action Buttons - Catalogue Closing Style */}
                    <div className="hidden sm:flex items-center justify-center gap-6 mt-4 md:mt-6 pt-4 md:pt-6 pb-8 md:pb-12 max-w-7xl mx-auto">
                        <Link 
                            href="/products"
                            className="px-10 py-5 rounded-2xl border border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-bold flex items-center gap-3 group text-lg"
                        >
                            <ArrowLeft size={22} className="transition-transform group-hover:-translate-x-1" />
                            목록으로 돌아가기
                        </Link>
                        <Link 
                            href={`/contact?subject=${encodeURIComponent(product.name + ' 제품 관련 문의드립니다.')}`}
                            className="px-14 py-5 rounded-2xl bg-cyan-500 text-white font-black text-xl hover:bg-cyan-400 transition-all shadow-[0_15px_35px_rgba(8,145,178,0.3)] active:scale-95"
                        >
                            견적 상담하기
                        </Link>
                    </div>
                </main>
            </div>

            {/* [Unified Fixed Bottom Bar] - Mobile Only (md:hidden) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-3xl border-t border-slate-800/60 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] md:hidden">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <Link
                        href="/products"
                        className="p-4 md:px-8 md:py-5 rounded-2xl border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center shrink-0 active:scale-95 group font-bold"
                        aria-label="목록으로"
                    >
                        <ArrowLeft size={24} className="md:mr-2 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden md:inline">목록으로 돌아가기</span>
                    </Link>
                    <Link
                        href={`/contact?subject=${encodeURIComponent(product.name + ' 제품 관련 문의드립니다.')}`}
                        className="flex-1 md:flex-none md:px-12 py-4 md:py-5 rounded-2xl bg-cyan-500 text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(8,145,178,0.3)] hover:bg-cyan-400 active:scale-[0.98] transition-all"
                    >
                        견적 상담하기 <ArrowRight size={22} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
