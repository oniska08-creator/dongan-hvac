import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ClientPortfolioDetail from './ClientPortfolioDetail';

export const revalidate = 60; // 60초 주기로 백그라운드에서 캐시 갱신 (ISR)

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const portfolioId = parseInt(resolvedParams.id, 10);

    if (isNaN(portfolioId)) {
        notFound();
    }

    const project = await prisma.portfolio.findUnique({
        where: { id: portfolioId }
    });

    if (!project) {
        notFound();
    }

    return <ClientPortfolioDetail project={project} />;
}
