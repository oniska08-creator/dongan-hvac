"use client";
import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchInquiries = async () => {
        try {
            const res = await fetch('/api/inquiries');
            if (res.ok) {
                const data = await res.json();
                // Map the DB fields (customerName, contact, createdAt) to the UI shape (name, phone, date)
                setInquiries(data.map((d: any) => ({
                    id: d.id,
                    date: d.createdAt ? d.createdAt.substring(0, 10) : '',
                    name: d.customerName,
                    phone: d.contact,
                    area: d.area,
                    status: d.status,
                    content: d.content
                })));
            }
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const openModal = (inquiry: any) => {
        setSelectedInquiry(inquiry);
    };

    const closeModal = () => {
        setSelectedInquiry(null);
    };

    const handleCompleteStatus = async (id: number) => {
        try {
            await fetch(`/api/inquiries/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: "상담완료" })
            });
            fetchInquiries();
            setSelectedInquiry(null);
        } catch (error) {
            console.error("Failed to complete inquiry status:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 relative mt-6 md:mt-8 px-4 md:px-0 pb-20">
            {/* Premium Header Container */}
            <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-8 md:p-10 mb-10 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">견적 문의 컨트롤러</h1>
                        <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                            홈페이지로 접수된 <span className="text-white font-bold">고객님들의 견적 요청</span>을 실시간으로 확인하고 진행 상태를 관제합니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.03)] overflow-hidden mb-20">
                <div className="overflow-hidden md:overflow-x-auto p-6 md:p-0">
                    <table className="w-full text-left border-collapse block md:table">
                        <thead className="hidden md:table-header-group bg-slate-900 border-b border-slate-800">
                            <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] block md:table-row">
                                <th className="py-5 px-6 text-center whitespace-nowrap block md:table-cell">접수일자</th>
                                <th className="py-5 px-6 text-center whitespace-nowrap block md:table-cell">고객명</th>
                                <th className="py-5 px-6 text-center whitespace-nowrap block md:table-cell">연락처</th>
                                <th className="py-5 px-6 text-center whitespace-nowrap block md:table-cell">현장 평수</th>
                                <th className="py-5 px-6 text-center whitespace-nowrap block md:table-cell">처리상태</th>
                                <th className="py-5 px-6 text-center whitespace-nowrap block md:table-cell">관리</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group divide-y divide-slate-100 text-slate-700">
                            {(() => {
                                const indexOfLastItem = currentPage * itemsPerPage;
                                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                                const currentItems = inquiries.slice(indexOfFirstItem, indexOfLastItem);
                                return currentItems.map((item) => (
                                    <tr key={item.id} className="block md:table-row hover:bg-slate-50/80 transition-all bg-transparent mb-4 md:mb-0 border border-slate-100 md:border-none rounded-2xl md:rounded-none p-4 md:p-0">
                                        <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 font-medium text-slate-400 whitespace-nowrap border-b border-slate-100 md:border-none text-sm tabular-nums">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">접수일자</span>
                                            <span className="text-slate-900 md:text-slate-400 font-medium">{item.date}</span>
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 font-bold text-slate-900 whitespace-nowrap border-b border-slate-100 md:border-none text-[15px] md:text-base">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">고객명</span>
                                            {item.name}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none text-slate-600 text-sm">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">연락처</span>
                                            {item.phone}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none text-slate-600 text-sm">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">현장 평수</span>
                                            {item.area}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">처리상태</span>
                                            <span className={`px-3 py-1 rounded-full text-[12px] font-extrabold border ${item.status === '대기중' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="flex justify-center md:table-cell py-4 md:py-4 px-2 md:px-6 text-center whitespace-nowrap mt-2 md:mt-0">
                                            <button
                                                onClick={() => openModal(item)}
                                                className="w-full md:w-auto px-4 py-2.5 md:py-1 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl md:rounded-lg text-sm transition-all border border-slate-200 cursor-pointer shadow-sm active:scale-95"
                                            >
                                                상세
                                            </button>
                                        </td>
                                    </tr>
                                ));
                            })()}
                            {inquiries.length === 0 && (
                                <tr className="block md:table-row">
                                    <td colSpan={6} className="block md:table-cell py-8 text-center text-slate-500">들어온 문의가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 bg-slate-50 rounded-b-2xl gap-4">
                    <span>전체 <strong>{inquiries.length}</strong> 건의 문의가 있습니다.</span>
                    {inquiries.length > itemsPerPage && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 border rounded transition-colors ${currentPage === 1 ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                            >
                                이전
                            </button>
                            {Array.from({ length: Math.ceil(inquiries.length / itemsPerPage) }, (_, i) => i + 1).map(pageNumber => (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-3 py-1 border rounded font-bold cursor-pointer transition-colors ${currentPage === pageNumber ? 'border-cyan-500 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(inquiries.length / itemsPerPage), p + 1))}
                                disabled={currentPage === Math.ceil(inquiries.length / itemsPerPage)}
                                className={`px-3 py-1 border rounded transition-colors ${currentPage === Math.ceil(inquiries.length / itemsPerPage) ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Popup */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-white/60 z-[999] flex justify-center items-start pt-[60px] pb-10 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-[95%] sm:w-full max-w-2xl shadow-[0_40px_100px_rgba(0,0,0,0.2)] relative flex flex-col max-h-[calc(100dvh-100px)] sm:max-h-[85vh] overflow-hidden border border-slate-200">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900">문의 상세 내용</h2>
                                <p className="text-sm text-slate-500 mt-1">접수일자: {selectedInquiry.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${selectedInquiry.status === '대기중' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                {selectedInquiry.status}
                            </span>
                        </div>

                        <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">고객명</div>
                                        <div className="font-bold text-slate-900">{selectedInquiry.name}</div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">연락처</div>
                                        <div className="font-bold text-slate-900">{selectedInquiry.phone}</div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                                        <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">현장 정보 (평수/용도)</div>
                                        <div className="font-bold text-slate-900">{selectedInquiry.area}</div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-100 min-h-[150px] shadow-inner">
                                    <div className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">상세 문의 내용</div>
                                    <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                                        {selectedInquiry.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3 flex-shrink-0">
                            {selectedInquiry.status === "대기중" ? (
                                <button
                                    onClick={() => handleCompleteStatus(selectedInquiry.id)}
                                    className="w-full sm:flex-1 px-8 py-3 rounded-xl font-bold bg-cyan-600 text-white hover:bg-cyan-500 transition-all shadow-[0_10px_20px_rgba(8,145,178,0.1)] cursor-pointer order-1 sm:order-1 active:scale-95"
                                >
                                    상담 완료 처리
                                </button>
                            ) : (
                                <div className="text-cyan-600 font-bold flex-1 text-sm md:text-base order-1 sm:order-1 ml-2">✓ 상담 완료된 내역입니다</div>
                            )}
                            <button
                                onClick={closeModal}
                                className="w-full sm:w-32 px-6 py-3 rounded-xl font-bold bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer order-2 sm:order-2 border border-slate-200 active:scale-95"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
