"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Megaphone, Download, HelpCircle, FileDown, Search, Mail } from "lucide-react";

// Shadcn UI 컴포넌트 임포트 (기존에 설치된 것들 재활용)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const supportTabs = [
    { id: "notice", name: "공지사항", icon: Megaphone },
    { id: "download", name: "자료실", icon: Download },
    { id: "faq", name: "묻고 답하기 (FAQ)", icon: HelpCircle },
    { id: "inquiry", name: "온라인 문의", icon: Mail },
];

export default function SupportPage() {
    const params = useParams();
    const activeCategory = (params.category as string) || "notice";

    // 탭 부드러운 스크롤 (사업영역, 제품소개와 동일)
    const handleTabClick = () => {
        setTimeout(() => {
            const anchor = document.getElementById("tab-anchor");
            if (anchor) {
                const y = anchor.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }, 10);
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32">

            {/* 1. Hero 상단 영역 (신뢰감을 주는 파란색 톤 배경 믹스) */}
            <section className="relative h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2000&auto=format&fit=crop')` }}
                ></div>
                <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                <div className="container mx-auto px-6 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <span className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-100 font-bold tracking-wider text-sm rounded-full mb-6 backdrop-blur-sm">
                        CUSTOMER SUPPORT
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                        무엇을 도와드릴까요?
                    </h1>
                    <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        가넷정보기술은 고객님의 비즈니스가 단 1초도 멈추지 않도록<br className="hidden md:block" /> 신속하고 정확한 기술 지원을 약속합니다.
                    </p>

                    {/* 검색바 UI (시각적 포인트 - 실제 동작은 안하지만 B2B 사이트의 정석) */}
                    <div className="mt-10 max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#C1121F] transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C1121F] focus:bg-white/20 transition-all text-lg shadow-2xl"
                            placeholder="궁금하신 내용을 검색해 보세요 (예: NVR 설치 방법)"
                        />
                    </div>
                </div>
            </section>

            <div id="tab-anchor"></div>

            {/* 2. 탭 메뉴 영역 (sticky) */}
            <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="container mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="flex overflow-x-auto hide-scrollbar gap-8 md:justify-center">
                        {supportTabs.map((tab) => {
                            const isActive = activeCategory === tab.id;
                            const Icon = tab.icon;
                            return (
                                <Link
                                    key={tab.id}
                                    href={`/support/${tab.id}`}
                                    scroll={false}
                                    onClick={handleTabClick}
                                    className={`flex items-center gap-1.5 md:gap-2 py-4 md:py-5 font-semibold text-sm md:text-base transition-colors whitespace-nowrap border-b-2 ${isActive
                                        ? "border-[#C1121F] text-[#C1121F]"
                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    <Icon size={20} />
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. 콘텐츠 영역 */}
            <section className="py-20 px-6 lg:px-12">
                <div className="container mx-auto max-w-5xl">

                    {/* --- 3-1. 공지사항 (Notice) --- */}
                    {activeCategory === "notice" && (
                        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">공지사항</h2>
                                <p className="text-slate-500">가넷정보기술의 새로운 소식과 주요 업데이트를 알려드립니다.</p>
                            </div>

                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow className="hover:bg-transparent">
                                            {/* 모바일에서는 '번호' 숨김 */}
                                            <TableHead className="hidden md:table-cell w-[100px] text-center font-bold text-slate-600">번호</TableHead>
                                            <TableHead className="font-bold text-slate-600">제목</TableHead>
                                            <TableHead className="w-[100px] md:w-[150px] text-center font-bold text-slate-600">작성일</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { id: 4, title: "[안내] 2026년 AXGATE 플래티넘 레벨 유지", date: "2026.08.28", isNew: true },
                                            { id: 3, title: "[업데이트] 지능형 VMS 소프트웨어 v2.5 릴리즈 노트", date: "2026.08.20", isNew: false },
                                            { id: 2, title: "[공지] 신규 AI 돔 카메라 라인업 출시 안내", date: "2026.07.15", isNew: false },
                                            { id: 1, title: "[안내] 가넷정보기술 공식 홈페이지 리뉴얼 오픈", date: "2026.06.01", isNew: false },
                                        ].map((item) => (
                                            <TableRow
                                                key={item.id}
                                                onClick={() => alert(`[공지사항 상세] 백엔드 연동 후 '/support/notice/${item.id}' 경로로 이동합니다.`)}
                                                className="cursor-pointer hover:bg-slate-50 transition-colors">
                                                {/* 모바일에서는 '번호' 숨김 */}
                                                <TableCell className="hidden md:table-cell text-center text-slate-500">{item.id}</TableCell>
                                                {/* 제목이 길면 말줄임표(...) 처리. truncate를 위해 max-w 지정 */}
                                                <TableCell className="font-medium text-slate-800 max-w-[150px] md:max-w-none">
                                                    <div className="flex items-center gap-2">
                                                        <span className="truncate">{item.title}</span>
                                                        {item.isNew && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-md">NEW</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center text-slate-500">{item.date}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* --- 3-2. 자료실 (Download) --- */}
                    {activeCategory === "download" && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">자료실</h2>
                                <p className="text-slate-500">제품 카탈로그, 사용자 매뉴얼, 최신 소프트웨어를 다운로드하실 수 있습니다.</p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { category: "카탈로그", title: "2024 통합 보안 솔루션 카탈로그", ext: "PDF", size: "15.2MB" },
                                    { category: "매뉴얼", title: "AI 돔 카메라 사용자 매뉴얼 v1.2", ext: "PDF", size: "4.8MB" },
                                    { category: "소프트웨어", title: "PC용 통합 관제 뷰어 (Windows)", ext: "ZIP", size: "142.0MB" },
                                    { category: "기술문서", title: "재난망 연동 표준 API 명세서", ext: "PDF", size: "2.1MB" },
                                    { category: "소프트웨어", title: "네트워크 설정 유틸리티 툴", ext: "EXE", size: "8.5MB" },
                                    { category: "카탈로그", title: "공공기관 전용 조달 제품 안내서", ext: "PDF", size: "12.0MB" },
                                ].map((doc, idx) => (
                                    <div key={idx}
                                        onClick={() => alert(`'${doc.title}' 파일 다운로드 기능은 관리자 페이지에서 지원합니다.`)}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-[#C1121F]/50 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md group-hover:bg-[#C1121F]/10 group-hover:text-[#C1121F] transition-colors">{doc.category}</span>
                                                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{doc.ext}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-[#C1121F] transition-colors">{doc.title}</h3>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                                            <span>{doc.size}</span>
                                            <div className="flex items-center gap-1 text-[#C1121F] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                                다운로드 <FileDown size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- 3-3. 묻고 답하기 (FAQ) --- */}
                    {activeCategory === "faq" && (
                        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">자주 묻는 질문 (FAQ)</h2>
                                <p className="text-slate-500">고객님들께서 자주 문의하시는 내용을 모아두었습니다.</p>
                            </div>

                            {/* 아코디언 컴포넌트를 사용하여 질문/답변 구성 */}
                            <Accordion className="w-full">
                                {[
                                    { q: "유지보수 계약 기간 내에 발생하는 하드웨어 고장은 무상 처리되나요?", a: "네, 맞습니다. 통합 유지보수 계약 기간 내에 발생하는 장비의 자연적 결함 및 하드웨어 고장은 당사의 전문 엔지니어가 방문하여 100% 무상으로 교체 및 수리를 진행해 드립니다. 단, 천재지변이나 사용자의 명백한 과실로 인한 파손은 실비가 청구될 수 있습니다." },
                                    { q: "도입 전 현장 실사 및 컨설팅 비용이 발생하나요?", a: "기본적인 현장 실사와 초기 인프라 설계 컨설팅은 무상으로 제공됩니다. 귀사의 네트워크 환경과 물리적 보안 요구사항을 파악한 후 최적의 솔루션 제안서를 보내드립니다." },
                                    { q: "타사 CCTV 및 NVR 장비와도 호환이 가능한가요?", a: "당사의 VMS 소프트웨어는 ONVIF 국제 표준 프로토콜을 완벽하게 지원하므로, 대부분의 타사 카메라 및 NVR과 원활하게 연동됩니다. 단, 특정 제조사의 독자적인 특수 기능(AI 분석 등)은 일부 기능이 제한될 수 있습니다." },
                                    { q: "조달청(나라장터)을 통한 제품 구매가 가능한가요?", a: "네, 가능합니다. 가넷정보기술의 주요 솔루션 및 장비들은 나라장터 종합쇼핑몰에 다수 등록되어 있으며, 공공기관 고객의 경우 복잡한 계약 절차 없이 빠르고 투명하게 구매하실 수 있습니다." },
                                ].map((faq, idx) => (
                                    <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-slate-100">
                                        <AccordionTrigger className="text-left font-semibold text-slate-800 text-lg py-5 hover:text-[#C1121F] hover:no-underline">
                                            <div className="flex gap-4">
                                                <span className="text-[#C1121F] font-black">Q.</span>
                                                {faq.q}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 text-base leading-relaxed bg-slate-50 p-6 rounded-xl my-2 border border-slate-100">
                                            <div className="flex gap-4">
                                                <span className="text-slate-400 font-black">A.</span>
                                                {faq.a}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}

                    {/* --- 3-4. 온라인 문의 (Inquiry) --- */}
                    {activeCategory === "inquiry" && (
                        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100">
                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">온라인 문의</h2>
                                <p className="text-slate-500">도입 상담, 견적 요청 등 궁금하신 점을 남겨주시면 담당자가 신속하게 답변해 드립니다.</p>
                            </div>

                            <form className="max-w-3xl mx-auto space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">회사명 / 기관명 <span className="text-[#C1121F]">*</span></label>
                                        <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all" placeholder="가넷정보기술" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">담당자 성함 <span className="text-[#C1121F]">*</span></label>
                                        <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all" placeholder="홍길동" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">연락처 <span className="text-[#C1121F]">*</span></label>
                                        <input type="tel" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all" placeholder="010-0000-0000" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">이메일 <span className="text-[#C1121F]">*</span></label>
                                        <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all" placeholder="example@domain.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">문의 내용 <span className="text-[#C1121F]">*</span></label>
                                    <textarea rows={6} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all resize-none" placeholder="문의하실 내용을 상세히 적어주세요."></textarea>
                                </div>

                                <div className="pt-6 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); alert('해당 기능은 벡엔드 연동 후에 처리됩니다. (현재는 UI 데모입니다.)'); }}
                                        className="px-12 py-4 bg-[#C1121F] hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-900/20 transition-all transform hover:-translate-y-1"
                                    >
                                        문의 접수하기
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}


                </div>
            </section>
        </div>
    );
}
