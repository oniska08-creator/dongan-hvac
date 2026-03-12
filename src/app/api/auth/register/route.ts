import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

export async function POST(req: Request) {
    try {
        // [강력 보안] 이미 로그인된 관리자 세션이 없으면 원천 차단
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ message: 'Unauthorized. Only active admins can create accounts.' }, { status: 403 });
        }

        const body = await req.json();
        const { username, password, name } = body;

        if (!username || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json({ message: '아이디는 영문/숫자 조합으로 4자 이상이어야 합니다.' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                role: 'ADMIN'
            }
        });

        return NextResponse.json({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username, role: newUser.role } }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
