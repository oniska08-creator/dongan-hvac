import Link from "next/link";
import { Menu, ImageOff } from "lucide-react";
import prisma from "@/lib/prisma";
import ProductCategoryRow from "./ProductCategoryRow";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const rawProducts = await prisma.product.findMany({
        where: { isVisible: true },
        // 1. 필수 필드만 Select (description, specs 등 무거운 데이터 제외)
        select: {
            id: true,
            name: true,
            category: true,
            features: true,
            imageUrl: true,
        },
        orderBy: { createdAt: 'desc' },
        // [Blob 도입 완료] Base64가 더 이상 없고 오직 인터넷 URL만 남으므로 넉넉하게 30개로 복구
        take: 30
    });

    // 3. RSC 페이로드(ISR 캐시 파일) 용량 관리를 하면서, 이미지는 복구
    const optimizedProducts = rawProducts.map((p) => {
        // [핵심 포인트] 과거에 남아있을지 모르는 Base64 쓰레기 데이터를 걸러내고, 'http'가 포함된 Vercel Blob 정상 URL만 통과시킵니다.
        const isValidUrl = p.imageUrl && p.imageUrl.startsWith('https://');
        const safeImageUrl = isValidUrl ? p.imageUrl : null;

        // features 텍스트 내에 숨겨진 이미지나 너무 긴 텍스트가 있을 수 있으므로 100자로 잘라냄
        let safeFeatures = p.features || "";
        if (safeFeatures.length > 100) {
            safeFeatures = safeFeatures.substring(0, 100) + '...';
        }

        return {
            id: p.id,
            name: p.name,
            category: p.category,
            imageUrl: safeImageUrl, // 검증된 안전한 URL
            features: safeFeatures
        };
    });

    // 카테고리별 그룹화 로직 (사전 최적화된 데이터 사용)
    const groupedProducts = optimizedProducts.reduce((acc: any, product: any) => {
        const category = product.category || '기타 제품';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* Header is handled globally in layout.tsx via ClientHeader */}

            {/* 2. Sub-Hero Section */}
            <section className="relative w-full flex flex-col items-center justify-center pt-24 md:pt-32 pb-4 md:pb-6">
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
            <main className="py-6 md:py-12 px-6 max-w-7xl mx-auto space-y-6 md:space-y-10">
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

        </div>
    );
}
