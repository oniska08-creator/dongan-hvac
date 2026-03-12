import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const hash = await bcrypt.hash('12341234', 10);

        let user;
        try {
            console.log('Trying to find First User');
            user = await prisma.user.findFirst();
        } catch (e) {
            console.log('Error pulling first user:', e);
            throw e;
        }

        if (user) {
            return NextResponse.json({ message: 'User already exists', username: user.username });
        }

        console.log('Creating admin');
        const admin = await prisma.user.create({
            data: {
                username: 'admin',
                password: hash,
                name: 'Super Admin',
                role: 'SUPER_ADMIN'
            }
        });

        return NextResponse.json({ message: 'Success', admin });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
