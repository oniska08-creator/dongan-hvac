import prisma from '@/lib/prisma';
import ClientHome from './ClientHome';

// Enabled ISR: Revalidate every 60 seconds to dramatically reduce TTFB cache miss latency global performance
export const revalidate = 60;
export default async function Page() {
    const products = await prisma.product.findMany({
        where: { isVisible: true },
        orderBy: { createdAt: 'desc' },
        take: 3
    });
    const portfolios = await prisma.portfolio.findMany({
        orderBy: { createdAt: 'desc' },
        take: 4
    });

    return <ClientHome products={products} portfolios={portfolios} />;
}
