import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ message: 'Forbidden. Only SUPER_ADMIN can edit accounts.' }, { status: 403 });
        }

        const targetUserId = parseInt(resolvedParams.id, 10);
        const currentUserId = parseInt((session.user as any).id, 10);

        if (isNaN(targetUserId)) {
            return NextResponse.json({ message: 'Invalid ID parameters.' }, { status: 400 });
        }

        const body = await req.json();

        // 1. 자기 자신의 권한을 강제로 내리지 못하도록 방어 (Self-demotion prevention)
        if (targetUserId === currentUserId && body.role && body.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ message: '슈퍼 관리자는 스스로의 권한을 강등시킬 수 없습니다.' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: {
                role: body.role,
                ...(body.password && { password: body.password }), // Password is sent hashed from client/or handled if plain (for simplicity assume directly updated here or just let role edit only)
            },
            select: { id: true, username: true, name: true, role: true }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ message: 'Forbidden. Only SUPER_ADMIN can delete accounts.' }, { status: 403 });
        }

        const targetUserId = parseInt(resolvedParams.id, 10);
        const currentUserId = parseInt((session.user as any).id, 10);

        // 2. 자기 자신 삭제 방어 (Self-delete prevention)
        if (targetUserId === currentUserId) {
            return NextResponse.json({ message: '자기 자신의 슈퍼 관리자 계정은 삭제할 수 없습니다.' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: targetUserId }
        });

        return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'Failed to delete account' }, { status: 500 });
    }
}
