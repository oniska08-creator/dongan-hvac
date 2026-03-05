import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const products = await prisma.product.findMany({
        take: 12,
        select: {
            id: true,
            imageUrl: true,
            description: true,
            features: true,
            specs: true
        }
    });
    for (const p of products) {
        console.log(`Product ID: ${p.id}`);
        console.log(`- imageUrl length: ${p.imageUrl ? p.imageUrl.length : 0}`);
        console.log(`- description length: ${p.description ? p.description.length : 0}`);
        console.log(`- features length: ${p.features ? p.features.length : 0}`);
        console.log(`- specs length: ${p.specs ? JSON.stringify(p.specs).length : 0}`);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
