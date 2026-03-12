"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

import AutoLogoutWrapper from './AutoLogoutWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    React.useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN')) {
            router.push('/login');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans text-xl font-bold">인증 정보 확인 중...</div>;
    }

    if (status === 'unauthenticated' || (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 w-full bg-slate-900 text-white z-[60] flex items-center justify-between p-4 shadow-md border-b border-slate-800">
                <div className="text-lg font-extrabold tracking-tight">
                    DongAn <span className="text-cyan-400 font-light">Admin</span>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-white hover:text-cyan-400 transition-colors"
                    aria-label="Toggle admin menu"
                >
                    {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[40] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`fixed top-0 left-0 w-64 h-full bg-slate-900 text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* 모바일 헤더 가림 방지 스페이서 */}
                <div className="h-16 md:hidden flex-shrink-0"></div>

                <div className="hidden md:block p-6 text-2xl font-extrabold tracking-tight border-b border-slate-800">
                    DongAn <span className="text-cyan-400 font-light">Admin</span>
                </div>

                <nav className="flex-1 px-4 py-8 md:py-6 space-y-2">
                    <Link onClick={() => setIsSidebarOpen(false)} prefetch={true} href="/admin" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${pathname === '/admin' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium'}`}>대시보드</Link>
                    <Link onClick={() => setIsSidebarOpen(false)} prefetch={true} href="/admin/products" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${pathname === '/admin/products' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium'}`}>제품 관리</Link>
                    <Link onClick={() => setIsSidebarOpen(false)} prefetch={true} href="/admin/portfolio" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${pathname === '/admin/portfolio' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium'}`}>시공사례 관리</Link>
                    <Link onClick={() => setIsSidebarOpen(false)} prefetch={true} href="/admin/inquiries" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${pathname === '/admin/inquiries' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium'}`}>문의 내역</Link>
                    {session?.user?.role === 'SUPER_ADMIN' && (
                        <Link onClick={() => setIsSidebarOpen(false)} prefetch={true} href="/admin/settings" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${pathname === '/admin/settings' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium'}`}>관리자 설정</Link>
                    )}
                    {session?.user?.role === 'SUPER_ADMIN' && (
                        <Link onClick={() => setIsSidebarOpen(false)} prefetch={true} href="/admin/users" className={`block px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer mt-4 border-t border-slate-700 pt-4 ${pathname === '/admin/users' ? 'bg-cyan-600 text-white font-bold tracking-wide' : 'hover:bg-slate-800 font-medium text-cyan-200'}`}>👑 계정 중앙 관리</Link>
                    )}
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
            <main className="w-full min-h-screen bg-slate-50 transition-all md:ml-64 px-4 pb-8 pt-24 md:p-10 md:pt-12">
                <AutoLogoutWrapper>
                    {children}
                </AutoLogoutWrapper>
            </main>
        </div>
    );
}
