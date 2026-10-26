"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Megaphone, Download, HelpCircle, FileDown, Search, Mail, CheckCircle2, Loader2, Pin, X, Eye, ArrowRight } from "lucide-react";

// Shadcn UI 컴포넌트 임포트 (기존에 설치된 것들 재활용)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { useState, useEffect } from "react";

const supportTabs = [
    { id: "notice", name: "공지사항", icon: Megaphone },
    { id: "download", name: "자료실", icon: Download },
    { id: "faq", name: "묻고 답하기 (FAQ)", icon: HelpCircle },
    { id: "inquiry", name: "온라인 문의", icon: Mail },
];

// 💡 공지사항 데이터 타입
interface NoticeItem {
    id: number;
    title: string;
    content: string;
    is_pinned: boolean;
    view_count: number;
    created_at: string;
}

// 💡 [추가] 자료실 데이터 타입
interface DownloadItem {
    id: number;
    title: string;
    category: string;
    description?: string;
    file_url: string;
    file_name: string;
    file_size: string;
    file_ext: string;
    download_count: number;
    is_published: boolean;
    created_at: string;
}

// 💡 [추가] FAQ 데이터 타입
interface FaqItem {
    id: number;
    category: string;
    question: string;
    answer: string;
    sort_order: number;
    is_published: boolean;
    created_at: string;
}

