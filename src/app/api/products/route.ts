import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
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

        const newProduct = await prisma.product.create({
            data: {
                name,
                category,
                features,
                description: description || "",
                imageUrl: imageUrl || null,
                images: images || [],
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
