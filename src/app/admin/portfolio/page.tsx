"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ImageOff, Plus } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export const dynamic = 'force-dynamic';

export default function AdminPortfolioPage() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', clientName: '', area: '', solution: '', date: '', img: '', images: [] as string[] });
    const [imgFiles, setImgFiles] = useState<{ tempUrl: string, isUploading: boolean }[]>([]); // 업로드 대기 중인 실제 파일 및 미리보기 URL
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [progressText, setProgressText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchPortfolios = async () => {
        try {
            const res = await fetch('/api/portfolio');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch portfolios:", error);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("정말로 이 시공사례를 삭제하시겠습니까?")) {
            try {
                await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
                fetchPortfolios();
            } catch (error) {
                console.error("Failed to delete portfolio:", error);
            }
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setIsUploading(true);
            const newFileObjects = files.map(file => ({
                tempUrl: URL.createObjectURL(file),
                isUploading: true
            }));

            // UI에 업로드 중인 임시 이미지 표시
            setImgFiles((prev) => [...prev, ...newFileObjects]);

            try {
                const options = {
                    maxSizeMB: 0.3,           // 최대 300KB 이하로 강제 다이어트
                    maxWidthOrHeight: 1200,   // 가로 최대 1200px
                    useWebWorker: true,       // 브라우저 멈춤 방지
                    initialQuality: 0.8       // 초기 화질을 80%로 타협하여 빠른 압축
                };

                const compressPromises = files.map(file => imageCompression(file, options));
                const compressedFiles = await Promise.all(compressPromises);

                const uploadPromises = compressedFiles.map(async (compressedFile) => {
                    const uploadForm = new FormData();
                    uploadForm.append('file', compressedFile);

                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: uploadForm
                    });

                    if (uploadRes.ok) {
                        const blobData = await uploadRes.json();
                        return blobData.url;
                    } else {
                        throw new Error('Upload to Blob failed');
                    }
                });

                const newImageUrls = await Promise.all(uploadPromises);

                // 업로드 완료 후 실제 URL을 formData에 추가
                setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));

                // 임시 이미지(업로드 중 상태) 제거
                setImgFiles(prev => prev.filter(f => !newFileObjects.includes(f)));

            } catch (error) {
                console.error("Background upload failed:", error);
                alert("이미지 업로드 중 오류가 발생했습니다.");
                // 업로드 실패 시 임시 이미지 롤백
                setImgFiles(prev => prev.filter(f => !newFileObjects.includes(f)));
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const openModal = (item?: any) => {
        if (item) {
            setEditingId(item.id);
            setFormData({
                title: item.title,
                clientName: item.clientName || '',
                area: item.area || '',
                solution: item.solution,
                date: item.date,
                img: item.imageUrl || '',
                images: item.images || []
            });
        } else {
            setEditingId(null);
            setFormData({ title: '', clientName: '', area: '', solution: '', date: '', img: '', images: [] as string[] });
        }
        setImgFiles([]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setImgFiles([]);
        setFormData({ title: '', clientName: '', area: '', solution: '', date: '', img: '', images: [] as string[] });
        setProgressText('');
    };

    const handleSave = async () => {
        setIsSaving(true);
        setProgressText('저장 준비 중...');
        let finalImages = [...formData.images]; // 기존 Vercel URL들 유지

        try {

            setProgressText('데이터베이스 등록 중...');
            const payload = {
                title: formData.title,
                clientName: formData.clientName,
                area: formData.area,
                solution: formData.solution,
                date: formData.date,
                imageUrl: finalImages.length > 0 ? finalImages[0] : "", // 첫 번째 이미지를 썸네일로 사용
                images: finalImages,
            };

            if (editingId) {
                await fetch(`/api/portfolio/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch('/api/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            fetchPortfolios();
            closeModal();
        } catch (error) {
            console.error("Failed to save portfolio:", error);
            alert("저장에 실패했습니다. 이미지가 너무 크거나 Vercel 인증 문제가 있을 수 있습니다.");
        } finally {
            setIsSaving(false);
            setProgressText('');
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
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">시공 실적 아카이브</h1>
                        <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                            완료된 <span className="text-white font-bold">전국의 시공 사례</span>들을 체계적으로 분류하고 관리합니다.
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all duration-300 shadow-[0_20px_40px_rgba(8,145,178,0.3)] flex items-center justify-center gap-3 active:scale-95 overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="tracking-tighter">새 프로젝트 등록</span>
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.03)] overflow-hidden flex-1 flex flex-col mb-20">
                <div className="overflow-hidden md:overflow-x-auto p-6 md:p-0">
                    <table className="w-full text-left border-collapse block md:table">
                        <thead className="hidden md:table-header-group bg-slate-900 border-b border-slate-800">
                            <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] block md:table-row">
                                <th className="py-5 px-6 w-16 text-center whitespace-nowrap block md:table-cell">ID</th>
                                <th className="py-5 px-6 w-32 text-center whitespace-nowrap block md:table-cell">썸네일</th>
                                <th className="py-5 px-6 w-full min-w-[300px] text-center whitespace-nowrap block md:table-cell">프로젝트명</th>
                                <th className="py-5 px-6 text-center whitespace-nowrap block md:table-cell">고객사</th>
                                <th className="py-5 px-6 w-32 text-center whitespace-nowrap block md:table-cell">시공일자</th>
                                <th className="py-5 px-6 w-32 text-center whitespace-nowrap block md:table-cell">관리</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group divide-y divide-slate-100 text-slate-700">
                            {(() => {
                                const indexOfLastItem = currentPage * itemsPerPage;
                                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                                const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
                                return currentItems.map((item) => (
                                    <tr key={item.id} className="block md:table-row hover:bg-slate-50/80 transition-all bg-transparent mb-4 md:mb-0 border border-slate-100 md:border-none rounded-2xl md:rounded-none p-4 md:p-0">
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 md:text-center font-medium text-slate-400 whitespace-nowrap border-b border-slate-100 md:border-none tabular-nums text-sm">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">ID</span>
                                            <span className="text-slate-900 md:text-slate-400 font-medium">{item.id}</span>
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">썸네일</span>
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-lg shadow-sm border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-16 h-12 md:w-20 md:h-14 bg-slate-100 flex items-center justify-center rounded-lg shadow-sm border border-slate-200 text-slate-400">
                                                    <ImageOff size={16} className="md:w-5 md:h-5" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">프로젝트명</span>
                                            <span className="text-sm md:text-base font-bold text-slate-900 truncate max-w-[200px] md:max-w-none">{item.title}</span>
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">고객사</span>
                                            <span className="text-sm font-light text-slate-600">{item.clientName || "-"}</span>
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none tabular-nums">
                                            <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">시공일자</span>
                                            <span className="text-sm font-medium text-slate-400">{item.date}</span>
                                        </td>
                                        <td className="flex justify-center md:table-cell py-4 md:py-4 px-2 md:px-6 whitespace-nowrap mt-2 md:mt-0">
                                            <div className="flex items-center justify-center gap-6 md:gap-3 text-sm font-bold w-full md:w-auto">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="text-cyan-600 hover:text-cyan-500 transition-colors cursor-pointer flex-1 md:flex-none text-center py-3 md:py-1 px-4 bg-cyan-50 md:bg-transparent rounded-xl md:rounded-none border border-cyan-100 md:border-none"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-500 hover:text-red-400 transition-colors cursor-pointer flex-1 md:flex-none text-center py-3 md:py-1 px-4 bg-red-50 md:bg-transparent rounded-xl md:rounded-none border border-red-100 md:border-none"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ));
                            })()}
                            {items.length === 0 && (
                                <tr className="block md:table-row">
                                    <td colSpan={6} className="block md:table-cell py-8 text-center text-slate-500">등록된 시공사례가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 bg-slate-50 rounded-b-2xl gap-4">
                    <span>전체 <strong>{items.length}</strong> 건의 시공사례가 있습니다.</span>
                    {items.length > itemsPerPage && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 border rounded transition-colors ${currentPage === 1 ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                            >
                                이전
                            </button>
                            {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, i) => i + 1).map(pageNumber => (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-3 py-1 border rounded font-bold cursor-pointer transition-colors ${currentPage === pageNumber ? 'border-cyan-500 bg-cyan-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(items.length / itemsPerPage), p + 1))}
                                disabled={currentPage === Math.ceil(items.length / itemsPerPage)}
                                className={`px-3 py-1 border rounded transition-colors ${currentPage === Math.ceil(items.length / itemsPerPage) ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/60 z-[999] flex justify-center items-start pt-[60px] pb-10 backdrop-blur-sm overflow-y-auto">
                    {/* Modal Container: Fixed header/footer, scrollable body */}
                    <div className="bg-white rounded-3xl w-[95%] sm:w-full max-w-xl shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative flex flex-col max-h-[calc(100dvh-100px)] sm:max-h-[85vh] overflow-hidden border border-slate-200">

                        {/* Fixed Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-2xl font-extrabold text-slate-900">
                                {editingId ? '시공사례 수정' : '새 시공사례 등록'}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-white rounded-full border border-slate-200 shadow-sm cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Scrollable Body (`overflow-y-auto`) */}
                        <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            <form id="portfolioForm" onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">프로젝트명</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-slate-400"
                                        placeholder="예: 판교 테크노밸리 스마트 사옥"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">고객사</label>
                                        <input
                                            type="text"
                                            value={formData.clientName}
                                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-slate-400"
                                            placeholder="예: 넥슨코리아"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">시공면적</label>
                                        <input
                                            type="text"
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-slate-400"
                                            placeholder="예: 450평"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">적용 솔루션</label>
                                        <input
                                            type="text"
                                            value={formData.solution}
                                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-slate-400"
                                            placeholder="예: 멀티V i 80HP"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">완공일자</label>
                                        <input
                                            type="text"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-slate-400"
                                            placeholder="예: 2024.03"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">갤러리 이미지 관리</label>
                                    
                                    {(formData.img || formData.images.length > 0 || imgFiles.length > 0) && (
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                                            <div className="flex flex-wrap gap-3">
                                                {/* Main Image */}
                                                {formData.img && (
                                                    <div className="relative flex-shrink-0 group">
                                                        <img src={formData.img} alt="메인 이미지" className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm" />
                                                        <div className="absolute top-0 left-0 bg-cyan-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br-lg rounded-tl-lg">메인</div>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, img: '' })}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Sub Images (Database) */}
                                                {formData.images.map((imgUrl: string, idx: number) => (
                                                    <div key={`db-${idx}`} className="relative flex-shrink-0 group">
                                                        <img src={imgUrl} alt={`시공 사진 ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm" />
                                                        <button 
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_: string, i: number) => i !== idx) })}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Temp Images (Uploading) */}
                                                {imgFiles.map((fileObj, idx) => (
                                                    <div key={`new-${idx}`} className="relative flex-shrink-0 opacity-50">
                                                        <img src={fileObj.tempUrl} alt={`업로드 중 ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border-2 border-dashed border-cyan-200 shadow-sm" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-5 h-5 border-2 border-t-cyan-500 border-cyan-100 rounded-full animate-spin"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-3 text-xs font-bold text-cyan-600 border border-cyan-100 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-all cursor-pointer flex-1 flex items-center justify-center gap-2"
                                        >
                                            <Plus size={14} /> 다중 이미지 추가
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => { if(confirm("전체 삭제하시겠습니까?")) { setFormData({ ...formData, img: '', images: [] }); setImgFiles([]); } }}
                                            className="px-4 py-3 text-xs font-bold text-slate-400 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                                        >
                                            전체 비우기
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden cursor-pointer"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Fixed Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3 flex-shrink-0">
                            <button
                                type="submit"
                                form="portfolioForm"
                                disabled={isSaving || isUploading}
                                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 order-1 sm:order-2 active:scale-95"
                            >
                                {isSaving ? (progressText || '저장 중...') : isUploading ? '이미지 업로드 중...' : '저장하기'}
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isSaving}
                                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed order-2 sm:order-1 active:scale-95 border border-slate-200"
                            >
                                취소
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
