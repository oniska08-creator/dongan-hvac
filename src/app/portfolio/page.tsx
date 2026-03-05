import prisma from '@/lib/prisma';
import ClientPortfolio from './ClientPortfolio';

export const revalidate = 60; // 60초 주기로 백그라운드에서 캐시 갱신 (ISR)

export default async function PortfolioPage() {
    // 1. 최소 필드만 조회 (이미지 배열이나 큰 용량 데이터 제외)
    const rawPortfolios = await prisma.portfolio.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            clientName: true,
            area: true,
            solution: true,
            date: true,
            imageUrl: true,
            // images 배열은 용량이 클 수 있으므로 목록 뷰에서는 제외
        },
        take: 20
    });

    // 2. Base64 이미지로 인한 ISR Payload 터짐 방지
    const portfolios = rawPortfolios.map(p => ({
        ...p,
        imageUrl: p.imageUrl?.startsWith('data:image') ? null : p.imageUrl
    }));

    return <ClientPortfolio portfolios={portfolios} />;
}
