import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { processProductImages } from '@/lib/storage';

export async function GET() {
    try {
        const portfolios = await prisma.portfolio.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                clientName: true,
                area: true,
                solution: true,
                images: true, // 목록에선 이미지를 제외할 수도 있지만 일단 유지 (URL이므로 부담 적음)
                date: true,
                imageUrl: true
            }
        });
        return NextResponse.json(portfolios);
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, clientName, area, solution, date, imageUrl, images } = body;

        if (!title || !solution || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 이미지 처리 (Base64 변환 지원)
        const processed = await processProductImages({ imageUrl, images });

        const newPortfolio = await prisma.portfolio.create({
            data: {
                title,
                clientName: clientName || '',
                area: area || '',
                solution,
                date,
                imageUrl: processed.imageUrl || null,
                images: processed.images || []
            }
        });

        return NextResponse.json(newPortfolio, { status: 201 });
    } catch (error) {
        console.error('Error creating portfolio:', error);
        return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 });
    }
}
