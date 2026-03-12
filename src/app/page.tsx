import prisma from '@/lib/prisma';
import ClientHome from './ClientHome';

export const dynamic = 'force-dynamic';
// Enabled ISR: Revalidate every 60 seconds to dramatically reduce TTFB cache miss latency global performance
//export const revalidate = 60;
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
        take: 4
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

    // RSC Payload (ISR 캐시) 용량 관리를 하면서, Blob의 인터넷 주소만 통과시킴 (과거 쓰레기 Data 차단)
    const products = rawProducts.map(p => ({
        ...p,
        imageUrl: (p.imageUrl && p.imageUrl.startsWith('https://')) ? p.imageUrl : null,
        features: (p.features && p.features.length > 100) ? p.features.substring(0, 100) + '...' : p.features
    }));

    const portfolios = rawPortfolios.map(p => ({
        ...p,
        imageUrl: (p.imageUrl && p.imageUrl.startsWith('https://')) ? p.imageUrl : null
    }));

    return <ClientHome products={products} portfolios={portfolios} />;
}
