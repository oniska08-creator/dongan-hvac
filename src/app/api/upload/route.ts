import { NextResponse } from 'next/server';
import { uploadToSupabase } from '@/lib/storage';

export async function POST(request: Request) {
    try {
        const form = await request.formData();
        const file = form.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Supabase Storage로 업로드 (storage 유틸리티 사용)
        const publicUrl = await uploadToSupabase(file);

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error('Supabase Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload to Supabase Storage' }, { status: 500 });
    }
}
