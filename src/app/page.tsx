import prisma from '@/lib/prisma';
import ClientHome from './ClientHome';

// Ensure this page runs on the server
export const revalidate = 0; // Disable static caching so data is fresh

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
