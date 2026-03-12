"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, password }),
            });

            if (res.ok) {
                setMessage({ text: '새 관리자 계정이 성공적으로 생성되었습니다.', type: 'success' });
                setName('');
                setUsername('');
                setPassword('');
            } else {
                const data = await res.json();
                setMessage({ text: data.message || '계정 생성에 실패했습니다.', type: 'error' });
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage({ text: '서버 오류가 발생했습니다.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 mt-6 md:mt-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">관리자 설정</h1>
                <p className="text-slate-500 mt-2 text-sm">시스템 보안 및 내부 관리자 생성 권한을 제어합니다.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8"
            >
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">새로운 관리자 계정 생성 (폐쇄형)</h2>
                    <p className="text-sm text-slate-500 mt-1">이 페이지는 현재 로그인된 최고 관리자만 접근할 수 있습니다.</p>
                </div>

                {message.text && (
                    <div className={`p-4 mb-6 rounded-lg text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleCreateAdmin} className="space-y-6 max-w-md">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">담당자 이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                            placeholder="예: 홍길동 팀장"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">관리자 아이디</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                            placeholder="영문/숫자 4자 이상"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                            placeholder="강력한 비밀번호를 입력하세요"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-md ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'}`}
                    >
                        {isLoading ? '생성 중...' : '새 관리자 등록'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
