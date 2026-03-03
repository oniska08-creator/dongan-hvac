import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const params = await context.params;
        const portfolioId = parseInt(params.id, 10);

        if (isNaN(portfolioId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const { title, clientName, area, solution, date, imageUrl, images } = body;

        const updatedPortfolio = await prisma.portfolio.update({
            where: { id: portfolioId },
            data: {
                title,
                clientName: clientName || '',
                area: area || '',
                solution,
                date,
                imageUrl: imageUrl || null,
                images: images || [],
            }
        });

        return NextResponse.json(updatedPortfolio);
    } catch (error: any) {
        console.error('Error updating portfolio:', error);
        return NextResponse.json({ error: error?.message || 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const params = await context.params;
        const portfolioId = parseInt(params.id, 10);

        if (isNaN(portfolioId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.portfolio.delete({
            where: { id: portfolioId }
        });

        return NextResponse.json({ message: 'Portfolio deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting portfolio:', error);
        return NextResponse.json({ error: error?.message || 'Failed to delete' }, { status: 500 });
    }
}
