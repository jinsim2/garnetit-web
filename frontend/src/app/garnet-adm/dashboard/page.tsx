"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Inbox, Package, Download, Megaphone, CheckCircle2, Clock, ArrowRight, RefreshCw, Loader2, TrendingUp, BarChart3, AlertCircle } from "lucide-react";

// Recharts 라이브러리 컴포넌트 임포트
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// 데이터 타입 규격
interface InquiryItem {
    id: number;
    company_name: string;
    author_name: string;
    email: string;
    phone: string;
    message: string;
    is_resolved: boolean;
    created_at: string;
}

interface ProductItem {
    id: number;
    name: string;
}

interface DownloadItem {
    id: number;
    title: string;
    category: string;
    download_count: number;
    created_at: string;
}

interface NoticeItem {
    id: number;
    title: string;
    is_pinned: boolean;
    view_count: number;
    created_at: string;
}

interface FaqItem {
    id: number;
    question: string;
}

export default function DashboardPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 원본 실데이터 상태
    const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [faqs, setFaqs] = useState<FaqItem[]>([]);

    useEffect(() => {
        setIsMounted(true);
        fetchDashboardData();
    }, []);

    // 1. 5개 도메인 실데이터를 한 번에 병렬 수집 (Promise.all)
    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const authHeader: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

            const [inquiriesRes, productsRes, downloadsRes, noticesRes, faqsRes] = await Promise.all([
                fetch("/api/v1/inquiries", { headers: authHeader }),
                fetch("/api/v1/products"),
                fetch("/api/v1/downloads"),
                fetch("/api/v1/notices"),
                fetch("/api/v1/faqs?include_unpublished=true", { headers: authHeader }),

            ]);

            if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
            if (productsRes.ok) setProducts(await productsRes.json());
            if (downloadsRes.ok) setDownloads(await downloadsRes.json());
            if (noticesRes.ok) setNotices(await noticesRes.json());
            if (faqsRes.ok) setFaqs(await faqsRes.json());

        } catch (error) {
            console.error("대시보드 데이터 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }

    // 2. 상단 4대 KPI 집게 계산
    const unresolvedInquiries = inquiries.filter(i => !i.is_resolved);
    const totalDownloadsCount = downloads.reduce((acc, d) => acc + (d.download_count || 0), 0);
    const totalSupportContent = notices.length + faqs.length;

    // 3. [차트 1] 최근 7일간 온라인 문의 접수 추이 데이터 가공
    const last7DaysChartData = (() => {
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            const dateKey = `${month}/${day}`;

            // 해당 날짜에 들어온 문의 건수 계산
            const count = inquiries.filter(item => {
                const itemDate = new Date(item.created_at);
                return (
                    itemDate.getFullYear() === d.getFullYear() &&
                    itemDate.getMonth() === d.getMonth() &&
                    itemDate.getDate() === d.getDate()
                );
            }).length;

            result.push({ date: dateKey, inquiries: count });
        }
        return result;
    })();

    // 4. [차트 2] 인기 자료 다운로드 순위 TOP 5 데이터 가공
    const topDownloadsChartData = [...downloads]
        .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
        .slice(0, 5)
        .map(item => ({
            name: item.title.length > 9 ? item.title.slice(0, 9) + "..." : item.title,
            fullName: item.title,
            downloads: item.download_count || 0,
        }));

    // SSR 수화 완료 전에는 안전한 로더 표시
    if (!isMounted) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* 타이틀 및 새로고침 바 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <LayoutDashboard className="text-[#C1121F]" /> 종합 관제 대시보드
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        가넷정보기술 웹 서비스의 핵심 운영 지표와 실시간 고객 접수 현황을 모니터링합니다.
                    </p>
                </div>

                <button
                    onClick={fetchDashboardData}
                    disabled={isLoading}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
                >
                    <RefreshCw size={16} className={isLoading ? "animate-spin text-[#C1121F]" : ""} />
                    새로고침
                </button>
            </div>

            {/* 1. 상단 4대 핵심 KPI 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1) 미처리 온라인 문의 */}
                <div className={`p-6 rounded-2xl border transition-all ${unresolvedInquiries.length > 0
                    ? "bg-red-50/40 border-red-200 shadow-sm"
                    : "bg-white border-slate-100 shadow-sm"
                    }`}>
                    <div className="flex justify-between items-center mb-3">
                        <span className={`text-sm font-bold ${unresolvedInquiries.length > 0 ? "text-red-700" : "text-slate-500"}`}>
                            답변 대기 문의
                        </span>
                        <span className={`p-2.5 rounded-xl ${unresolvedInquiries.length > 0 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-700"}`}>
                            <Inbox size={20} />
                        </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <div className="text-3xl font-black text-slate-900">
                            {unresolvedInquiries.length}
                            <span className="text-base font-normal text-slate-400 ml-1">건</span>
                        </div>
                        {unresolvedInquiries.length > 0 ? (
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
                                처리 필요
                            </span>
                        ) : (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                모두 완료
                            </span>
                        )}
                    </div>
                </div>

                {/* 2) 등록 솔루션 / 제품 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-500">등록 제품 / 솔루션</span>
                        <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Package size={20} />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {products.length}
                        <span className="text-base font-normal text-slate-400 ml-1">개</span>
                    </div>
                </div>

                {/* 3) 누적 자료 다운로드 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-500">누적 자료 다운로드</span>
                        <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                            <Download size={20} />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {totalDownloadsCount.toLocaleString()}
                        <span className="text-base font-normal text-slate-400 ml-1">회</span>
                    </div>
                </div>

                {/* 4) 고객지원 콘텐츠 (공지 + FAQ) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-500">고객지원 콘텐츠</span>
                        <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Megaphone size={20} />
                        </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <div className="text-3xl font-black text-slate-900">
                            {totalSupportContent}
                            <span className="text-base font-normal text-slate-400 ml-1">건</span>
                        </div>
                        <span className="text-xs text-slate-400">
                            공지 {notices.length} · FAQ {faqs.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. 중단 2단 비주얼 데이터 차트 (Recharts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 차트 1: 최근 7일간 온라인 문의 접수 추이 (AreaChart) */}
                <div className="bg-white p-6 md:p-7 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="text-[#C1121F]" size={20} />
                                최근 7일간 온라인 문의 접수 추이
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">고객들의 실시간 기술 지원 및 상담 접수 트랜드</p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 bg-red-50 text-[#C1121F] rounded-lg">
                            최근 7일
                        </span>
                    </div>

                    {/* AreaChart 그리기 */}
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={last7DaysChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="inquiryGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C1121F" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#C1121F" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl text-xs">
                                                    <p className="font-bold">{payload[0].payload.date}</p>
                                                    <p className="text-red-400 mt-0.5 font-semibold">
                                                        접수 문의: {payload[0].value}건
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="inquiries"
                                    stroke="#C1121F"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#inquiryGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 차트 2: 인기 자료실 다운로드 순위 TOP 5 (BarChart) */}
                <div className="bg-white p-6 md:p-7 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <BarChart3 className="text-slate-800" size={20} />
                                인기 자료실 다운로드 순위 TOP 5
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">고객들이 가장 많이 다운로드한 공식 문서/소프트웨어</p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                            다운로드 순
                        </span>
                    </div>

                    <div className="h-64 w-full">
                        {topDownloadsChartData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-xs text-slate-400">
                                등록된 다운로드 자료가 없습니다.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topDownloadsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const item = payload[0].payload;
                                                return (
                                                    <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xl text-xs max-w-xs">
                                                        <p className="font-bold truncate">{item.fullName}</p>
                                                        <p className="text-blue-400 mt-0.5 font-semibold">
                                                            총 다운로드: {item.downloads.toLocaleString()}회
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="downloads" fill="#1E293B" radius={[6, 6, 0, 0]} maxBarSize={45} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. 하단 2단 실시간 액션 바로가기 위젯 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 좌측: 신규 접수된 미처리 온라인 문의 목록 */}
                <div className="bg-white p-6 md:p-7 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <AlertCircle size={18} className="text-red-500" />
                                답변 대기 문의 ({unresolvedInquiries.length})
                            </h3>
                            <Link
                                href="/garnet-adm/dashboard/boards/inquiries"
                                className="text-xs font-bold text-slate-400 hover:text-[#C1121F] flex items-center gap-1 transition-colors"
                            >
                                문의 접수함 전체보기 <ArrowRight size={13} />
                            </Link>
                        </div>
                        {unresolvedInquiries.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-700">모든 온라인 문의가 처리되었습니다!</p>
                                <p className="text-xs text-slate-400 mt-0.5">답변 대기 중인 신규 문의가 없습니다.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {unresolvedInquiries.slice(0, 4).map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">
                                                {item.company_name} <span className="font-normal text-slate-500">({item.author_name})</span>
                                            </p>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">{item.message}</p>
                                        </div>
                                        <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded shrink-0">
                                            미처리
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                        <Link
                            href="/garnet-adm/dashboard/boards/inquiries"
                            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                        >
                            온라인 문의 접수함으로 이동 <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>

                {/* 우측: 최근 등록 공지사항 현황 */}
                <div className="bg-white p-6 md:p-7 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Megaphone size={18} className="text-[#C1121F]" />
                                최근 등록 공지사항 ({notices.length})
                            </h3>
                            <Link
                                href="/garnet-adm/dashboard/boards/notices"
                                className="text-xs font-bold text-slate-400 hover:text-[#C1121F] flex items-center gap-1 transition-colors"
                            >
                                공지사항 전체보기 <ArrowRight size={13} />
                            </Link>
                        </div>
                        {notices.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                <p className="text-sm font-semibold text-slate-700">등록된 공지사항이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notices.slice(0, 4).map((notice) => (
                                    <div key={notice.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate hover:text-[#C1121F] transition-colors">
                                                {notice.is_pinned && (
                                                    <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mr-1.5">
                                                        공지
                                                    </span>
                                                )}
                                                {notice.title}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                조회수 {notice.view_count.toLocaleString()}회 · {new Date(notice.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                        <Link
                            href="/garnet-adm/dashboard/boards/notices"
                            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                        >
                            공지사항 관리 페이지로 이동 <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
