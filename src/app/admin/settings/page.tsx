"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus, Key, Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';

export default function AdminSettingsPage() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="max-w-7xl mx-auto space-y-8 mt-6 md:mt-8 pb-20">
            {/* Command Center Header */}
            <div className="flex bg-slate-950 border border-slate-800 rounded-[32px] p-8 md:p-12 shadow-2xl justify-between items-center mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full -ml-32 -mb-20 blur-3xl"></div>
                
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="relative z-10 w-full md:w-auto">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-5">
                        <div className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 shadow-[0_0_30px_rgba(129,140,248,0.2)]">
                            <ShieldCheck className="text-indigo-400" size={40} />
                        </div>
                        시스템 <span className="text-indigo-400">보안 설정</span>
                    </h1>
                    <p className="text-slate-400 mt-6 font-medium max-w-2xl leading-relaxed text-lg md:text-xl">
                        내부 운영 인력을 위한 신규 계정 생성 및 <br className="hidden md:block" />
                        시스템 보안 매개변수를 제어하는 최상위 노드입니다.
                    </p>
                </div>

                <div className="hidden lg:flex flex-col items-end gap-3 relative z-10">
                    <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 px-5 py-2.5 rounded-2xl shadow-inner group transition-all hover:border-indigo-500/30">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
                        <span className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em]">Secure Node 01</span>
                    </div>
                    <p className="text-slate-600 text-xs font-bold tracking-tighter uppercase px-2">Access Level: SUPERVISOR</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Information Area */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-indigo-500" />
                            계정 생성 가이드
                        </h3>
                        <ul className="space-y-4 text-slate-500 text-base md:text-lg leading-relaxed">
                            <li className="flex items-start gap-3">
                                <span className="mt-2.5 w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0"></span>
                                새 관리자는 기본적으로 '중급 관리자' 권한을 부여받습니다.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-2.5 w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0"></span>
                                아이디는 영문소문자와 숫자의 조합으로 4자 이상 입력해 주세요.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-2.5 w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0"></span>
                                비밀번호는 특수문자를 포함하여 8자 이상 권장됩니다.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Form Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full lg:w-2/3 bg-white rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-8 md:p-12 relative"
                >
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-black rounded-lg uppercase tracking-widest mb-4">
                            Registration Terminal
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">신규 운영자 등록</h2>
                    </div>

                    {message.text && (
                        <div className={`p-6 mb-10 rounded-2xl text-base font-bold border flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {message.type === 'success' ? <ShieldCheck /> : <Key />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleCreateAdmin} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-1">
                                <label className="block text-base font-black text-slate-800 mb-3 ml-1">운영 실무자 성명</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <User size={20} className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold placeholder:text-slate-300 text-lg shadow-sm"
                                        placeholder="홍길동"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-base font-black text-slate-800 mb-3 ml-1">시스템 로그인 ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <ShieldCheck size={20} className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold placeholder:text-slate-300 text-lg shadow-sm"
                                        placeholder="Username"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-base font-black text-slate-800 mb-3 ml-1">초기 보안 패스워드</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-16 py-5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-extrabold tracking-widest placeholder:text-slate-300 placeholder:tracking-normal text-lg shadow-sm"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-indigo-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full font-black py-6 rounded-[20px] transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg md:text-xl shadow-xl ${isLoading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:shadow-indigo-500/25'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Terminal Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        운영 인력 신규 등록 <ArrowRight size={24} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
