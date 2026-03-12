import { Client } from 'pg';
import bcrypt from 'bcryptjs';

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        const hash = await bcrypt.hash('12341234', 10);
        await client.query(`
            INSERT INTO "User" (username, password, name, role, "createdAt")
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (username) DO NOTHING
        `, ['admin', hash, 'Super Admin', 'SUPER_ADMIN']);
        console.log('Successfully seeded admin user via PG protocol (admin / 12341234)');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

main();
