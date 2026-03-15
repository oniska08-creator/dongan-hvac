"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Image as ImageIcon, History as HistoryIcon, Building2 } from 'lucide-react';

export default function AdminCompanyPage() {
    const [companyInfo, setCompanyInfo] = useState({
        title: '',
        subTitle: '',
        contentTitle: '',
        content1: '',
        content2: '',
        imageUrl: ''
    });
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/company');
            if (res.ok) {
                const data = await res.json();
                setCompanyInfo(data.companyInfo);
                setHistory(data.history);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const blob = await res.json();
                setCompanyInfo({ ...companyInfo, imageUrl: blob.url });
            } else {
                alert('이미지 업로드에 실패했습니다.');
            }
        } catch (error) {
            alert('업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/company', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyInfo, history })
            });
            if (res.ok) {
                alert('저장이 완료되었습니다.');
            }
        } catch (error) {
            alert('업데이트 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const addHistory = () => {
        setHistory([{ year: '', title: '', desc: '' }, ...history]);
    };

    const removeHistory = (index: number) => {
        setHistory(history.filter((_, i) => i !== index));
    };

    const updateHistory = (index: number, field: string, value: string) => {
        const newHistory = [...history];
        newHistory[index][field] = value;
        setHistory(newHistory);
    };

    if (isLoading) return <div className="p-10 text-slate-500 font-bold animate-pulse text-center">데이터 로드 중...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-10 mt-6 md:mt-8 px-4 md:px-0 pb-32 relative">
            {/* Header */}
            <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-8 md:p-10 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">회사정보 관리</h1>
                        <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed mt-2">
                            홈페이지의 <span className="text-cyan-400 font-bold">회사 소개 및 연혁</span> 정보를 실시간으로 수정하고 관리합니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Basic Info Section */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col">
                        <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Building2 className="text-cyan-600" />
                            기본 텍스트 관리
                        </h2>
                        
                        <div className="space-y-6 flex-1">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">상단 타이틀</label>
                                <input
                                    type="text"
                                    value={companyInfo.title}
                                    onChange={(e) => setCompanyInfo({ ...companyInfo, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-cyan-500 transition-all font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">상단 서브 타이틀</label>
                                <textarea
                                    value={companyInfo.subTitle}
                                    onChange={(e) => setCompanyInfo({ ...companyInfo, subTitle: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-cyan-500 transition-all font-bold h-24 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">본문 강조 타이틀</label>
                                <input
                                    type="text"
                                    value={companyInfo.contentTitle}
                                    onChange={(e) => setCompanyInfo({ ...companyInfo, contentTitle: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-cyan-500 transition-all font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">본문 설명 1</label>
                                <textarea
                                    value={companyInfo.content1}
                                    onChange={(e) => setCompanyInfo({ ...companyInfo, content1: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-cyan-500 transition-all font-bold h-32 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">본문 설명 2</label>
                                <textarea
                                    value={companyInfo.content2}
                                    onChange={(e) => setCompanyInfo({ ...companyInfo, content2: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-cyan-500 transition-all font-bold h-32 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <ImageIcon className="text-cyan-600" />
                            메인 이미지 관리
                        </h2>
                        <div className="space-y-6">
                            <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative group">
                                {companyInfo.imageUrl ? (
                                    <img src={companyInfo.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <ImageIcon size={48} />
                                        <span className="font-bold">이미지 없음</span>
                                    </div>
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                                        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">이미지 경로 및 업로드</label>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={companyInfo.imageUrl}
                                        onChange={(e) => setCompanyInfo({ ...companyInfo, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-cyan-500 transition-all font-bold text-sm"
                                    />
                                    <label className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-950 text-white rounded-2xl font-black text-sm cursor-pointer hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap">
                                        <ImageIcon size={18} />
                                        파일 선택
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <HistoryIcon className="text-cyan-600" />
                            연혁 관리
                        </h2>
                        <button
                            onClick={addHistory}
                            className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl hover:bg-cyan-600 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        {history.length === 0 && (
                            <div className="py-20 text-center text-slate-400 font-medium">
                                등록된 연혁이 없습니다. 우측 상단 + 버튼을 눌러 추가하세요.
                            </div>
                        )}
                        {history.map((item, idx) => (
                            <motion.div
                                key={idx}
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group"
                            >
                                <button
                                    onClick={() => removeHistory(idx)}
                                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer shadow-sm border border-slate-100 bg-white"
                                    title="연혁 삭제"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">연도</label>
                                        <input
                                            type="text"
                                            value={item.year}
                                            onChange={(e) => updateHistory(idx, 'year', e.target.value)}
                                            placeholder="2024"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-cyan-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-3">
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">내용 타이틀</label>
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => updateHistory(idx, 'title', e.target.value)}
                                            placeholder="전략적 파트너쉽 체결"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-cyan-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-4">
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">상세 설명</label>
                                        <textarea
                                            value={item.desc}
                                            onChange={(e) => updateHistory(idx, 'desc', e.target.value)}
                                            placeholder="상세 내용을 입력하세요."
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-cyan-500 outline-none h-24 resize-none transition-all"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-md border-t border-slate-100 py-6 px-10 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
            >
                <div className="max-w-7xl mx-auto flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="group relative px-10 py-4 bg-cyan-600 text-white rounded-2xl font-black transition-all duration-300 shadow-[0_20px_40px_rgba(8,145,178,0.2)] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 cursor-pointer overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={20} className="group-hover:scale-110 transition-transform" />
                        )}
                        <span className="tracking-tight">{isSaving ? '정보 저장 중...' : '변경사항 저장하기'}</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
