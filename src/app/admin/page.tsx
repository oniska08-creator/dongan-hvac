import React from 'react';
import { Package, FolderKanban, MessageSquare, Users, ChevronRight, ImageOff } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

interface InquiryType {
    id: string | number;
    customerName: string;
    area: string;
    status: string;
}

interface PortfolioType {
    id: string | number;
    imageUrl: string | null;
    title: string;
    date: string;
}

export const dynamic = 'force-dynamic';

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
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 mt-6 md:mt-8 px-4 md:px-0 pb-20">
            {/* Dashboard Header - Command Center Style */}
            <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-8 md:p-10 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">대시보드</h1>
                        <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                            <span className="text-cyan-400 font-bold">비즈니스 커맨드 센터</span>에 오신 것을 환영합니다.<br className="hidden md:block" />
                            공조 설비 운영 현황을 실시간으로 관리하고 모니터링하십시오.
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-5">
                        <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                            <Package size={26} />
                        </div>
                    </div>
                    <div className="text-slate-400 text-[11px] font-black tracking-[0.15em] uppercase mb-1.5">총 상품군</div>
                    <div className="text-4xl font-black text-slate-950 tabular-nums leading-none tracking-tighter">
                        {productCount}<span className="text-xs font-black text-slate-300 ml-2 uppercase tracking-widest">개</span>
                    </div>
                </div>

                <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-5">
                        <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                            <FolderKanban size={26} />
                        </div>
                    </div>
                    <div className="text-slate-400 text-[11px] font-black tracking-[0.15em] uppercase mb-1.5">시공 실적</div>
                    <div className="text-4xl font-black text-slate-950 tabular-nums leading-none tracking-tighter">
                        {portfolioCount}<span className="text-xs font-black text-slate-300 ml-2 uppercase tracking-widest">건</span>
                    </div>
                </div>

                <div className="bg-white p-7 rounded-[2rem] border border-cyan-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgb(6,182,212,0.08)] hover:-translate-y-1 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-all"></div>
                    <div className="flex items-center justify-between mb-5 relative z-10">
                        <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center border border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-500">
                            <MessageSquare size={26} />
                        </div>
                    </div>
                    <div className="text-cyan-600/60 text-[11px] font-black tracking-[0.15em] uppercase mb-1.5 relative z-10">신규 인콰이어리</div>
                    <div className="text-4xl font-black text-cyan-600 relative z-10 tabular-nums leading-none tracking-tighter">
                        {inquiryCount}<span className="text-xs font-black text-cyan-200 ml-2 uppercase tracking-widest">신규</span>
                    </div>
                </div>

                <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-5">
                        <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                            <Users size={26} />
                        </div>
                    </div>
                    <div className="text-slate-400 text-[11px] font-black tracking-[0.15em] uppercase mb-1.5">금일 트래픽</div>
                    <div className="text-4xl font-black text-slate-950 tabular-nums leading-none tracking-tighter">
                        {todayVisitors}<span className="text-xs font-black text-slate-300 ml-2 uppercase tracking-widest">실시간</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {/* 최근 접수된 문의 */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-transparent">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">최근 견적 문의</h2>
                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">최근 견적 접수 현황</p>
                        </div>
                        <Link href="/admin/inquiries" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all group">
                            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentInquiries.map((inquiry: InquiryType) => (
                            <div key={inquiry.id} className="px-10 py-6 flex justify-between items-center hover:bg-slate-50/50 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:scale-150 transition-all glow-cyan"></div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-[17px]">{inquiry.customerName} 고객</div>
                                        <div className="text-sm text-slate-400 mt-1 font-medium tracking-tight">{inquiry.area}</div>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${inquiry.status === '대기중' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                    {inquiry.status}
                                </span>
                            </div>
                        ))}
                        {recentInquiries.length === 0 && (
                            <div className="px-10 py-16 text-center text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">접수된 문의 데이터가 없습니다</div>
                        )}
                    </div>
                </div>

                {/* 최근 등록된 시공사례 */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-transparent">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">시공 실적 업데이트</h2>
                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">최근 시공 사례 등록 현황</p>
                        </div>
                        <Link href="/admin/portfolio" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all group">
                            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentPortfolios.map((portfolio: PortfolioType) => (
                            <div key={portfolio.id} className="px-10 py-6 flex items-center gap-5 hover:bg-slate-50/50 transition-all group">
                                {portfolio.imageUrl ? (
                                    <img src={portfolio.imageUrl} className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-2xl border border-slate-100 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-500" alt="thumb" />
                                ) : (
                                    <div className="w-16 h-12 md:w-20 md:h-14 flex flex-shrink-0 items-center justify-center bg-slate-50 rounded-2xl border border-slate-100">
                                        <ImageOff className="text-slate-300" size={20} />
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-slate-900 text-[17px] group-hover:text-cyan-600 transition-colors">{portfolio.title}</div>
                                    <div className="text-sm text-slate-400 mt-1 font-medium tracking-tight italic tabular-nums">{portfolio.date}</div>
                                </div>
                            </div>
                        ))}
                        {recentPortfolios.length === 0 && (
                            <div className="px-10 py-16 text-center text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">최근 등록된 시공 사례가 없습니다</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
