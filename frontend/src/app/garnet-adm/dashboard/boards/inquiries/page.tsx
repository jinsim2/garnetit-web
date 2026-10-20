"use client";

import { useState, useEffect } from "react";
import {
    Search,
    CheckCircle2,
    Clock,
    Trash2,
    Mail,
    Phone,
    Building2,
    Calendar,
    Eye,
    Loader2,
    RefreshCw,
    X
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 문의 데이터 타입 인터페이스
interface Inquiry {
    id: number;
    company_name: string;
    author_name: string;
    phone: string;
    email: string;
    message: string;
    subject?: string | null;
    is_resolved: boolean;
    created_at: string;
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "RESOLVED">("ALL");

    // 상세보기 모달에 띄울 선택된 문의
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    // 컴포넌트 마운트 시 목록 불러오기
    useEffect(() => {
        fetchInquiries();
    }, []);

    // 💡 1. 문의 목록 불러오기 API 호출
    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch("/api/v1/inquiries", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log(token);

            // 💡 [추가] 토큰 만료(401) 시 자동 로그인 페이지로 안내
            if (res.status === 401) {
                localStorage.removeItem("admin_token");
                alert("로그인 세션이 만료되었습니다. 다시 로그인해 주세요.");
                window.location.href = "/garnet-adm/login";
                return;
            }

            if (!res.ok) {
                throw new Error("문의 목록을 불러오지 못했습니다.");
            }

            const data = await res.json();
            setInquiries(data);
        } catch (error) {
            console.error(error);
            alert("문의 내역을 불러오는 중 오류가 발생했습니다. 로그인 세션을 확인해 주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    // 💡 2. 처리 상태 토글 API 호출 (미처리 ↔ 처리완료)
    const handleToggleResolve = async (id: number) => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/v1/inquiries/${id}/resolve`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("상태 변경에 실패했습니다.");

            const updated = await res.json();

            // 목록 State 실시간 반영
            setInquiries(prev => prev.map(item => item.id === id ? updated : item));

            // 모달이 열려 있다면 모달 데이터도 실시간 반영
            if (selectedInquiry && selectedInquiry.id === id) {
                setSelectedInquiry(updated);
            }
        } catch (error) {
            console.error(error);
            alert("상태 변경 중 오류가 발생했습니다.");
        }
    };

    // 💡 3. 문의 삭제 API 호출
    const handleDelete = async (id: number) => {
        if (!window.confirm("이 문의 내역을 정말 삭제하시겠습니까? (되돌릴 수 없습니다)")) {
            return;
        }

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/v1/inquiries/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("삭제에 실패했습니다.");

            setInquiries(prev => prev.filter(item => item.id !== id));
            if (selectedInquiry?.id === id) {
                setSelectedInquiry(null);
            }
            alert("삭제되었습니다.");
        } catch (error) {
            console.error(error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 💡 통계 계산
    const totalCount = inquiries.length;
    const pendingCount = inquiries.filter(i => !i.is_resolved).length;
    const resolvedCount = inquiries.filter(i => i.is_resolved).length;

    // 💡 검색 및 상태 필터링
    const filteredInquiries = inquiries.filter(item => {
        const matchesSearch =
            item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone.includes(searchTerm);

        if (statusFilter === "PENDING") return matchesSearch && !item.is_resolved;
        if (statusFilter === "RESOLVED") return matchesSearch && item.is_resolved;
        return matchesSearch;
    });

    return (
        <div className="space-y-6">

            {/* 상단 타이틀 및 새로고침 */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">온라인 문의 접수함</h1>
                    <p className="text-slate-500 text-sm mt-1">고객이 홈페이지를 통해 남긴 도입 및 견적 문의를 확인하고 관리합니다.</p>
                </div>
                <button
                    onClick={fetchInquiries}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium transition-all shadow-sm cursor-pointer"
                >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                    새로고침
                </button>
            </div>

            {/* 💡 요약 통계 위젯 카드 3종 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    onClick={() => setStatusFilter("ALL")}
                    className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer shadow-sm ${statusFilter === "ALL" ? "border-slate-800 ring-2 ring-slate-800/10" : "border-slate-100 hover:border-slate-300"}`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-500">전체 문의</span>
                        <span className="p-2 bg-slate-100 text-slate-700 rounded-xl"><Calendar size={18} /></span>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{totalCount}<span className="text-base font-normal text-slate-400 ml-1">건</span></div>
                </div>

                <div
                    onClick={() => setStatusFilter("PENDING")}
                    className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer shadow-sm ${statusFilter === "PENDING" ? "border-[#C1121F] ring-2 ring-red-500/10" : "border-slate-100 hover:border-red-200"}`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-[#C1121F]">답변 대기 (미처리)</span>
                        <span className="p-2 bg-red-50 text-[#C1121F] rounded-xl"><Clock size={18} /></span>
                    </div>
                    <div className="text-3xl font-black text-[#C1121F]">{pendingCount}<span className="text-base font-normal text-slate-400 ml-1">건</span></div>
                </div>

                <div
                    onClick={() => setStatusFilter("RESOLVED")}
                    className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer shadow-sm ${statusFilter === "RESOLVED" ? "border-emerald-600 ring-2 ring-emerald-500/10" : "border-slate-100 hover:border-emerald-200"}`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-emerald-600">처리 완료</span>
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={18} /></span>
                    </div>
                    <div className="text-3xl font-black text-emerald-600">{resolvedCount}<span className="text-base font-normal text-slate-400 ml-1">건</span></div>
                </div>
            </div>

            {/* 필터 탭 & 검색바 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* 상태 필터 버튼 그룹 */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                        <button
                            onClick={() => setStatusFilter("ALL")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${statusFilter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            전체 보기
                        </button>
                        <button
                            onClick={() => setStatusFilter("PENDING")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${statusFilter === "PENDING" ? "bg-white text-[#C1121F] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            미처리만 보기
                        </button>
                        <button
                            onClick={() => setStatusFilter("RESOLVED")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${statusFilter === "RESOLVED" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            완료건만 보기
                        </button>
                    </div>

                    {/* 실시간 검색창 */}
                    <div className="relative w-full md:w-72">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="회사명, 성함, 연락처 검색"
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                        />
                    </div>
                </div>

                {/* 문의 목록 테이블 */}
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-24 text-center font-bold text-slate-600">상태</TableHead>
                                <TableHead className="font-bold text-slate-600">회사 / 기관명</TableHead>
                                <TableHead className="font-bold text-slate-600">담당자</TableHead>
                                <TableHead className="font-bold text-slate-600">연락처</TableHead>
                                <TableHead className="font-bold text-slate-600 max-w-xs">문의 내용 미리보기</TableHead>
                                <TableHead className="w-36 text-center font-bold text-slate-600">접수일시</TableHead>
                                <TableHead className="w-24 text-center font-bold text-slate-600">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-16 text-slate-400">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={28} />
                                        문의 내역을 불러오는 중입니다...
                                    </TableCell>
                                </TableRow>
                            ) : filteredInquiries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-16 text-slate-400">
                                        접수된 문의 내역이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInquiries.map((inquiry) => (
                                    <TableRow
                                        key={inquiry.id}
                                        onClick={() => setSelectedInquiry(inquiry)}
                                        className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                                    >
                                        {/* 상태 뱃지 */}
                                        <TableCell className="text-center">
                                            {inquiry.is_resolved ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    완료
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-[#C1121F] border border-red-200">
                                                    미처리
                                                </span>
                                            )}
                                        </TableCell>

                                        {/* 회사명 */}
                                        <TableCell className="font-bold text-slate-900">
                                            {inquiry.company_name}
                                        </TableCell>

                                        {/* 담당자 성함 */}
                                        <TableCell className="text-slate-700">
                                            {inquiry.author_name}
                                        </TableCell>

                                        {/* 연락처 */}
                                        <TableCell className="text-slate-600 text-sm">
                                            {inquiry.phone}
                                        </TableCell>

                                        {/* 내용 요약 (말줄임) */}
                                        <TableCell className="text-slate-500 text-sm max-w-xs truncate">
                                            {inquiry.message}
                                        </TableCell>

                                        {/* 접수일시 */}
                                        <TableCell className="text-center text-slate-400 text-xs whitespace-nowrap">
                                            {new Date(inquiry.created_at).toLocaleDateString()} {new Date(inquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>

                                        {/* 액션 버튼 */}
                                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => setSelectedInquiry(inquiry)}
                                                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                                                    title="상세보기"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(inquiry.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                                                    title="삭제"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* ✨ 문의 상세 보기 모달 팝업 */}
            {selectedInquiry && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedInquiry(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 닫기 버튼 */}
                        <button
                            onClick={() => setSelectedInquiry(null)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* 모달 헤더: 회사명 및 상태 */}
                        <div className="border-b border-slate-100 pb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="p-2 bg-slate-100 text-slate-800 rounded-xl"><Building2 size={24} /></span>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedInquiry.company_name}</h2>
                                    <p className="text-slate-400 text-xs">접수번호 #{selectedInquiry.id} • {new Date(selectedInquiry.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* 고객 인적사항 카드 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div>
                                <span className="text-xs font-bold text-slate-400 block mb-1">담당자 성함</span>
                                <span className="font-bold text-slate-800 text-base">{selectedInquiry.author_name}</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-400 block mb-1">연락처</span>
                                <a
                                    href={`tel:${selectedInquiry.phone}`}
                                    className="font-bold text-[#C1121F] hover:underline flex items-center gap-1.5"
                                >
                                    <Phone size={14} /> {selectedInquiry.phone}
                                </a>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-xs font-bold text-slate-400 block mb-1">이메일 주소</span>
                                <a
                                    href={`mailto:${selectedInquiry.email}?subject=[가넷정보기술] ${selectedInquiry.company_name} 문의 건 답변드립니다.`}
                                    className="font-bold text-blue-600 hover:underline flex items-center gap-1.5"
                                >
                                    <Mail size={14} /> {selectedInquiry.email}
                                </a>
                            </div>
                        </div>

                        {/* 문의 내용 전문 */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-700">문의 내용</h4>
                            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed text-sm min-h-[120px]">
                                {selectedInquiry.message}
                            </div>
                        </div>

                        {/* 모달 하단 버튼 액션 */}
                        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                            {/* 처리 상태 변경 버튼 */}
                            <button
                                type="button"
                                onClick={() => handleToggleResolve(selectedInquiry.id)}
                                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedInquiry.is_resolved
                                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-700/20"
                                    }`}
                            >
                                <CheckCircle2 size={16} />
                                {selectedInquiry.is_resolved ? "미처리 상태로 되돌리기" : "처리 완료(답변 완료)로 표시"}
                            </button>

                            {/* 닫기 버튼 */}
                            <button
                                type="button"
                                onClick={() => setSelectedInquiry(null)}
                                className="w-full sm:w-auto px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm transition-all cursor-pointer"
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