export default function SupportPage() {
    const params = useParams();
    const activeCategory = (params.category as string) || "notice";

    // [신규] 1. 온라인 문의 입력 폼 State
    const [formData, setFormData] = useState({
        company_name: "",
        author_name: "",
        email: "",
        phone: "",
        message: "",
    });

    // [신규] 2. 전송 중 상태 & 개인 정보 동의 & 접수 완료 상태
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // 💡 공지사항 관련 State
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [isLoadingNotices, setIsLoadingNotices] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
    const [noticeSearch, setNoticeSearch] = useState("");

    // 💡 [추가] 자료실 관련 State
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [isLoadingDownloads, setIsLoadingDownloads] = useState(false);
    const [downloadCategory, setDownloadCategory] = useState("전체");
    const [downloadSearch, setDownloadSearch] = useState("");

    // 💡 [추가] FAQ 관련 State
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
    const [faqCategory, setFaqCategory] = useState("전체");
    const [faqSearch, setFaqSearch] = useState("");

    // [추가] 상단 히어로 검색 State 및 추천 키워드
    const [heroSearch, setHeroSearch] = useState("");
    const POPULAR_KEYWORDS = ["NVR", "카탈로그", "유지보수", "매뉴얼", "소프트웨어", "A/S"];

    // 💡 [추가] 통합 검색 관련 State
    const [searchQuery, setSearchQuery] = useState(""); // 실제 검색이 실행된 확정 키워드
    const [isUnifiedLoading, setIsUnifiedLoading] = useState(false);
    const [unifiedResults, setUnifiedResults] = useState<{
        faqs: FaqItem[];
        downloads: DownloadItem[];
        notices: NoticeItem[];
    }>({
        faqs: [],
        downloads: [],
        notices: [],
    });

    // 💡 [추가] 공지사항/자료실/FAQ 3대 영역 동시 통합 검색 실행 함수
    const executeUnifiedSearch = async (keywordOverride?: string) => {
        const keyword = (keywordOverride !== undefined ? keywordOverride : heroSearch).trim();
        if (!keyword) return;
        setSearchQuery(keyword);
        setHeroSearch(keyword);
        setIsUnifiedLoading(true);
        // 1. 검색 결과 위치로 부드럽게 스크롤
        setTimeout(() => {
            const anchor = document.getElementById("tab-anchor");
            if (anchor) {
                const y = anchor.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }, 80);

        // 2. 3개 API를 동시에 병렬 호출 (초고속 Promise.all)
        try {
            const [faqRes, downloadRes, noticeRes] = await Promise.all([
                fetch(`/api/v1/faqs?search=${encodeURIComponent(keyword)}`),
                fetch(`/api/v1/downloads?search=${encodeURIComponent(keyword)}`),
                fetch(`/api/v1/notices?search=${encodeURIComponent(keyword)}`),
            ]);
            const faqs: FaqItem[] = faqRes.ok ? await faqRes.json() : [];
            const downloads: DownloadItem[] = downloadRes.ok ? await downloadRes.json() : [];
            const notices: NoticeItem[] = noticeRes.ok ? await noticeRes.json() : [];
            setUnifiedResults({ faqs, downloads, notices });
        } catch (error) {
            console.error("통합 검색 실패:", error);
        } finally {
            setIsUnifiedLoading(false);
        }
    };

    // 💡 [추가] 통합 검색 닫기/초기화 (일반 탭 모드로 복귀)
    const clearUnifiedSearch = () => {
        setSearchQuery("");
        setHeroSearch("");
        setUnifiedResults({ faqs: [], downloads: [], notices: [] });
    };

    // 💡 [수정] 활성화된 탭(공지사항, 자료실, FAQ)에 따라 각각 DB에서 데이터 불러오기
    useEffect(() => {
        if (activeCategory === "notice") {
            fetchNotices();
        } else if (activeCategory === "download") {
            fetchDownloads();
        } else if (activeCategory === "faq") {
            fetchFaqs();
        }
    }, [activeCategory]);

    const fetchNotices = async () => {
        setIsLoadingNotices(true);
        try {
            const res = await fetch("/api/v1/notices");
            if (res.ok) {
                const data = await res.json();
                setNotices(data);
            }
        } catch (error) {
            console.error("공지사항 목록 로드 실패:", error);
        } finally {
            setIsLoadingNotices(false);
        }
    };

    // 공지사항 클릭 시 상세 내용 열기 & 조회수 증가
    const handleNoticeClick = async (notice: NoticeItem) => {
        setSelectedNotice(notice);
        try {
            const res = await fetch(`/api/v1/notices/${notice.id}`);
            if (res.ok) {
                const updated = await res.json();
                setSelectedNotice(updated);
                // 목록의 조회수도 실시간 반영
                setNotices(prev => prev.map(n => n.id === notice.id ? updated : n));
            }
        } catch (error) {
            console.error("공지 상세 로드 실패:", error);
        }
    };

    // 💡 [추가] 자료실 목록 불러오기
    const fetchDownloads = async () => {
        setIsLoadingDownloads(true);
        try {
            const res = await fetch("/api/v1/downloads");
            if (res.ok) {
                const data = await res.json();
                setDownloads(data);
            }
        } catch (error) {
            console.error("자료실 목록 로드 실패:", error);
        } finally {
            setIsLoadingDownloads(false);
        }
    };

    // 💡 [추가] 파일 다운로드 핸들러 (다운로드 수 카운트 증가 + 파일 저장)
    const handleDownload = async (item: DownloadItem, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            // 1) 백엔드에 다운로드 카운트 +1 요청
            fetch(`/api/v1/downloads/${item.id}/download`, { method: "POST" }).catch(console.error);

            // 2) UI 상의 카운트 즉시 1 증가
            setDownloads(prev => prev.map(d => d.id === item.id ? { ...d, download_count: d.download_count + 1 } : d));

            // 3) 브라우저 다운로드 트리거
            const link = document.createElement("a");
            link.href = item.file_url;
            link.download = item.file_name || `${item.title}.${item.file_ext.toLowerCase()}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("파일 다운로드 실패:", error);
        }
    };

    // 💡 [추가] FAQ 목록 불러오기 (공개된 항목만 조회)
    const fetchFaqs = async () => {
        setIsLoadingFaqs(true);
        try {
            const res = await fetch("/api/v1/faqs");
            if (res.ok) {
                const data = await res.json();
                setFaqs(data);
            }
        } catch (error) {
            console.error("FAQ 목록 로드 실패:", error);
        } finally {
            setIsLoadingFaqs(false);
        }
    };

    // [신규] 3. 입력값 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // [신규] 4. 백엔드로 문의 전송 (API 호출)
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 1) 개인정보 덩의 검증
        if (!isAgreed) {
            alert("개인정보 수집 및 이용에 동의해 주세요!");
            return;
        }

        // 2) 백엔드 전송 시작
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/v1/inquiries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: "알 수 없는 오류 발생!" }));
                throw new Error(errorData.detail || "문의 접수에 실패했습니다!");
            }

            // 3) 성공 시: 폼 초기화 및 성공 화면으로 전환
            setIsSuccess(true);
            setFormData({
                company_name: "",
                author_name: "",
                email: "",
                phone: "",
                message: "",
            });
            setIsAgreed(false);

        } catch (error: any) {
            console.error(error);
            alert(error.message || "서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 탭 부드러운 스크롤 (사업영역, 제품소개와 동일)
    const handleTabClick = () => {
        clearUnifiedSearch(); // 💡 [추가] 탭 클릭 시 검색 모드를 닫고 해당 탭의 전체 목록으로 복귀
        setTimeout(() => {
            const anchor = document.getElementById("tab-anchor");
            if (anchor) {
                const y = anchor.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }, 10);
    };

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

                    {/* 실시간 통합 검색바 */}
                    <div className="mt-10 max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#C1121F] transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            value={heroSearch}
                            onChange={(e) => setHeroSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    executeUnifiedSearch();
                                }
                            }}
                            className="block w-full pl-12 pr-28 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C1121F] focus:bg-white/20 transition-all text-base md:text-lg shadow-2xl"
                            placeholder="궁금하신 내용을 검색해 보세요 (예: NVR, 카탈로그, 유지보수)"
                        />

                        {/* 입력창 우측 액션 버튼들 */}
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            {heroSearch && (
                                <button
                                    type="button"
                                    onClick={clearUnifiedSearch}
                                    className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                    title="검색어 초기화"
                                >
                                    <X size={18} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => executeUnifiedSearch()}
                                className="px-4 py-2 bg-[#C1121F] hover:bg-[#a00e1a] text-white text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                            >
                                <Search size={16} /> 검색
                            </button>
                        </div>
                    </div>

                    {/* 원클릭 인기 추천 검색어 해시태그 */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                        <span className="text-slate-300 font-medium">인기 검색어:</span>
                        {POPULAR_KEYWORDS.map((kw) => (
                            <button
                                key={kw}
                                type="button"
                                onClick={() => executeUnifiedSearch(kw)}
                                className="px-3 py-1 bg-white/10 hover:bg-white/25 text-slate-200 hover:text-white rounded-full border border-white/15 backdrop-blur-sm transition-all cursor-pointer font-medium active:scale-95"
                            >
                                #{kw}
                            </button>
                        ))}
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
                    {/* 🌟 [신규] 고객지원 전역 통합 검색 결과 뷰 (검색어가 있을 때 실행) */}
                    {searchQuery ? (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* 검색 결과 상단 요약 배너 */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl">
                                <div>
                                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider mb-1">
                                        <Search size={14} /> 고객지원 통합 검색 결과
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold">
                                        &ldquo;<span className="text-[#C1121F]">{searchQuery}</span>&rdquo; 검색 결과
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">
                                        자주 묻는 질문, 자료실, 공지사항 전 영역에서 총{" "}
                                        <strong className="text-white font-bold">
                                            {(unifiedResults.faqs.length + unifiedResults.downloads.length + unifiedResults.notices.length).toLocaleString()}건
                                        </strong>
                                        의 자료를 찾았습니다.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={clearUnifiedSearch}
                                    className="self-start md:self-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
                                >
                                    <X size={16} /> 검색 닫기
                                </button>
                            </div>
                            {/* 로딩 중 표시 */}
                            {isUnifiedLoading ? (
                                <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                                    <Loader2 className="animate-spin text-[#C1121F] mx-auto mb-3" size={32} />
                                    <p className="text-slate-500 text-sm">고객지원 전 영역(공지사항, 자료실, FAQ)을 검색하고 있습니다...</p>
                                </div>
                            ) : (unifiedResults.faqs.length === 0 && unifiedResults.downloads.length === 0 && unifiedResults.notices.length === 0) ? (
                                /* 결과 0건 안내 & 온라인 문의 작성 유도 (CTA) */
                                <div className="bg-white rounded-3xl p-12 md:p-16 shadow-sm border border-slate-100 text-center space-y-5">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                        <Search size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                                            &ldquo;{searchQuery}&rdquo;에 대한 검색 결과가 없습니다
                                        </h3>
                                        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                                            단어의 철자가 정확한지 확인해 주시거나 다른 검색어로 다시 시도해 보세요.<br />
                                            찾으시는 내용이 없으시다면 엔지니어에게 온라인 문의를 남겨주세요.
                                        </p>
                                    </div>
                                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={clearUnifiedSearch}
                                            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all cursor-pointer"
                                        >
                                            전체 목록으로 돌아가기
                                        </button>
                                        <Link
                                            href="/support/inquiry"
                                            onClick={clearUnifiedSearch}
                                            className="px-6 py-2.5 bg-[#C1121F] hover:bg-[#a00e1a] text-white font-bold rounded-xl text-sm shadow-md shadow-[#C1121F]/20 transition-all flex items-center gap-2 cursor-pointer"
                                        >
                                            <Mail size={16} /> 온라인 기술 문의 남기기
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                /* 3대 영역 검색 결과 순차 노출 */
                                <div className="space-y-8">
                                    {/* 1. 자주 묻는 질문 (FAQ) 결과 섹션 */}
                                    {unifiedResults.faqs.length > 0 && (
                                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                    <HelpCircle className="text-[#C1121F]" size={20} />
                                                    자주 묻는 질문 (FAQ)
                                                    <span className="px-2 py-0.5 bg-red-50 text-[#C1121F] text-xs font-black rounded-full">
                                                        {unifiedResults.faqs.length}건
                                                    </span>
                                                </h3>
                                                <Link
                                                    href="/support/faq"
                                                    onClick={clearUnifiedSearch}
                                                    className="text-xs font-semibold text-slate-400 hover:text-[#C1121F] flex items-center gap-1 transition-colors"
                                                >
                                                    FAQ 전체 보기 <ArrowRight size={13} />
                                                </Link>
                                            </div>
                                            <Accordion className="w-full">
                                                {unifiedResults.faqs.map((faq) => (
                                                    <AccordionItem key={faq.id} value={`unified-faq-${faq.id}`} className="border-b border-slate-100 py-1">
                                                        <AccordionTrigger className="text-left font-semibold text-slate-800 text-base py-3.5 hover:text-[#C1121F] hover:no-underline">
                                                            <div className="flex items-start gap-3 pr-4">
                                                                <span className="text-[#C1121F] font-black text-lg shrink-0">Q.</span>
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 w-fit shrink-0">
                                                                        {faq.category}
                                                                    </span>
                                                                    <span className="leading-snug">{faq.question}</span>
                                                                </div>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-slate-600 text-sm leading-relaxed bg-slate-50/80 p-5 rounded-2xl my-2 border border-slate-100 whitespace-pre-wrap">
                                                            <div className="flex gap-3">
                                                                <span className="text-slate-400 font-black text-lg shrink-0">A.</span>
                                                                <div className="flex-1 leading-relaxed text-slate-700">{faq.answer}</div>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    )}
                                    {/* 2. 다운로드 자료실 결과 섹션 */}
                                    {unifiedResults.downloads.length > 0 && (
                                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                    <Download className="text-[#C1121F]" size={20} />
                                                    다운로드 자료실
                                                    <span className="px-2 py-0.5 bg-red-50 text-[#C1121F] text-xs font-black rounded-full">
                                                        {unifiedResults.downloads.length}건
                                                    </span>
                                                </h3>
                                                <Link
                                                    href="/support/download"
                                                    onClick={clearUnifiedSearch}
                                                    className="text-xs font-semibold text-slate-400 hover:text-[#C1121F] flex items-center gap-1 transition-colors"
                                                >
                                                    자료실 전체 보기 <ArrowRight size={13} />
                                                </Link>
                                            </div>
                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                                                {unifiedResults.downloads.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        onClick={(e) => handleDownload(doc, e)}
                                                        className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200 hover:border-[#C1121F]/50 hover:bg-white hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
                                                    >
                                                        <div>
                                                            <div className="flex justify-between items-start mb-3">
                                                                <span className="text-xs font-bold px-2 py-0.5 bg-white text-slate-600 rounded border border-slate-200">
                                                                    {doc.category}
                                                                </span>
                                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                                                    {doc.file_ext}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-[#C1121F] transition-colors line-clamp-1">
                                                                {doc.title}
                                                            </h4>
                                                            {doc.description && (
                                                                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-2">
                                                                    {doc.description}
                                                                </p>
                                                            )}
                                                            <p className="text-[11px] text-slate-400 truncate mb-1">
                                                                파일명: {doc.file_name}
                                                            </p>
                                                        </div>
                                                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                                                            <span className="font-medium">{doc.file_size}</span>
                                                            <div className="flex items-center gap-1 text-[#C1121F] font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                                                                다운로드 <FileDown size={14} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* 3. 공지사항 결과 섹션 */}
                                    {unifiedResults.notices.length > 0 && (
                                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                    <Megaphone className="text-[#C1121F]" size={20} />
                                                    공지사항
                                                    <span className="px-2 py-0.5 bg-red-50 text-[#C1121F] text-xs font-black rounded-full">
                                                        {unifiedResults.notices.length}건
                                                    </span>
                                                </h3>
                                                <Link
                                                    href="/support/notice"
                                                    onClick={clearUnifiedSearch}
                                                    className="text-xs font-semibold text-slate-400 hover:text-[#C1121F] flex items-center gap-1 transition-colors"
                                                >
                                                    공지사항 전체 보기 <ArrowRight size={13} />
                                                </Link>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <Table>
                                                    <TableHeader className="bg-slate-50">
                                                        <TableRow className="hover:bg-transparent">
                                                            <TableHead className="w-[80px] text-center font-bold text-slate-600">번호</TableHead>
                                                            <TableHead className="font-bold text-slate-600">제목</TableHead>
                                                            <TableHead className="w-[120px] text-center font-bold text-slate-600">작성일</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {unifiedResults.notices.map((notice) => (
                                                            <TableRow
                                                                key={notice.id}
                                                                onClick={() => handleNoticeClick(notice)}
                                                                className="cursor-pointer hover:bg-slate-50 transition-colors"
                                                            >
                                                                <TableCell className="text-center text-slate-400 text-xs">
                                                                    {notice.id}
                                                                </TableCell>
                                                                <TableCell className="font-medium text-slate-800">
                                                                    <span className="hover:text-[#C1121F] transition-colors">
                                                                        {notice.title}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-center text-slate-500 text-xs">
                                                                    {new Date(notice.created_at).toLocaleDateString()}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* 💡 searchQuery가 없을 때만 기존 탭별 콘텐츠(공지/자료/FAQ/문의) 렌더링 */

                        <>
                            {/* --- 3-1. 공지사항 (Notice) --- */}
                            {activeCategory === "notice" && (
                                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100 space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-2">공지사항</h2>
                                            <p className="text-slate-500 text-sm">가넷정보기술의 새로운 소식과 주요 업데이트를 알려드립니다.</p>
                                        </div>
                                        {/* 공지 검색창 */}
                                        <div className="relative w-full md:w-72">
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder="공지 검색..."
                                                value={noticeSearch}
                                                onChange={(e) => setNoticeSearch(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                            />
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead className="hidden md:table-cell w-[100px] text-center font-bold text-slate-600">번호</TableHead>
                                                    <TableHead className="font-bold text-slate-600">제목</TableHead>
                                                    <TableHead className="w-[100px] text-center font-bold text-slate-600 hidden sm:table-cell">조회수</TableHead>
                                                    <TableHead className="w-[120px] text-center font-bold text-slate-600">작성일</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isLoadingNotices ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-40 text-center text-slate-400">
                                                            <div className="flex flex-col items-center justify-center gap-2">
                                                                <Loader2 className="animate-spin text-[#C1121F]" size={24} />
                                                                <span className="text-sm">공지사항을 불러오는 중입니다...</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : notices.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-40 text-center text-slate-400 text-sm">
                                                            등록된 공지사항이 없습니다.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    notices
                                                        .filter(n => n.title.toLowerCase().includes(noticeSearch.toLowerCase()) || n.content.toLowerCase().includes(noticeSearch.toLowerCase()))
                                                        .map((item) => {
                                                            // 최근 7일 이내 작성된 글인지 확인 (NEW 뱃지용)
                                                            const isNew = (new Date().getTime() - new Date(item.created_at).getTime()) < (7 * 24 * 60 * 60 * 1000);
                                                            return (
                                                                <TableRow
                                                                    key={item.id}
                                                                    onClick={() => handleNoticeClick(item)}
                                                                    className={`cursor-pointer transition-colors ${item.is_pinned ? "bg-amber-50/40 hover:bg-amber-50/80" : "hover:bg-slate-50"}`}
                                                                >
                                                                    {/* 구분 (상단고정 뱃지 또는 번호) */}
                                                                    <TableCell className="hidden md:table-cell text-center">
                                                                        {item.is_pinned ? (
                                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded">
                                                                                <Pin size={11} className="fill-amber-800" /> 공지
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-slate-400 text-xs">{item.id}</span>
                                                                        )}
                                                                    </TableCell>
                                                                    {/* 제목 */}
                                                                    <TableCell className="font-medium text-slate-800">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`hover:text-[#C1121F] transition-colors ${item.is_pinned ? "font-bold text-slate-900" : ""}`}>
                                                                                {item.title}
                                                                            </span>
                                                                            {isNew && (
                                                                                <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">NEW</span>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    {/* 조회수 */}
                                                                    <TableCell className="hidden sm:table-cell text-center text-slate-400 text-xs">
                                                                        {item.view_count.toLocaleString()}
                                                                    </TableCell>
                                                                    {/* 작성일 */}
                                                                    <TableCell className="text-center text-slate-500 text-xs">
                                                                        {new Date(item.created_at).toLocaleDateString()}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            {/* 💡 고객용 공지사항 본문 상세보기 모달 */}
                            {selectedNotice && (
                                <div
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                                    onClick={() => setSelectedNotice(null)}
                                >
                                    <div
                                        className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative space-y-6 max-h-[85vh] overflow-y-auto"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* 닫기 버튼 */}
                                        <button
                                            onClick={() => setSelectedNotice(null)}
                                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                                        >
                                            <X size={20} />
                                        </button>
                                        {/* 공지 헤더 */}
                                        <div className="border-b border-slate-100 pb-5">
                                            {selectedNotice.is_pinned && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-md mb-2">
                                                    <Pin size={12} className="fill-amber-800" /> 중요 공지
                                                </span>
                                            )}
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                                                {selectedNotice.title}
                                            </h2>
                                            <div className="flex items-center gap-4 text-xs text-slate-400 mt-3">
                                                <span>작성일: {new Date(selectedNotice.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Eye size={12} /> 조회수 {selectedNotice.view_count.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {/* 공지 본문 내용 */}
                                        <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base min-h-[160px]">
                                            {selectedNotice.content}
                                        </div>
                                        {/* 닫기 버튼 */}
                                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedNotice(null)}
                                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all cursor-pointer"
                                            >
                                                닫기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- 3-2. 자료실 (Download) --- */}
                            {activeCategory === "download" && (
                                <div className="space-y-6">
                                    {/* 헤더 & 검색창 */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-1">자료실</h2>
                                            <p className="text-slate-500 text-sm">제품 카탈로그, 매뉴얼, 소프트웨어 등 최신 공식 자료를 다운로드하실 수 있습니다.</p>
                                        </div>
                                        <div className="relative w-full md:w-72">
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder="자료 검색 (제목, 설명)..."
                                                value={downloadSearch}
                                                onChange={(e) => setDownloadSearch(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                            />
                                        </div>
                                    </div>

                                    {/* 카테고리 필터 버튼 탭 */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {["전체", "카탈로그", "매뉴얼", "소프트웨어", "드라이버", "기술문서", "기타"].map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setDownloadCategory(cat)}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${downloadCategory === cat
                                                    ? "bg-[#C1121F] text-white shadow-sm"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    {/* 자료 카드 그리드 */}
                                    {isLoadingDownloads ? (
                                        <div className="py-24 text-center">
                                            <Loader2 className="animate-spin text-[#C1121F] mx-auto mb-3" size={32} />
                                            <p className="text-slate-500 text-sm">자료 목록을 불러오는 중입니다...</p>
                                        </div>
                                    ) : (
                                        (() => {
                                            const filteredDownloads = downloads.filter((item) => {
                                                const matchCategory = downloadCategory === "전체" || item.category === downloadCategory;
                                                const matchSearch =
                                                    item.title.toLowerCase().includes(downloadSearch.toLowerCase()) ||
                                                    (item.description && item.description.toLowerCase().includes(downloadSearch.toLowerCase()));
                                                return matchCategory && matchSearch;
                                            });

                                            if (filteredDownloads.length === 0) {
                                                return (
                                                    <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
                                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                                            <Download size={28} />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-slate-800 mb-1">등록된 자료가 없습니다</h3>
                                                        <p className="text-sm text-slate-400">
                                                            {downloadSearch || downloadCategory !== "전체"
                                                                ? "검색 조건에 일치하는 자료가 없습니다."
                                                                : "현재 등록된 공개 자료가 없습니다."}
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {filteredDownloads.map((doc) => (
                                                        <div
                                                            key={doc.id}
                                                            onClick={(e) => handleDownload(doc, e)}
                                                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-[#C1121F]/50 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
                                                        >
                                                            <div>
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md group-hover:bg-[#C1121F]/10 group-hover:text-[#C1121F] transition-colors">
                                                                        {doc.category}
                                                                    </span>
                                                                    <span className="text-xs font-bold px-2 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">
                                                                        {doc.file_ext}
                                                                    </span>
                                                                </div>
                                                                <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 group-hover:text-[#C1121F] transition-colors line-clamp-1">
                                                                    {doc.title}
                                                                </h3>
                                                                {doc.description && (
                                                                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">
                                                                        {doc.description}
                                                                    </p>
                                                                )}
                                                                <p className="text-[11px] text-slate-400 truncate mb-1">
                                                                    파일명: {doc.file_name}
                                                                </p>
                                                            </div>

                                                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-medium text-slate-600">{doc.file_size}</span>
                                                                    <span>•</span>
                                                                    <span className="text-slate-400">다운로드 {doc.download_count.toLocaleString()}회</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[#C1121F] font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                                                                    다운로드 <FileDown size={15} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            )}


                            {/* --- 3-3. 묻고 답하기 (FAQ) --- */}
                            {activeCategory === "faq" && (
                                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100 space-y-6">
                                    {/* 헤더 & 검색창 */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-1">자주 묻는 질문 (FAQ)</h2>
                                            <p className="text-slate-500 text-sm">가넷정보기술의 솔루션과 서비스에 대해 고객님들께서 자주 문의하시는 내용을 모아두었습니다.</p>
                                        </div>
                                        <div className="relative w-full md:w-72">
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder="질문 검색 (예: 유지보수, 견적)..."
                                                value={faqSearch}
                                                onChange={(e) => setFaqSearch(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                            />
                                        </div>
                                    </div>

                                    {/* 카테고리 필터 버튼 탭 */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-100 pb-4">
                                        {["전체", "제품/기술", "도입/견적", "유지보수", "구매/계약", "기타"].map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setFaqCategory(cat)}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${faqCategory === cat
                                                    ? "bg-[#C1121F] text-white shadow-sm"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    {/* 아코디언 질문/답변 목록 */}
                                    {isLoadingFaqs ? (
                                        <div className="py-24 text-center">
                                            <Loader2 className="animate-spin text-[#C1121F] mx-auto mb-3" size={32} />
                                            <p className="text-slate-500 text-sm">FAQ 목록을 불러오는 중입니다...</p>
                                        </div>
                                    ) : (
                                        (() => {
                                            const filteredFaqs = faqs.filter((item) => {
                                                const matchCategory = faqCategory === "전체" || item.category === faqCategory;
                                                const matchSearch =
                                                    item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
                                                    item.answer.toLowerCase().includes(faqSearch.toLowerCase());
                                                return matchCategory && matchSearch;
                                            });

                                            if (filteredFaqs.length === 0) {
                                                return (
                                                    <div className="py-16 text-center text-slate-400">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                                            <HelpCircle size={32} />
                                                        </div>
                                                        <p className="font-semibold text-slate-700 mb-1">등록된 질문이 없습니다</p>
                                                        <p className="text-xs text-slate-400">
                                                            {faqSearch || faqCategory !== "전체"
                                                                ? "검색 조건에 일치하는 질문이 없습니다."
                                                                : "현재 등록된 공개 질문이 없습니다."}
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <Accordion className="w-full">
                                                    {filteredFaqs.map((faq) => (
                                                        <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border-b border-slate-100 py-1">
                                                            <AccordionTrigger className="text-left font-semibold text-slate-800 text-base md:text-lg py-4 hover:text-[#C1121F] hover:no-underline">
                                                                <div className="flex items-start gap-3.5 pr-4">
                                                                    <span className="text-[#C1121F] font-black text-lg md:text-xl shrink-0">Q.</span>
                                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 w-fit shrink-0">
                                                                            {faq.category}
                                                                        </span>
                                                                        <span className="leading-snug text-slate-800">{faq.question}</span>
                                                                    </div>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="text-slate-600 text-sm md:text-base leading-relaxed bg-slate-50/80 p-6 rounded-2xl my-2 border border-slate-100 whitespace-pre-wrap">
                                                                <div className="flex gap-3.5">
                                                                    <span className="text-slate-400 font-black text-lg md:text-xl shrink-0">A.</span>
                                                                    <div className="flex-1 whitespace-pre-wrap leading-relaxed text-slate-700">
                                                                        {faq.answer}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    ))}
                                                </Accordion>
                                            );
                                        })()
                                    )}
                                </div>
                            )}

                            {/* --- 3-4. 온라인 문의 (Inquiry) --- */}
                            {activeCategory === "inquiry" && (
                                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100">

                                    {/* ✨ 접수 성공 시 나타나는 감사 화면 */}
                                    {isSuccess ? (
                                        <div className="text-center py-16 space-y-6 animate-in fade-in zoom-in duration-500">
                                            <div className="w-20 h-20 bg-red-50 text-[#C1121F] rounded-full flex items-center justify-center mx-auto shadow-inner">
                                                <CheckCircle2 size={44} />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-extrabold text-slate-900">문의가 성공적으로 접수되었습니다!</h3>
                                                <p className="text-slate-500 text-lg max-w-lg mx-auto">
                                                    가넷정보기술의 전문 엔지니어가 접수해 주신 내용을 검토한 후,
                                                    남겨주신 연락처로 신속하게 안내해 드리겠습니다.
                                                </p>
                                            </div>
                                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                                                {/* 1. 메인 홈으로 가기 (가장 무난한 탈출구) */}
                                                <Link href="/" className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all">
                                                    홈으로 이동
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsSuccess(false)}
                                                    className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                                >
                                                    추가 문의 접수하기
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ✨ 실제 입력 폼 */
                                        <div>
                                            <div className="mb-8 text-center md:text-left">
                                                <h2 className="text-2xl font-bold text-slate-900 mb-2">온라인 문의</h2>
                                                <p className="text-slate-500">도입 상담, 견적 요청 등 궁금하신 점을 남겨주시면 담당자가 신속하게 답변해 드립니다.</p>
                                            </div>
                                            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-slate-700">회사명 / 기관명 <span className="text-[#C1121F]">*</span></label>
                                                        <input
                                                            type="text"
                                                            name="company_name"
                                                            required
                                                            value={formData.company_name}
                                                            onChange={handleInputChange}
                                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                                                            placeholder="예: 가넷정보기술"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-slate-700">담당자 성함 <span className="text-[#C1121F]">*</span></label>
                                                        <input
                                                            type="text"
                                                            name="author_name"
                                                            required
                                                            value={formData.author_name}
                                                            onChange={handleInputChange}
                                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                                                            placeholder="예: 홍길동 팀장"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-slate-700">연락처 <span className="text-[#C1121F]">*</span></label>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            required
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                                                            placeholder="010-0000-0000"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-slate-700">이메일 <span className="text-[#C1121F]">*</span></label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            required
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                                                            placeholder="example@domain.com"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700">문의 내용 <span className="text-[#C1121F]">*</span></label>
                                                    <textarea
                                                        name="message"
                                                        required
                                                        rows={6}
                                                        value={formData.message}
                                                        onChange={handleInputChange}
                                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all resize-none"
                                                        placeholder="도입을 검토 중인 솔루션, 수량, 현장 환경 등을 상세히 적어주시면 더욱 정확한 상담이 가능합니다."
                                                    ></textarea>
                                                </div>
                                                {/* ⚖️ 법적 필수: 개인정보 수집 및 이용 동의 체크박스 */}
                                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 flex items-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        id="privacy-agree"
                                                        checked={isAgreed}
                                                        onChange={(e) => setIsAgreed(e.target.checked)}
                                                        className="mt-1 w-4 h-4 rounded text-[#C1121F] focus:ring-[#C1121F] border-slate-300 cursor-pointer"
                                                    />
                                                    <label htmlFor="privacy-agree" className="cursor-pointer select-none">
                                                        <span className="font-bold text-slate-800">[필수]</span> 문의 처리를 위한 개인정보(회사명, 성함, 연락처, 이메일) 수집 및 이용에 동의합니다.
                                                    </label>
                                                </div>
                                                {/* 전송 버튼 (로딩 스피너 및 중복 방지 적용) */}
                                                <div className="pt-4 flex justify-center">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="min-w-[200px] flex items-center justify-center gap-2 px-12 py-4 bg-[#C1121F] hover:bg-red-700 disabled:bg-slate-400 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-900/20 transition-all transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed cursor-pointer"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="animate-spin" size={20} />
                                                                접수 처리 중...
                                                            </>
                                                        ) : (
                                                            "문의 접수하기"
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}

                        </>
                    )}

                </div>
            </section>
        </div>
    );
}
