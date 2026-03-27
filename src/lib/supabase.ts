import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 서버 사이드 작업(어드민 관리 등)에 사용되는 서비스 롤 키가 있다면 가져옵니다.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서비스 롤 클라이언트는 권한 제한이 없으므로 서버 측 로직(예: 이미지 업로드)에서 유용합니다.
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : supabase;
