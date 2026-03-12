import React from 'react';
import ProductTableClient from './ProductTableClient';

export default function AdminProductsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 relative mt-6 md:mt-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">제품 관리</h1>
                    <p className="text-slate-500 mt-2 text-sm">프론트엔드 제품 목록에 노출되는 제품들을 관리합니다.</p>
                </div>
            </div>
            <ProductTableClient />
        </div>
    );
}

// Table skeletons have been migrated to the SWR client logic
