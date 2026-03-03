import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
    try {
        await prisma.visitorLog.create({
            data: {} // Empty data as visitedAt defaults to now()
        });

        return NextResponse.json({ success: true, message: 'Visit recorded' });
    } catch (error) {
        console.error('Visitor recording error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to record visit' },
            { status: 500 }
        );
    }
}
