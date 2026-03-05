"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

export default function AdminProductsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', category: '상업용', features: '', description: '', isVisible: true, img: '', specs: [] as { key: string, value: string }[] });
    const [imgFile, setImgFile] = useState<File | null>(null); // 새로 추가된 파일 상태
    const [isSaving, setIsSaving] = useState(false); // 저장 진행 상태
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("정말로 이 제품을 삭제하시겠습니까?")) {
            try {
                await fetch(`/api/products/${id}`, { method: 'DELETE' });
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImgFile(file); // 실제 File 객체 보관 (DB 대신 Blob에 업로드할 용도)
            setFormData({ ...formData, img: URL.createObjectURL(file) }); // 미리보기용 임시 브라우저 URL
        }
    };

    const openModal = (item?: any) => {
        if (item) {
            setEditingId(item.id);
            setFormData({ title: item.name, category: item.category, features: item.features || '', description: item.description || '', isVisible: item.isVisible, img: item.imageUrl || '', specs: item.specs || [] });
        } else {
            setEditingId(null);
            setFormData({ title: '', category: '상업용', features: '', description: '', isVisible: true, img: '', specs: [] });
        }
        setImgFile(null); // 모달 열 때 파일 상태 초기화
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setImgFile(null);
        setFormData({ title: '', category: '상업용', features: '', description: '', isVisible: true, img: '', specs: [] });
    };

    const handleSave = async () => {
        setIsSaving(true);
        let finalImageUrl = formData.img; // 명시적으로 삭제했거나, 기존 Vercel URL이면 이 값을 유지

        try {
            // 새 파일이 선택되었을 경우에만 Blob 서버에 먼저 전송 (Base64 하드코딩 완전 금지)
            if (imgFile) {
                const uploadForm = new FormData();
                uploadForm.append('file', imgFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadForm
                });

                if (uploadRes.ok) {
                    const blobData = await uploadRes.json();
                    finalImageUrl = blobData.url; // Blob에서 발급된 짧은 인터넷 주소(.vercel-storage.com)
                } else {
                    console.error("Vercel Blob Upload failed");
                    alert("이미지 업로드에 실패했습니다. (Vercel 환경 변수 세팅 확인)");
                    setIsSaving(false);
                    return;
                }
            }

            const payload = {
                name: formData.title,
                category: formData.category,
                features: formData.features,
                description: formData.description,
                isVisible: formData.isVisible,
                imageUrl: finalImageUrl,
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
        const item = items.find(i => i.id === id);
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
        <div className="max-w-7xl mx-auto space-y-8 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">제품 관리</h1>
                    <p className="text-slate-500 mt-2 text-sm">프론트엔드 제품 목록에 노출되는 제품들을 관리합니다.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 text-sm cursor-pointer"
                >
                    [+ 새 제품 등록]
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="py-4 px-6 w-16 text-center whitespace-nowrap">ID</th>
                                <th className="py-4 px-6 w-32 whitespace-nowrap">썸네일</th>
                                <th className="py-4 px-6 w-32 whitespace-nowrap">카테고리</th>
                                <th className="py-4 px-6 w-full min-w-[300px] whitespace-nowrap">제품명</th>
                                <th className="py-4 px-6 w-32 text-center whitespace-nowrap">노출 상태</th>
                                <th className="py-4 px-6 w-32 text-center whitespace-nowrap">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {(() => {
                                const indexOfLastItem = currentPage * itemsPerPage;
                                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                                const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
                                return currentItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4 px-6 text-center font-medium text-slate-900 whitespace-nowrap">{item.id}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-20 h-14 object-cover rounded-lg shadow-sm border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-20 h-14 bg-gray-800 flex items-center justify-center rounded-lg shadow-sm border border-slate-200 text-gray-500">
                                                    <ImageOff size={20} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">{item.name}</td>
                                        <td className="py-4 px-6 text-sm text-cyan-600 font-semibold whitespace-nowrap">{item.category}</td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => toggleVisibility(item.id)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${item.isVisible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                            >
                                                {item.isVisible ? '노출 ON' : '숨김 OFF'}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-3 text-sm font-semibold">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ));
                            })()}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">등록된 제품이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 bg-slate-50 rounded-b-2xl gap-4">
                    <span>전체 <strong>{items.length}</strong> 건의 제품이 있습니다.</span>
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
                                {editingId ? '제품 수정' : '새 제품 등록'}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Scrollable Body (`overflow-y-auto`) */}
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
                                        placeholder="예: 강력한 냉난방, 쾌적한 실내 환경 조성"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">제품 상세 설명</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={5}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                        placeholder="제품에 대한 상세한 설명을 적어주세요. 줄바꿈을 지원합니다."
                                    />
                                </div>

                                {/* Dynamic Specs Section */}
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
                                                    placeholder="항목명 (예: 냉방능력)"
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
                                                    placeholder="내용 (예: 14.5 kW)"
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
                                        {formData.specs.length === 0 && (
                                            <p className="text-sm text-slate-400 py-2 text-center bg-white border border-dashed border-slate-300 rounded-lg">
                                                등록된 스펙이 없습니다. [+ 스펙 항목 추가] 버튼을 눌러 스펙을 추가하세요.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-4">
                                    <label className="block text-sm font-bold text-slate-700">노출 상태:</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.isVisible}
                                            onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                        <span className="ml-3 text-sm font-medium text-slate-900">{formData.isVisible ? '노출됨' : '숨김'}</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">이미지 관리</label>

                                    {formData.img && (
                                        <div className="mb-4">
                                            <div className="text-xs text-slate-500 mb-1">현재 이미지 미리보기</div>
                                            <img
                                                src={formData.img}
                                                alt="미리보기"
                                                className="w-32 h-32 object-cover rounded-lg border border-slate-200 shadow-sm"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 text-sm font-bold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                        >
                                            이미지 추가
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => { setFormData({ ...formData, img: '' }); setImgFile(null); }}
                                            className="px-4 py-2 text-sm font-bold text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            이미지 삭제
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
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
                                form="productForm"
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-lg font-bold bg-cyan-600 text-white hover:bg-cyan-700 transition-colors shadow-md cursor-pointer disabled:bg-slate-400"
                            >
                                {isSaving ? "저장 중..." : "저장"}
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
