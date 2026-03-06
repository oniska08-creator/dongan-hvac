"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    React.useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
            router.push('/login');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans text-xl font-bold">인증 정보 확인 중...</div>;
    }

    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
            {/* 좌측 사이드바 (Sidebar) */}
            <aside className="fixed top-0 left-0 w-64 min-h-screen bg-slate-900 text-white flex flex-col z-50">
                <div className="p-6 text-2xl font-extrabold tracking-tight border-b border-slate-800">
                    DongAn <span className="text-cyan-400 font-light">Admin</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link prefetch={true} href="/admin" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${pathname === '/admin' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium'}`}>대시보드</Link>
                    <Link prefetch={true} href="/admin/products" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${pathname === '/admin/products' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium'}`}>제품 관리</Link>
                    <Link prefetch={true} href="/admin/portfolio" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${pathname === '/admin/portfolio' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium'}`}>시공사례 관리</Link>
                    <Link prefetch={true} href="/admin/inquiries" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${pathname === '/admin/inquiries' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium'}`}>문의 내역</Link>
                </nav>

                <div className="p-4 border-t border-slate-800 mt-auto">
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.4)] cursor-pointer"
                    >
                        <Home size={18} className="cursor-pointer" />
                        메인 홈으로 가기
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left block px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium cursor-pointer">
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* 우측 메인 콘텐츠 */}
            <main className="ml-64 p-8 w-full min-h-screen bg-slate-50">
                {children}
            </main>
        </div>
    );
}
