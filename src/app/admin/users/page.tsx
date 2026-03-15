"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Trash2, UserPlus, ShieldAlert, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else if (res.status === 403) {
                alert("접근 권한이 없습니다. (SUPER_ADMIN 전용)");
                router.push("/admin");
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session && (session.user as any)?.role === 'SUPER_ADMIN') {
            fetchUsers();
        } else if (session && (session.user as any)?.role !== 'SUPER_ADMIN') {
            router.push("/admin"); // Not authorized kick
        }
    }, [session, router]);

    const handleRoleChange = async (targetId: number, newRole: string) => {
        const currentUserId = parseInt((session?.user as any)?.id || "0", 10);

        if (targetId === currentUserId && newRole !== 'SUPER_ADMIN') {
            alert('슈퍼 관리자 권한을 스스로 포기할 수 없습니다.');
            return;
        }

        if (window.confirm(`이 계정의 권한을 [${newRole}]으로 변경하시겠습니까?`)) {
            try {
                const res = await fetch(`/api/admin/users/${targetId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: newRole })
                });

                if (res.ok) {
                    alert('성공적으로 권한이 변경되었습니다.');
                    fetchUsers();
                } else {
                    const errorMsg = await res.json();
                    alert(`오류: ${errorMsg.message}`);
                }
            } catch (error) {
                alert('서버 오류가 발생했습니다.');
            }
        }
    };

    const handleDelete = async (targetId: number, username: string) => {
        const currentUserId = parseInt((session?.user as any)?.id || "0", 10);

        if (targetId === currentUserId) {
            alert('자기 자신을 삭제할 수는 없습니다.');
            return;
        }

        if (window.confirm(`정말로 계정 [${username}] 을(를) 시스템에서 영구 삭제하시겠습니까?`)) {
            try {
                const res = await fetch(`/api/admin/users/${targetId}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    alert('계정이 영구적으로 삭제되었습니다.');
                    fetchUsers();
                } else {
                    const errorMsg = await res.json();
                    alert(`오류: ${errorMsg.message}`);
                }
            } catch (error) {
                alert('서버 삭제 요청 중 오류가 발생했습니다.');
            }
        }
    };

    if (isLoading) {
        return <div className="text-slate-500 font-bold p-8 animate-pulse text-center">조직 계정 정보 로딩 중...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 mt-6 md:mt-8">
            <div className="flex bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl justify-between items-center mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
                
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #0891b2 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(8,145,178,0.2)]">
                            <Crown className="text-cyan-400" size={36} />
                        </div>
                        계정 <span className="text-cyan-400">중앙 통제실</span>
                    </h1>
                    <p className="text-slate-400 mt-5 font-medium max-w-2xl leading-relaxed text-lg">
                        조직 내 모든 관리자들의 권한을 실시간으로 감시하고 제어할 수 있는 <br className="hidden md:block" />
                        최고 권한 통제 구역입니다.
                    </p>
                </div>

                <div className="hidden lg:block relative z-10">
                    <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full shadow-inner">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(8,145,178,0.8)]"></span>
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">System Active</span>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
            >
                <div className="overflow-hidden md:overflow-x-auto p-4 md:p-0">
                    <table className="w-full text-left border-collapse block md:table">
                        <thead className="hidden md:table-header-group bg-slate-900 border-b border-slate-800">
                            <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] block md:table-row">
                                <th className="py-5 px-8 text-center block md:table-cell">이름</th>
                                <th className="py-5 px-8 text-center block md:table-cell">아이디 (Username)</th>
                                <th className="py-5 px-8 text-center block md:table-cell">부여 권한</th>
                                <th className="py-5 px-8 text-center block md:table-cell">가입일시</th>
                                <th className="py-5 px-8 text-center block md:table-cell">관리</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group divide-y divide-slate-50 text-slate-700">
                            {users.map((user) => (
                                <tr key={user.id} className="block md:table-row hover:bg-slate-50/50 transition-colors bg-transparent mb-4 md:mb-0 border border-slate-100 md:border-none rounded-2xl md:rounded-none p-4 md:p-0">

                                    <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-6 px-4 md:px-8 font-bold text-slate-900 whitespace-nowrap border-b border-slate-50 md:border-none text-[15px] md:text-base">
                                        <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">관리자 이름</span>
                                        {user.name || '-'}
                                    </td>
                                    <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-6 px-4 md:px-8 font-medium text-slate-600 whitespace-nowrap border-b border-slate-50 md:border-none uppercase text-xs md:text-sm">
                                        <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">로그인 ID</span>
                                        <span className="text-slate-900 md:text-slate-600 font-bold md:font-medium">{user.username}</span>
                                    </td>
                                    <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-6 px-4 md:px-8 whitespace-nowrap border-b border-slate-50 md:border-none">
                                        <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">부여 권한</span>
                                        <div className="relative inline-block">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className={`font-bold text-xs md:text-sm px-4 py-2 rounded-full border appearance-none cursor-pointer focus:outline-none transition-all shadow-sm min-w-[120px] text-center ${user.role === 'SUPER_ADMIN' ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                                            >
                                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-6 px-4 md:px-8 text-xs md:text-sm text-slate-400 font-medium whitespace-nowrap border-b border-slate-50 md:border-none tabular-nums">
                                        <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">가입일시</span>
                                        <span className="text-slate-600 md:text-slate-400">{new Date(user.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                                    </td>
                                    <td className="flex justify-center md:table-cell py-5 md:py-6 px-4 md:px-8 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleDelete(user.id, user.username)}
                                            className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-6 py-2 rounded-xl font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-all border border-red-100 shadow-sm cursor-pointer active:scale-95 text-xs"
                                        >
                                            <Trash2 size={14} /> 삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
