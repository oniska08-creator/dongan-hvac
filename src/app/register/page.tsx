"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (res.ok) {
                alert('관리자 계정이 성공적으로 생성되었습니다. 로그인 페이지로 이동합니다.');
                router.push('/login');
            } else {
                const data = await res.json();
                alert(`가입 실패: ${data.message}`);
            }
        } catch (error) {
            console.error('Registration error', error);
            alert('서버 오류가 발생했습니다.');
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
                    <p className="text-slate-400 mt-2 text-sm">관리자 계정 생성</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">이름 (Name)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder-slate-500"
                            placeholder="관리자 이름을 입력하세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">이메일 (Email ID)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder-slate-500"
                            placeholder="admin@example.com"
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
                            placeholder="안전한 비밀번호를 입력하세요"
                        />
                    </div>

                    <div className="pt-4 space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all duration-300 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg shadow-cyan-600/20'}`}
                        >
                            {isLoading ? '처리 중...' : '계정 생성'}
                        </button>
                        <div className="text-center text-sm text-slate-400">
                            이미 계정이 있으신가요? <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium ml-1">로그인하기</Link>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
