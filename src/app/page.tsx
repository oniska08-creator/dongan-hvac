import prisma from '@/lib/prisma';
import ClientHome from './ClientHome';

// Enabled ISR: Revalidate every 60 seconds to dramatically reduce TTFB cache miss latency global performance
export const revalidate = 60;
export default async function Page() {
    const rawProducts = await prisma.product.findMany({
        where: { isVisible: true },
        select: {
            id: true,
            name: true,
            category: true,
            features: true,
            imageUrl: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    const rawPortfolios = await prisma.portfolio.findMany({
        select: {
            id: true,
            title: true,
            date: true,
            clientName: true,
            imageUrl: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 4
    });

    // RSC Payload (ISR 캐시) 용량 초과 에러 방지를 위한 Base64 및 장문 텍스트 강제 필터링
    const products = rawProducts.map(p => ({
        ...p,
        imageUrl: p.imageUrl?.startsWith('data:image') ? null : p.imageUrl,
        features: (p.features && p.features.length > 100) ? p.features.substring(0, 100) + '...' : p.features
    }));

    const portfolios = rawPortfolios.map(p => ({
        ...p,
        imageUrl: p.imageUrl?.startsWith('data:image') ? null : p.imageUrl
    }));

    return <ClientHome products={products} portfolios={portfolios} />;
}
