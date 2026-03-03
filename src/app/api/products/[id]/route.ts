import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const params = await context.params;
        const productId = parseInt(params.id, 10);

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const { name, category, features, description, imageUrl, isVisible, specs } = body;

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                category,
                features,
                description: description !== undefined ? description : undefined,
                imageUrl: imageUrl !== undefined ? imageUrl : undefined,
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
