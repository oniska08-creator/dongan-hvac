const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        take: 12,
        select: {
            id: true,
            imageUrl: true,
        }
    });
    for (const p of products) {
        console.log(`Product ID: ${p.id}`);
        console.log(`- imageUrl length: ${p.imageUrl ? p.imageUrl.length : 0}`);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
