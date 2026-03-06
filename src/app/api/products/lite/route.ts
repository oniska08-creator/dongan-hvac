import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// SWR용 가벼운 데이터 페치 전용 라우트
export async function GET() {
    try {
        const rawProducts = await prisma.product.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                category: true,
                imageUrl: true,
                isVisible: true,
            }
        });

        return NextResponse.json(rawProducts);
    } catch (error) {
        console.error('Error fetching lite products for SWR:', error);
        return NextResponse.json({ error: 'Failed to fetch lite products' }, { status: 500 });
    }
}
