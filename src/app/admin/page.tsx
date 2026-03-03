import React from 'react';
import { Package, FolderKanban, MessageSquare, Users, ChevronRight, ImageOff } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const revalidate = 0; // Dynamic rendering

export default async function AdminDashboard() {
    // 1. Fetch Summary Stats
    const productCount = await prisma.product.count();
    const portfolioCount = await prisma.portfolio.count();
    const inquiryCount = await prisma.inquiry.count({ where: { status: '대기중' } });

    // Visitor Tracking Real Data
    const totalVisitors = await prisma.visitorLog.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await prisma.visitorLog.count({
        where: {
            visitedAt: {
                gte: today
            }
        }
    });

    // 2. Fetch Recent Activities
    const recentInquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    const recentPortfolios = await prisma.portfolio.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">대시보드</h1>
                    <p className="text-slate-500 mt-2 text-sm">관리자님, 환영합니다. 오늘 비즈니스 현황입니다.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
                            <Package size={24} />
                        </div>
                    </div>
                    <div className="text-slate-500 text-sm font-bold mb-1">총 제품 수</div>
                    <div className="text-3xl font-extrabold text-slate-900">{productCount}<span className="text-lg font-medium text-slate-500 ml-1">개</span></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
                            <FolderKanban size={24} />
                        </div>
                    </div>
                    <div className="text-slate-500 text-sm font-bold mb-1">누적 시공사례</div>
                    <div className="text-3xl font-extrabold text-slate-900">{portfolioCount}<span className="text-lg font-medium text-slate-500 ml-1">건</span></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-cyan-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center">
                            <MessageSquare size={24} />
                        </div>
                    </div>
                    <div className="text-cyan-800 text-sm font-bold mb-1 relative z-10">신규 견적 문의 (대기중)</div>
                    <div className="text-3xl font-extrabold text-cyan-600 relative z-10">{inquiryCount}<span className="text-lg font-medium text-cyan-600/70 ml-1">건</span></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="text-slate-500 text-sm font-bold mb-1">금일 방문자 (Total: {totalVisitors})</div>
                    <div className="text-3xl font-extrabold text-slate-900">{todayVisitors}<span className="text-lg font-medium text-slate-500 ml-1">명</span></div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {/* 최근 접수된 문의 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-lg font-extrabold text-slate-900">최근 접수된 문의</h2>
                        <Link href="/admin/inquiries" className="text-sm font-bold text-cyan-600 hover:text-cyan-700 flex items-center">
                            전체보기 <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                <div>
                                    <div className="font-bold text-slate-900">{inquiry.customerName} 고객님</div>
                                    <div className="text-sm text-slate-500 mt-1">{inquiry.area} 관련 문의</div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded ${inquiry.status === '대기중' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                                    {inquiry.status}
                                </span>
                            </div>
                        ))}
                        {recentInquiries.length === 0 && (
                            <div className="px-6 py-8 text-center text-slate-500 text-sm">최근 접수된 문의가 없습니다.</div>
                        )}
                    </div>
                </div>

                {/* 최근 등록된 시공사례 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-lg font-extrabold text-slate-900">최근 등록된 시공사례</h2>
                        <Link href="/admin/portfolio" className="text-sm font-bold text-cyan-600 hover:text-cyan-700 flex items-center">
                            전체보기 <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentPortfolios.map((portfolio) => (
                            <div key={portfolio.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                {portfolio.imageUrl ? (
                                    <img src={portfolio.imageUrl} className="w-16 h-12 object-cover rounded shadow-sm flex-shrink-0" alt="thumb" />
                                ) : (
                                    <div className="w-16 h-12 flex flex-shrink-0 items-center justify-center bg-gray-800 rounded shadow-sm">
                                        <ImageOff className="text-gray-500" size={20} />
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-slate-900">{portfolio.title}</div>
                                    <div className="text-sm text-slate-500">{portfolio.date}</div>
                                </div>
                            </div>
                        ))}
                        {recentPortfolios.length === 0 && (
                            <div className="px-6 py-8 text-center text-slate-500 text-sm">최근 등록된 시공사례가 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
