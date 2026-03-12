import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ message: 'Forbidden. Only SUPER_ADMIN can access accounts.' }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
    }
}
