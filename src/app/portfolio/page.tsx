import prisma from '@/lib/prisma';
import ClientPortfolio from './ClientPortfolio';

export const revalidate = 60; // 60초 주기로 백그라운드에서 캐시 갱신 (ISR)

export default async function PortfolioPage() {
    const portfolios = await prisma.portfolio.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return <ClientPortfolio portfolios={portfolios} />;
}
