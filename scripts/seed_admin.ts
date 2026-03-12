import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin', 10);
    const existing = await prisma.user.findFirst();
    if (existing) {
        console.log('User already exists!', existing);
        return;
    }
    await prisma.user.create({
        data: {
            username: 'admin',
            password,
            name: 'Super Admin',
            role: 'SUPER_ADMIN'
        }
    });
    console.log('Created super admin account: [ admin / admin ]');
}

main().catch(console.error).finally(() => prisma.$disconnect());
