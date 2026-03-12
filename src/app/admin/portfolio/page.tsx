"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';
import imageCompression from 'browser-image-compression';

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
        <div className="max-w-7xl mx-auto space-y-8 relative mt-6 md:mt-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">시공사례 관리</h1>
                    <p className="text-slate-500 mt-2 text-sm">프론트엔드 시공사례 페이지에 노출되는 프로젝트를 관리합니다.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 text-sm cursor-pointer"
                >
                    [+ 새 시공사례 등록]
                </button>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-hidden md:overflow-x-auto p-4 md:p-0">
                    <table className="w-full text-left border-collapse block md:table">
                        <thead className="hidden md:table-header-group bg-slate-50 border-b border-slate-200">
                            <tr className="text-slate-500 text-sm font-semibold uppercase tracking-wider block md:table-row">
                                <th className="py-4 px-6 w-16 text-center whitespace-nowrap block md:table-cell">ID</th>
                                <th className="py-4 px-6 w-32 whitespace-nowrap block md:table-cell">썸네일</th>
                                <th className="py-4 px-6 w-full min-w-[300px] whitespace-nowrap block md:table-cell">프로젝트명</th>
                                <th className="py-4 px-6 whitespace-nowrap block md:table-cell">적용 솔루션</th>
                                <th className="py-4 px-6 w-32 whitespace-nowrap block md:table-cell">시공일자</th>
                                <th className="py-4 px-6 w-32 text-center whitespace-nowrap block md:table-cell">관리</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group divide-y divide-slate-100 text-slate-700">
                            {(() => {
                                const indexOfLastItem = currentPage * itemsPerPage;
                                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                                const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
                                return currentItems.map((item) => (
                                    <tr key={item.id} className="block md:table-row hover:bg-slate-50 transition-colors group bg-white mb-4 md:mb-0 border border-slate-200 md:border-none rounded-xl md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none">
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 md:text-center font-medium text-slate-900 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">ID</span>
                                            {item.id}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">썸네일</span>
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-lg shadow-sm border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-16 h-12 md:w-20 md:h-14 bg-gray-800 flex items-center justify-center rounded-lg shadow-sm border border-slate-200 text-gray-500">
                                                    <ImageOff size={16} className="md:w-5 md:h-5" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">프로젝트명</span>
                                            <span className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-none">{item.title}</span>
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">적용 솔루션</span>
                                            <span className="text-sm">{item.solution}</span>
                                        </td>
                                        <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-xs uppercase">시공일자</span>
                                            <span className="text-sm font-medium text-slate-500">{item.date}</span>
                                        </td>
                                        <td className="flex justify-center md:table-cell py-4 md:py-4 px-2 md:px-6 whitespace-nowrap mt-2 md:mt-0">
                                            <div className="flex items-center justify-center gap-6 md:gap-3 text-sm font-bold w-full md:w-auto">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex-1 md:flex-none text-center py-2 md:py-0 bg-blue-50 md:bg-transparent rounded-lg md:rounded-none"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors cursor-pointer flex-1 md:flex-none text-center py-2 md:py-0 bg-red-50 md:bg-transparent rounded-lg md:rounded-none"
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
                <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 bg-slate-50 rounded-b-2xl gap-4">
                    <span>전체 <strong>{items.length}</strong> 건의 시공사례가 있습니다.</span>
                    {items.length > itemsPerPage && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 border rounded ${currentPage === 1 ? 'border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
                            >
                                이전
                            </button>
                            {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, i) => i + 1).map(pageNumber => (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-3 py-1 border rounded font-bold cursor-pointer ${currentPage === pageNumber ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(items.length / itemsPerPage), p + 1))}
                                disabled={currentPage === Math.ceil(items.length / itemsPerPage)}
                                className={`px-3 py-1 border rounded ${currentPage === Math.ceil(items.length / itemsPerPage) ? 'border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Popup */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    {/* Modal Container: Max width 600px (max-w-xl), Max height 85vh to fit within browser */}
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden">

                        {/* Sticky Header */}
                        <div className="p-6 border-b border-slate-200 bg-white sticky top-0 z-10 flex justify-between items-center">
                            <h2 className="text-2xl font-extrabold text-slate-900">
                                {editingId ? '시공사례 수정' : '새 시공사례 등록'}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Scrollable Body (`overflow-y-auto`) */}
                        <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                            <form id="portfolioForm" onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">프로젝트명</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                        placeholder="예: 판교 테크노밸리 스마트 사옥"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">고객사</label>
                                        <input
                                            type="text"
                                            value={formData.clientName}
                                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                            placeholder="예: 넥슨코리아"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">시공면적</label>
                                        <input
                                            type="text"
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                            placeholder="예: 3,500㎡"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">상세 내용</label>
                                    <input
                                        type="text"
                                        value={formData.solution}
                                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                        placeholder="예: LG 멀티V / 4Way"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">시공일자</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">다중 이미지 갤러리 관리</label>

                                    {(formData.images.length > 0 || imgFiles.length > 0) && (
                                        <div className="mb-4">
                                            <div className="text-xs text-slate-500 mb-2">현재 이미지 미리보기 (기존: {formData.images.length} / 신규 추가: {imgFiles.length})</div>
                                            <div className="flex gap-3 overflow-x-auto pb-2">
                                                {/* 기존 서버에 등록된 URL 이미지들 */}
                                                {formData.images.map((imgSrc, idx) => (
                                                    <div key={`old-${idx}`} className="relative flex-shrink-0">
                                                        <img src={imgSrc} alt={`기존 ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border border-slate-200 shadow-sm" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow hover:bg-red-600 transition-colors"
                                                        >✕</button>
                                                    </div>
                                                ))}
                                                {/* 방금 클라이언트에서 선택하여 백그라운드 업로드 중인 이미지들 (시각적 피드백) */}
                                                {imgFiles.map((fileObj, idx) => (
                                                    <div key={`new-${idx}`} className="relative flex-shrink-0 opacity-50">
                                                        <img src={fileObj.tempUrl} alt={`업로드 중 ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border-2 border-dashed border-cyan-400 shadow-sm" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-6 h-6 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 text-sm font-bold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                        >
                                            다중 이미지 추가
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => { setFormData({ ...formData, img: '', images: [] }); setImgFiles([]); }}
                                            className="px-4 py-2 text-sm font-bold text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            전체 삭제
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

                        {/* Sticky Footer */}
                        <div className="p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0 z-10 flex items-center justify-end gap-3">
                                <button
                                    type="submit"
                                    form="portfolioForm"
                                    disabled={isSaving || isUploading}
                                    className="px-6 py-2.5 rounded-lg font-bold bg-cyan-600 text-white hover:bg-cyan-700 transition-colors shadow-md cursor-pointer disabled:bg-slate-400"
                                >
                                    {isSaving ? (progressText || '저장 중...') : isUploading ? '이미지 업로드 중...' : '저장'}
                                </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-lg font-bold bg-slate-600 text-white hover:bg-slate-700 transition-colors cursor-pointer shadow-sm disabled:cursor-not-allowed"
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
