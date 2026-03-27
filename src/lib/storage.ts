import { supabaseAdmin } from './supabase';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

/**
 * Supabase Storage에 파일을 업로드하고 Public URL을 반환하는 함수
 * sharp를 사용하여 WebP로 변환 및 압축을 수행합니다.
 * @param file 업로드할 파일 (Buffer, Blob, File 등)
 * @param bucketName Supabase Storage 버킷 이름 (기본값: 'product-images')
 * @returns {Promise<string>} 생성된 Public URL
 */
export async function uploadToSupabase(file: Buffer | Blob | File, bucketName: string = 'product-images'): Promise<string> {
  // 고유 파일명 생성
  const fileName = `${randomUUID()}.webp`;
  const filePath = `products/${fileName}`;

  // 1. sharp를 사용하여 WebP 변환 및 최적화
  let buffer: Buffer;
  if (file instanceof Blob || file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  const originalSize = buffer.length;

  const optimizedBuffer = await sharp(buffer)
    .webp({ quality: 80 }) // 80% 화질로 WebP 변환
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }) // 최대 1200px 리사이징
    .toBuffer();

  const optimizedSize = optimizedBuffer.length;
  console.log(`[Image Optimization] Original: ${originalSize} bytes, Optimized: ${optimizedSize} bytes (${((1 - optimizedSize / originalSize) * 100).toFixed(2)}% reduction)`);


  // 2. Supabase Storage에 업로드
  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, optimizedBuffer, {
      contentType: 'image/webp',
      upsert: false
    });

  if (error) {
    console.error('Supabase Upload Error:', error);
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  // 3. Public URL 가져오기
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Base64 형식을 체크하고 처리하는 유틸리티
 */
export const isBase64 = (str: string) => {
  if (!str) return false;
  return str.startsWith('data:image/');
};

/**
 * Base64 문자열을 Buffer로 변환
 */
export const base64ToBuffer = (base64: string) => {
  const base64Data = base64.split(';base64,').pop();
  if (!base64Data) return null;
  return Buffer.from(base64Data, 'base64');
};

/**
 * 제품의 imageUrl과 images 배열 내의 Base64 문자열을 모두 처리하여 Supabase Storage URL로 변환
 */
export async function processProductImages({ 
  imageUrl, 
  images 
}: { 
  imageUrl?: string | null, 
  images?: string[] 
}) {
  let finalImageUrl = imageUrl;
  let finalImages = images ? [...images] : [];

  // imageUrl 처리
  if (finalImageUrl && isBase64(finalImageUrl)) {
    const buffer = base64ToBuffer(finalImageUrl);
    if (buffer) {
      finalImageUrl = await uploadToSupabase(buffer);
    }
  }

  // images 배열 처리
  if (finalImages.length > 0) {
    const updatedImages = await Promise.all(
      finalImages.map(async (img) => {
        if (isBase64(img)) {
          const buffer = base64ToBuffer(img);
          if (buffer) {
            return await uploadToSupabase(buffer);
          }
        }
        return img; // 이미 URL이거나 유효하지 않으면 그대로 반환
      })
    );
    finalImages = updatedImages;
  }

  return { imageUrl: finalImageUrl, images: finalImages };
}
