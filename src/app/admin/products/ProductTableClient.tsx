"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ImageOff, Plus } from 'lucide-react';
import imageCompression from 'browser-image-compression';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductTableClient() {
    const { data: items = [], mutate, isLoading } = useSWR('/api/products/lite', fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', category: '상업용', features: '', description: '', isVisible: true, img: '', images: [] as string[], specs: [] as { key: string, value: string }[] });
    const [imgFiles, setImgFiles] = useState<{ tempUrl: string, isUploading: boolean }[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const fetchProducts = async () => {
        mutate();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("정말로 이 제품을 삭제하시겠습니까? (이 동작은 되돌릴 수 없습니다)")) {
            try {
                await fetch(`/api/products/${id}`, { method: 'DELETE' });
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
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

    const openModal = async (item?: any) => {
        if (item) {
            setIsSaving(true);
            try {
                // 제품 클릭 시 상세 정보(description, specs 등 무거운 데이터) 단건 조회하여 로드
                const res = await fetch(`/api/products/${item.id}`);
                const detailData = await res.json();

                setEditingId(detailData.id);
                setFormData({
                    title: detailData.name,
                    category: detailData.category,
                    features: detailData.features || '',
                    description: detailData.description || '',
                    isVisible: detailData.isVisible,
                    img: detailData.imageUrl || '',
                    images: detailData.images || [],
                    specs: detailData.specs || []
                });
            } catch (error) {
                console.error("Failed to load product details", error);
            } finally {
                setIsSaving(false);
            }
        } else {
            setEditingId(null);
            setFormData({ title: '', category: '상업용', features: '', description: '', isVisible: true, img: '', images: [], specs: [] });
        }
        setImgFiles([]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setImgFiles([]);
        setFormData({ title: '', category: '상업용', features: '', description: '', isVisible: true, img: '', images: [], specs: [] });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const finalImageUrl = formData.images.length > 0 ? formData.images[0] : "";

        try {
            const payload = {
                name: formData.title,
                category: formData.category,
                features: formData.features,
                description: formData.description,
                isVisible: formData.isVisible,
                imageUrl: finalImageUrl,
                images: formData.images,
                specs: formData.specs
            };

            if (editingId) {
                await fetch(`/api/products/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            fetchProducts();
            closeModal();
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleVisibility = async (id: number) => {
        const item = items.find((i: any) => i.id === id);
        if (!item) return;
        try {
            await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVisible: !item.isVisible })
            });
            fetchProducts();
        } catch (error) {
            console.error("Failed to toggle visibility:", error);
        }
    };

    return (
        <>
            {/* Premium Header Container */}
            <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-8 md:p-10 mb-10 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">제품군 통합 관리</h1>
                        <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                            프론트엔드 제품 목록에 노출되는 <span className="text-white font-bold">에어컨 및 공조 시스템</span> 데이터를 정밀 제어합니다.
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all duration-300 shadow-[0_20px_40px_rgba(8,145,178,0.3)] flex items-center justify-center gap-3 active:scale-95 overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="tracking-tighter">새로운 상품 등록</span>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex-1 flex flex-col animate-pulse mt-4">
                    <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-4">
                        <div className="h-4 bg-slate-100 rounded w-12"></div>
                        <div className="h-4 bg-slate-100 rounded w-24"></div>
                        <div className="h-4 bg-slate-100 rounded flex-1 mx-8 max-w-[300px]"></div>
                        <div className="h-4 bg-slate-100 rounded w-20"></div>
                    </div>
                    <div className="divide-y divide-slate-100 flex-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center px-6 py-4 gap-4">
                                <div className="h-4 bg-slate-100 rounded w-8 mx-2"></div>
                                <div className="h-14 w-20 bg-slate-100 rounded-lg"></div>
                                <div className="flex-1 space-y-2 mx-8">
                                    <div className="h-5 bg-slate-100 rounded w-1/2 max-w-[400px]"></div>
                                </div>
                                <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.03)] overflow-hidden flex-1 flex flex-col mb-20 transition-all duration-700">
                <div className="overflow-hidden md:overflow-x-auto p-6 md:p-0">
                    <table className="w-full text-left border-collapse block md:table">
                            <thead className="hidden md:table-header-group bg-slate-900 border-b border-slate-800">
                                <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] block md:table-row">
                                    <th className="py-5 px-6 w-16 text-center whitespace-nowrap block md:table-cell">ID</th>
                                    <th className="py-5 px-6 w-32 text-center whitespace-nowrap block md:table-cell">썸네일</th>
                                    <th className="py-5 px-6 w-32 text-center whitespace-nowrap block md:table-cell">카테고리</th>
                                    <th className="py-5 px-6 w-full min-w-[300px] text-center whitespace-nowrap block md:table-cell">제품명</th>
                                    <th className="py-5 px-6 w-32 text-center whitespace-nowrap block md:table-cell">노출 상태</th>
                                    <th className="py-5 px-6 w-38 text-center whitespace-nowrap block md:table-cell">관리</th>
                                </tr>
                            </thead>
                            <tbody className="block md:table-row-group divide-y divide-slate-100 text-slate-700">
                                {(() => {
                                    const indexOfLastItem = currentPage * itemsPerPage;
                                    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                                    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
                                    return currentItems.map((item: any) => (
                                        <tr key={item.id} className="block md:table-row hover:bg-slate-50/80 transition-all group bg-transparent mb-4 md:mb-0 border border-slate-100 md:border-none rounded-2xl md:rounded-none p-4 md:p-0">
                                            <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 md:text-center font-medium text-slate-400 whitespace-nowrap border-b border-slate-100 md:border-none tabular-nums text-sm">
                                                <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">제품 ID</span>
                                                <span className="md:font-medium text-slate-900 md:text-slate-400">{item.id}</span>
                                            </td>
                                            <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                                <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">썸네일</span>
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-lg shadow-sm border border-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-12 md:w-20 md:h-14 bg-slate-800 flex items-center justify-center rounded-lg shadow-sm border border-slate-700 text-slate-500">
                                                        <ImageOff size={16} className="md:w-5 md:h-5" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="flex justify-between items-center md:table-cell md:text-center py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                                <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">분류</span>
                                                <span className="text-sm text-cyan-600 font-bold">{item.category}</span>
                                            </td>
                                            <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 whitespace-nowrap border-b border-slate-100 md:border-none">
                                                <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">상품명</span>
                                                <span className="text-sm md:text-base font-bold text-slate-900 truncate max-w-[200px] md:max-w-none">{item.name}</span>
                                            </td>
                                            <td className="flex justify-between items-center md:table-cell py-3 md:py-4 px-2 md:px-6 md:text-center whitespace-nowrap border-b border-slate-100 md:border-none">
                                                <span className="md:hidden font-bold text-slate-500 text-[13px] uppercase tracking-tighter">전시</span>
                                                <button
                                                    onClick={() => toggleVisibility(item.id)}
                                                    className={`px-3 py-1 rounded-full text-[12px] font-extrabold transition-all cursor-pointer border ${item.isVisible ? 'bg-cyan-50 text-cyan-600 border-cyan-200 hover:bg-cyan-100' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'}`}
                                                >
                                                    {item.isVisible ? '노출 ON' : '숨김 OFF'}
                                                </button>
                                            </td>
                                            <td className="flex justify-center md:table-cell py-5 md:py-4 px-2 md:px-6 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-4 md:gap-3 text-sm font-bold w-full md:w-auto">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="text-cyan-600 hover:text-cyan-500 transition-colors cursor-pointer flex-1 md:flex-none text-center py-3 md:py-1 px-4 bg-cyan-50 md:bg-transparent rounded-xl md:rounded-none border border-cyan-100 md:border-none shadow-sm md:shadow-none"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-500 hover:text-red-400 transition-colors cursor-pointer flex-1 md:flex-none text-center py-3 md:py-1 px-4 bg-red-50 md:bg-transparent rounded-xl md:rounded-none border border-red-100 md:border-none shadow-sm md:shadow-none"
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
                                        <td colSpan={6} className="block md:table-cell py-8 text-center text-slate-500">등록된 제품이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 bg-slate-50 rounded-b-2xl gap-4">
                        <span>전체 <strong>{items.length}</strong> 건의 데이터 중 최대 20건이 표기됩니다.</span>
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
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/60 z-[999] flex justify-center items-start pt-[60px] pb-10 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-[95%] sm:w-full max-w-xl shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative flex flex-col max-h-[calc(100dvh-100px)] sm:max-h-[85vh] overflow-hidden border border-slate-200">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-2xl font-extrabold text-slate-900">
                                {editingId ? '제품 수정' : '새 제품 등록'}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-white rounded-full border border-slate-200 shadow-sm cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                            <form id="productForm" onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">제품명</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                        placeholder="예: 휘센 상업용 스탠드 에어컨"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">카테고리</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-white"
                                    >
                                        <option value="상업용">상업용 (멀티V, 시스템 등)</option>
                                        <option value="가정용">가정용 (아파트 시스템 등)</option>
                                        <option value="환기">환기 (전열교환기 등)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">핵심 특장점 (한 줄 설명)</label>
                                    <input
                                        type="text"
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">제품 상세 설명</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={5}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-bold text-slate-700">상세 스펙 입력</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, specs: [...formData.specs, { key: '', value: '' }] })}
                                            className="text-sm text-cyan-600 hover:text-cyan-800 font-bold bg-cyan-50 hover:bg-cyan-100 transition-colors px-3 py-1.5 rounded-lg border border-cyan-200"
                                        >
                                            [+ 스펙 항목 추가]
                                        </button>
                                    </div>
                                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        {formData.specs.map((spec, index) => (
                                            <div key={index} className="flex gap-3 items-center">
                                                <input
                                                    type="text"
                                                    value={spec.key}
                                                    onChange={(e) => {
                                                        const newSpecs = [...formData.specs];
                                                        newSpecs[index].key = e.target.value;
                                                        setFormData({ ...formData, specs: newSpecs });
                                                    }}
                                                    placeholder="항목명"
                                                    className="w-1/3 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                />
                                                <input
                                                    type="text"
                                                    value={spec.value}
                                                    onChange={(e) => {
                                                        const newSpecs = [...formData.specs];
                                                        newSpecs[index].value = e.target.value;
                                                        setFormData({ ...formData, specs: newSpecs });
                                                    }}
                                                    placeholder="내용"
                                                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newSpecs = formData.specs.filter((_, i) => i !== index);
                                                        setFormData({ ...formData, specs: newSpecs });
                                                    }}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-8 px-1 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <label className="block text-sm font-bold text-slate-700 ml-4">상점 노출 설정:</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.isVisible}
                                            onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 border border-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 shadow-inner"></div>
                                        <span className="ml-3 text-sm font-bold text-slate-600">{formData.isVisible ? '현재 노출 중' : '현재 숨김 상태'}</span>
                                    </label>
                                </div>
                                <div className="mt-8 pb-10">
                                    <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">제품 구색 이미지 관리</label>
                                    
                                    {(formData.images.length > 0 || imgFiles.length > 0) && (
                                        <div className="mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner">
                                            <div className="text-[10px] text-slate-400 mb-3 font-bold uppercase tracking-widest">현재 이미지 미리보기 (기존: {formData.images.length} / 신규: {imgFiles.length})</div>
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                                                {/* 기존 서버에 등록된 URL 이미지들 */}
                                                {formData.images.map((imgSrc, idx) => (
                                                    <div key={`old-${idx}`} className="relative flex-shrink-0 group/img">
                                                        <img src={imgSrc} alt={`기존 ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm transition-transform group-hover/img:scale-105" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover/img:opacity-100"
                                                        >✕</button>
                                                    </div>
                                                ))}
                                                {/* 방금 클라이언트에서 선택하여 백그라운드 업로드 중인 이미지들 (시각적 피드백) */}
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
                                            className="px-4 py-3 text-xs font-bold text-cyan-600 border border-cyan-100 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-all cursor-pointer flex-1 flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Plus size={14} /> 제품 이미지 대량 등록
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { if(confirm("전체 삭제하시겠습니까?")) { setFormData({ ...formData, img: '', images: [] }); setImgFiles([]); } }}
                                            className="px-4 py-3 text-xs font-bold text-slate-400 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                                        >
                                            전체 비우기
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3 flex-shrink-0">
                            <button
                                type="submit"
                                form="productForm"
                                disabled={isSaving || isUploading}
                                className="w-full sm:w-auto px-10 py-3.5 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 order-1 sm:order-2 active:scale-95"
                            >
                                {isSaving ? "저장 중..." : isUploading ? "이미지 업로드 중..." : "최종 저장하기"}
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isSaving}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed order-2 sm:order-1 active:scale-95 border border-slate-200"
                            >
                                취소
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
