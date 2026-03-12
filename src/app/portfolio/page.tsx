import prisma from '@/lib/prisma';
import ClientPortfolio from './ClientPortfolio';

export const dynamic = 'force-dynamic';
//export const revalidate = 60; // 60초 주기로 백그라운드에서 캐시 갱신 (ISR)

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
            // images 배열은 여러 장의 Blob URL이 포함될 수 있어 목록에선 제외하지만, 스토리지 기반이므로 개수는 대폭 늘릴 수 있음
        },
        take: 40
    });

    // 2. Vercel Blob 스토리지 URL 만 통과시키고, 과거의 Base64 데이터가 섞여있다면 null 처리하여 에러 방지
    const portfolios = rawPortfolios.map(p => ({
        ...p,
        imageUrl: (p.imageUrl && p.imageUrl.startsWith('https://')) ? p.imageUrl : null
    }));

    return <ClientPortfolio portfolios={portfolios} />;
}
