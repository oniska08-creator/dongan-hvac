import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const params = await context.params;
        const inquiryId = parseInt(params.id, 10);

        if (isNaN(inquiryId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const { status } = body;

        const updatedInquiry = await prisma.inquiry.update({
            where: { id: inquiryId },
            data: {
                status: status !== undefined ? status : "상담완료"
            }
        });

        return NextResponse.json(updatedInquiry);
    } catch (error: any) {
        console.error('Error updating inquiry:', error);
        return NextResponse.json({ error: error?.message || 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const params = await context.params;
        const inquiryId = parseInt(params.id, 10);

        if (isNaN(inquiryId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.inquiry.delete({
            where: { id: inquiryId }
        });

        return NextResponse.json({ message: 'Inquiry deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting inquiry:', error);
        return NextResponse.json({ error: error?.message || 'Failed to delete' }, { status: 500 });
    }
}
