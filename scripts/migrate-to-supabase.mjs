import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

// Prisma Client with Adapter setup (matches src/lib/prisma.ts)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'product-images';

function isBase64(str) {
  if (!str) return false;
  return typeof str === 'string' && str.startsWith('data:image/');
}

async function uploadBase64ToSupabase(base64) {
  try {
    const base64Data = base64.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');
    
    const fileName = `${randomUUID()}.webp`;
    const filePath = `migrated/${fileName}`;

    // 최적화 (sharp)
    const optimizedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, optimizedBuffer, {
        contentType: 'image/webp',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error(`Error processing image: ${err.message}`);
    return base64; // 실패 시 원본 반환
  }
}

async function migrateProducts() {
  console.log('Migrating Products...');
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    let updateNeeded = false;
    let newImageUrl = product.imageUrl;
    let newImages = [...product.images];

    if (isBase64(product.imageUrl)) {
      console.log(`Uploading imageUrl for Product ID: ${product.id}`);
      newImageUrl = await uploadBase64ToSupabase(product.imageUrl);
      updateNeeded = true;
    }

    for (let i = 0; i < newImages.length; i++) {
      if (isBase64(newImages[i])) {
        console.log(`Uploading images[${i}] for Product ID: ${product.id}`);
        newImages[i] = await uploadBase64ToSupabase(newImages[i]);
        updateNeeded = true;
      }
    }

    if (updateNeeded) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          imageUrl: newImageUrl,
          images: newImages
        }
      });
      console.log(`Updated Product ID: ${product.id}`);
    }
  }
}

async function migratePortfolios() {
  console.log('Migrating Portfolios...');
  const portfolios = await prisma.portfolio.findMany();

  for (const portfolio of portfolios) {
    let updateNeeded = false;
    let newImageUrl = portfolio.imageUrl;
    let newImages = [...portfolio.images];

    if (isBase64(portfolio.imageUrl)) {
      console.log(`Uploading imageUrl for Portfolio ID: ${portfolio.id}`);
      newImageUrl = await uploadBase64ToSupabase(portfolio.imageUrl);
      updateNeeded = true;
    }

    for (let i = 0; i < newImages.length; i++) {
      if (isBase64(newImages[i])) {
        console.log(`Uploading images[${i}] for Portfolio ID: ${portfolio.id}`);
        newImages[i] = await uploadBase64ToSupabase(newImages[i]);
        updateNeeded = true;
      }
    }

    if (updateNeeded) {
      await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: {
          imageUrl: newImageUrl,
          images: newImages
        }
      });
      console.log(`Updated Portfolio ID: ${portfolio.id}`);
    }
  }
}

async function migrateCompanyInfo() {
  console.log('Migrating CompanyInfo...');
  const companyInfo = await prisma.companyInfo.findFirst({
    where: { id: 1 }
  });

  if (companyInfo && isBase64(companyInfo.imageUrl)) {
    console.log(`Uploading imageUrl for CompanyInfo`);
    const newImageUrl = await uploadBase64ToSupabase(companyInfo.imageUrl);
    await prisma.companyInfo.update({
      where: { id: 1 },
      data: {
        imageUrl: newImageUrl
      }
    });
    console.log(`Updated CompanyInfo imageUrl`);
  }
}

async function main() {
  try {
    await migrateProducts();
    await migratePortfolios();
    await migrateCompanyInfo();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
    // pool disconnect to ensure node exit
    await pool.end();
  }
}

main();
