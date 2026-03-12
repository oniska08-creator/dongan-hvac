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
        return <div className="text-slate-500 font-bold p-8">로딩 중...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 mt-6 md:mt-8">
            <div className="flex bg-cyan-50 border border-cyan-200 rounded-xl p-6 shadow-sm justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Crown className="text-cyan-600" size={32} />
                        계정 중앙 통제실 (SUPER ADMIN)
                    </h1>
                    <p className="text-slate-600 mt-2 font-medium">조직 내 모든 관리자들의 권한(SUPER_ADMIN / ADMIN)을 감시, 변경, 박탈할 수 있는 최고 권한 구역입니다.</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="overflow-hidden md:overflow-x-auto p-4 md:p-0">
                    <table className="w-full text-left border-collapse block md:table">
                        <thead className="hidden md:table-header-group bg-slate-50 border-b border-slate-200">
                            <tr className="text-slate-500 text-sm font-semibold uppercase tracking-wider block md:table-row">
                                <th className="py-4 px-6 block md:table-cell">사번 (ID)</th>
                                <th className="py-4 px-6 block md:table-cell">이름</th>
                                <th className="py-4 px-6 block md:table-cell">아이디 (Username)</th>
                                <th className="py-4 px-6 block md:table-cell">절대 권한</th>
                                <th className="py-4 px-6 block md:table-cell">가입일시</th>
                                <th className="py-4 px-6 text-center block md:table-cell">관리 액션</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group divide-y divide-slate-100 text-slate-700">
                            {users.map((user) => (
                                <tr key={user.id} className="block md:table-row hover:bg-slate-50 transition-colors bg-white mb-4 md:mb-0 border border-slate-200 md:border-none rounded-xl md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none">
                                    <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 text-sm font-medium whitespace-nowrap border-b border-slate-100 md:border-none">
                                        <span className="md:hidden font-bold text-slate-400 text-xs uppercase">사번 (ID)</span>
                                        {user.id}
                                    </td>
                                    <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 font-bold text-slate-900 whitespace-nowrap border-b border-slate-100 md:border-none">
                                        <span className="md:hidden font-bold text-slate-400 text-xs uppercase">이름</span>
                                        {user.name || '-'}
                                    </td>
                                    <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 font-medium text-slate-600 whitespace-nowrap border-b border-slate-100 md:border-none">
                                        <span className="md:hidden font-bold text-slate-400 text-xs uppercase">아이디</span>
                                        {user.username}
                                    </td>
                                    <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                        <span className="md:hidden font-bold text-slate-400 text-xs uppercase">권한</span>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className={`font-black text-xs px-3 py-1.5 rounded-full border-2 appearance-none cursor-pointer focus:outline-none ${user.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm' : 'bg-slate-200 text-slate-700 border-transparent hover:border-slate-300'}`}
                                        >
                                            <option value="SUPER_ADMIN" className="font-bold">SUPER_ADMIN</option>
                                            <option value="ADMIN" className="font-bold">ADMIN</option>
                                        </select>
                                    </td>
                                    <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 text-sm text-slate-500 whitespace-nowrap border-b border-slate-100 md:border-none">
                                        <span className="md:hidden font-bold text-slate-400 text-xs uppercase">가입일시</span>
                                        {new Date(user.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="flex justify-center md:table-cell py-4 md:py-4 px-2 md:px-6 whitespace-nowrap text-center mt-2 md:mt-0">
                                        <button
                                            onClick={() => handleDelete(user.id, user.username)}
                                            className="w-full md:w-auto inline-flex justify-center items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-lg font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200 shadow-sm cursor-pointer"
                                        >
                                            <Trash2 size={16} /> 강제 삭제
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
