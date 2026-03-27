import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { processProductImages } from '@/lib/storage';

export async function GET(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const params = await context.params;
        const productId = parseInt(params.id, 10);

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const params = await context.params;
        const productId = parseInt(params.id, 10);

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const { name, category, features, description, imageUrl, isVisible, specs, images } = body;

        // 이미지 처리 (Base64 형식 포함 시 자동 변환)
        const processed = await processProductImages({ imageUrl, images });

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                category,
                features,
                description: description !== undefined ? description : undefined,
                imageUrl: processed.imageUrl !== undefined ? processed.imageUrl : undefined,
                images: processed.images !== undefined ? processed.images : undefined,
                isVisible: isVisible !== undefined ? isVisible : undefined,
                specs: specs !== undefined ? specs : undefined,
            }
        });

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: error?.message || 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const params = await context.params;
        const productId = parseInt(params.id, 10);

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.product.delete({
            where: { id: productId }
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: error?.message || 'Failed to delete' }, { status: 500 });
    }
}
