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
        <div className="max-w-7xl mx-auto space-y-8 relative mt-6 md:mt-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">문의 내역 관리</h1>
                    <p className="text-slate-500 mt-2 text-sm">고객이 홈페이지를 통해 남긴 견적 문의를 확인하고 상태를 관리합니다.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-hidden md:overflow-x-auto p-4 md:p-0">
                    <table className="w-full text-left border-collapse block md:table">
                        <thead className="hidden md:table-header-group bg-slate-50 border-b border-slate-200">
                            <tr className="text-slate-500 text-sm font-semibold uppercase tracking-wider block md:table-row">
                                <th className="py-4 px-6 whitespace-nowrap block md:table-cell">접수일자</th>
                                <th className="py-4 px-6 whitespace-nowrap block md:table-cell">고객명</th>
                                <th className="py-4 px-6 whitespace-nowrap block md:table-cell">연락처</th>
                                <th className="py-4 px-6 whitespace-nowrap block md:table-cell">현장 평수</th>
                                <th className="py-4 px-6 text-center whitespace-nowrap block md:table-cell">처리상태</th>
                                <th className="py-4 px-6 text-center whitespace-nowrap block md:table-cell">관리</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group divide-y divide-slate-100 text-slate-700">
                            {(() => {
                                const indexOfLastItem = currentPage * itemsPerPage;
                                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                                const currentItems = inquiries.slice(indexOfFirstItem, indexOfLastItem);
                                return currentItems.map((item) => (
                                    <tr key={item.id} className="block md:table-row hover:bg-slate-50 transition-colors bg-white mb-4 md:mb-0 border border-slate-200 md:border-none rounded-xl md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none">
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 font-medium text-slate-500 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">접수일자</span>
                                            {item.date}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 font-bold text-slate-900 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">고객명</span>
                                            {item.name}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">연락처</span>
                                            {item.phone}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">현장 평수</span>
                                            {item.area}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 md:text-center whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">처리상태</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === '대기중' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="flex justify-center md:table-cell py-4 md:py-4 px-2 md:px-6 text-center whitespace-nowrap mt-2 md:mt-0">
                                            <button
                                                onClick={() => openModal(item)}
                                                className="w-full md:w-auto px-4 py-3 md:py-2 bg-slate-100 md:bg-white hover:bg-slate-200 md:hover:bg-slate-50 text-slate-800 font-bold rounded-xl md:rounded-lg text-sm transition-colors border border-slate-200 cursor-pointer shadow-sm md:shadow-none"
                                            >
                                                상세보기
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
                <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 bg-slate-50 rounded-b-2xl gap-4">
                    <span>전체 <strong>{inquiries.length}</strong> 건의 문의가 있습니다.</span>
                    {inquiries.length > itemsPerPage && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 border rounded ${currentPage === 1 ? 'border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
                            >
                                이전
                            </button>
                            {Array.from({ length: Math.ceil(inquiries.length / itemsPerPage) }, (_, i) => i + 1).map(pageNumber => (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-3 py-1 border rounded font-bold cursor-pointer ${currentPage === pageNumber ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(inquiries.length / itemsPerPage), p + 1))}
                                disabled={currentPage === Math.ceil(inquiries.length / itemsPerPage)}
                                className={`px-3 py-1 border rounded ${currentPage === Math.ceil(inquiries.length / itemsPerPage) ? 'border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Popup */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl relative">
                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900">문의 상세 내용</h2>
                                <p className="text-sm text-slate-500 mt-1">접수일자: {selectedInquiry.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded text-sm font-bold ${selectedInquiry.status === '대기중' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                                {selectedInquiry.status}
                            </span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="text-xs font-bold text-slate-400 mb-1">고객명</div>
                                    <div className="font-bold text-slate-900">{selectedInquiry.name}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="text-xs font-bold text-slate-400 mb-1">연락처</div>
                                    <div className="font-bold text-slate-900">{selectedInquiry.phone}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 col-span-2">
                                    <div className="text-xs font-bold text-slate-400 mb-1">현장 정보 (평수/용도)</div>
                                    <div className="font-bold text-slate-900">{selectedInquiry.area}</div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[150px]">
                                <div className="text-xs font-bold text-slate-400 mb-2">상세 문의 내용</div>
                                <div className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                                    {selectedInquiry.content}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            {selectedInquiry.status === "대기중" ? (
                                <button
                                    onClick={() => handleCompleteStatus(selectedInquiry.id)}
                                    className="px-6 py-3 rounded-lg font-bold bg-cyan-600 text-white hover:bg-cyan-700 transition-colors shadow-md flex-1 mr-4 cursor-pointer"
                                >
                                    상담 완료 처리하기
                                </button>
                            ) : (
                                <div className="text-slate-500 font-bold flex-1">이미 상담이 완료된 건입니다.</div>
                            )}
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 rounded-lg font-bold bg-slate-600 text-white hover:bg-slate-700 transition-colors w-32 cursor-pointer"
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
