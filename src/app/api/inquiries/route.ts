import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, contact, area, content } = body;

        if (!customerName || !contact || !area || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newInquiry = await prisma.inquiry.create({
            data: {
                customerName,
                contact,
                area,
                content,
                status: "대기중"
            }
        });

        return NextResponse.json(newInquiry, { status: 201 });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
    }
}
