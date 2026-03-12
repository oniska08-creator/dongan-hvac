import React from 'react';
import ProductTableClient from './ProductTableClient';

export const dynamic = 'force-dynamic';

export default function AdminProductsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 relative mt-6 md:mt-8">
            <ProductTableClient />
        </div>
    );
}

// Table skeletons have been migrated to the SWR client logic
