import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Inserting into DB...')
    const newPortfolio = await prisma.portfolio.create({
        data: {
            title: '테스트 시공사례',
            solution: '테스트 솔루션',
            date: '2026-02-26',
        },
    })
    console.log('Created:', newPortfolio)

    console.log('Querying DB...')
    const allPortfolios = await prisma.portfolio.findMany()
    console.log('All:', allPortfolios)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
