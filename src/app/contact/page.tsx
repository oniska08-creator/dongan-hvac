"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', phone: '', area: '', content: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    contact: formData.phone,
                    area: formData.area,
                    content: formData.content
                })
            });

            if (res.ok) {
                alert("성공적으로 문의가 접수되었습니다. 전문가가 곧 연락드리겠습니다.");
                setFormData({ name: '', phone: '', area: '', content: '' });
            } else {
                alert("문의 접수 중 오류가 발생했습니다. 다시 시도해 주세요.");
            }
        } catch (error) {
            console.error("Failed to submit inquiry:", error);
            alert("서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
    };
    const faqs = [
        { q: "현장 방문 견적은 무료인가요?", a: "네, DongAn HVAC의 모든 초기 현장 실사 및 맞춤형 견적 산출은 100% 무료로 진행됩니다." },
        { q: "시공 후 A/S 및 유지보수 기간은 어떻게 되나요?", a: "기본 무상 A/S 기간은 2년이며, 이후에는 정기 유지보수 안심케어 계약을 통해 평생 관리해 드립니다." },
        { q: "타사 제품이 설치된 현장도 유지보수가 가능한가요?", a: "물론입니다. 저희 엔지니어들은 LG 시스템 에어컨 외에도 모든 주요 브랜드의 공조 설비 점검 및 수리 역량을 보유하고 있습니다." },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* Header is handled globally in layout.tsx via ClientHeader */}

            {/* 2. Sub-Hero Section */}
            <section className="relative w-full flex flex-col items-center justify-center pt-24 md:pt-32 pb-4 md:pb-6">
                <div className="relative z-20 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl"
                    >
                        고객지원 및 문의
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg text-slate-400 font-light max-w-2xl mx-auto break-keep"
                    >
                        전문가의 맞춤 컨설팅을 지금 시작하세요.
                    </motion.p>
                </div>
            </section>

            <main className="py-6 md:py-12 px-6 max-w-7xl mx-auto space-y-6 md:space-y-10">
                {/* 3. Content 1 (연락처 카드) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-800 transition-colors"
                    >
                        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6">
                            <Phone size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">고객센터</h3>
                        <p className="text-slate-400 text-sm mb-4">평일 09:00 - 18:00 (주말 휴무)</p>
                        <p className="text-2xl font-extrabold text-white tracking-tight">02-123-4567</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-800 transition-colors"
                    >
                        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">이메일 문의</h3>
                        <p className="text-slate-400 text-sm mb-4">도면 및 상세 요구사항 전송</p>
                        <p className="text-lg font-bold text-white tracking-tight">contact@dongan-hvac.com</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-800 transition-colors"
                    >
                        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">본사 위치</h3>
                        <p className="text-slate-400 text-sm mb-4">방문 상담 예약 필수</p>
                        <p className="text-[15px] font-bold text-white break-keep tracking-tight text-slate-300">서울특별시 영등포구 여의대로 123, 공조타워 15층</p>
                    </motion.div>
                </div>

                {/* 4. Content 2 (문의 폼 & FAQ) */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-16">
                    {/* Form (6) */}
                    <div className="lg:col-span-6 bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                        <h3 className="text-2xl font-bold text-white mb-8">프로젝트 문의 접수</h3>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">담당자 성함 / 직급</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                                        placeholder="홍길동 대리"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">연락처</label>
                                    <input
                                        type="tel"
                                        required
                                        maxLength={13}
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            let formatted = val;
                                            if (val.length < 4) {
                                                formatted = val;
                                            } else if (val.length < 8) {
                                                formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
                                            } else {
                                                formatted = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 11)}`;
                                            }
                                            setFormData({ ...formData, phone: formatted });
                                        }}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">현장 평수 / 지역</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="예: 서울 강남구 / 상업용 40평"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">현장 상황 및 건의사항</label>
                                <textarea
                                    rows={5}
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="건물 면적, 용도, 적용 희망 기기 등을 시공 희망 일자와 함께 남겨주시면 더욱 정확한 상담이 가능합니다."
                                />
                            </div>
                            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 rounded-lg transition-colors duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                무료 견적 요청 보내기
                            </button>
                        </form>
                    </div>

                    {/* FAQ (4) */}
                    <div className="lg:col-span-4">
                        <h3 className="text-2xl font-bold text-white mb-8">자주 묻는 질문 (FAQ)</h3>
                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="border-b border-slate-700 pb-6">
                                    <h4 className="text-lg font-bold text-white mb-3 flex items-start">
                                        <span className="text-cyan-400 mr-2 shrink-0">Q.</span>
                                        <span className="break-keep">{faq.q}</span>
                                    </h4>
                                    <p className="text-slate-400 font-light flex items-start break-keep">
                                        <span className="text-slate-500 font-bold mr-2 shrink-0">A.</span>
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-800">
                            <p className="text-slate-400 text-sm break-keep">
                                여기에 해결되지 않은 질문이 있으시다면 언제든 좌측의 폼이나 상단 이메일을 통해 문의해 주세요.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
