import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { processProductImages } from '@/lib/storage';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            // 목록 조회 시에는 필요한 필드만 (메모리 절약 및 전송량 최적화)
            select: {
                id: true,
                name: true,
                category: true,
                features: true,
                imageUrl: true,
                isVisible: true,
                createdAt: true,
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, category, features, description, imageUrl, isVisible, specs, images } = body;

        if (!name || !category || !features) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 이미지 처리 (Base64가 있으면 Storage에 업로드 후 URL로 치환)
        const processed = await processProductImages({ imageUrl, images });

        const newProduct = await prisma.product.create({
            data: {
                name,
                category,
                features,
                description: description || "",
                imageUrl: processed.imageUrl || null,
                images: processed.images || [],
                isVisible: isVisible !== undefined ? isVisible : true,
                specs: specs || null,
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
