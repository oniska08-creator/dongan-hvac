import prisma from '@/lib/prisma';
import ClientPortfolio from './ClientPortfolio';

export const revalidate = 0;

export default async function PortfolioPage() {
    const portfolios = await prisma.portfolio.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return <ClientPortfolio portfolios={portfolios} />;
}
