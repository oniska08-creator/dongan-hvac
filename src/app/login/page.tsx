"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                redirect: false,
                username,
                password
            });

            if (res?.error) {
                alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            } else if (res?.ok) {
                // Clear the legacy simple auth token if it exists
                sessionStorage.removeItem("isAdmin");
                router.push('/admin');
                router.refresh(); // Crucial for updating server components' session state immediately
            }
        } catch (error) {
            console.error('Login error', error);
            alert('로그인 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans text-slate-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-800 shadow-2xl rounded-2xl p-10 max-w-md w-full border border-slate-700 backdrop-blur-md"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        DongAn <span className="text-cyan-400 font-light">Admin</span>
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">보안 관리자 시스템 (NextAuth)</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">관리자 아이디 (Username)</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder-slate-500"
                            placeholder="admin_id"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">비밀번호 (Password)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder-slate-500"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    <div className="pt-4 space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all duration-300 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg shadow-cyan-600/20'}`}
                        >
                            {isLoading ? '인증 중...' : '관리자 로그인'}
                        </button>
                        <div className="text-center text-sm text-slate-400 flex flex-col gap-2">
                            <span><Link href="/" className="hover:text-cyan-300 transition-colors">홈페이지로 돌아가기</Link></span>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
