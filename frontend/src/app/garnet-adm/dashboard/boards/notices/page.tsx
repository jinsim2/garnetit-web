"use client";

import { useState, useEffect } from "react";
import {
    Megaphone,
    Search,
    Plus,
    Pin,
    Eye,
    Edit3,
    Trash2,
    Calendar,
    Loader2,
    RefreshCw,
    X,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 공지사항 데이터 타입 규격
interface Notice {
    id: number;
    title: string;
    content: string;
    is_pinned: boolean;
    is_published: boolean;
    view_count: number;
    created_at: string;
}

export default function NoticesManagePage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // 모달 상태 (작성/수정)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // 폼 입력 State
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        is_pinned: false,
        is_published: true,
    });

    // 컴포넌트 마운트 시 공지 목록 불러오기
    useEffect(() => {
        fetchNotices();
    }, []);

    // 💡 1. 공지사항 목록 API 호출
    const fetchNotices = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch("/api/v1/notices", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                localStorage.removeItem("admin_token");
                alert("로그인 세션이 만료되었습니다. 다시 로그인해 주세요.");
                window.location.href = "/garnet-adm/login";
                return;
            }

            if (!res.ok) throw new Error("공지 목록을 불러오지 못했습니다.");
            const data = await res.json();
            setNotices(data);
        } catch (error) {
            console.error("공지 목록 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 💡 2. 작성/수정 모달 열기 핸들러
    const handleOpenModal = (notice?: Notice) => {
        if (notice) {
            // 수정 모드
            setEditingNotice(notice);
            setFormData({
                title: notice.title,
                content: notice.content,
                is_pinned: notice.is_pinned,
                is_published: notice.is_published,
            });
        } else {
            // 신규 작성 모드
            setEditingNotice(null);
            setFormData({
                title: "",
                content: "",
                is_pinned: false,
                is_published: true,
            });
        }
        setIsModalOpen(true);
    };

    // 💡 3. 공지 저장 (신규 등록 POST 또는 수정 PUT)
    const handleSaveNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert("공지사항 제목을 입력해 주세요.");
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem("admin_token");
            const url = editingNotice ? `/api/v1/notices/${editingNotice.id}` : "/api/v1/notices";
            const method = editingNotice ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("공지사항 저장에 실패했습니다.");

            alert(editingNotice ? "공지사항이 성공적으로 수정되었습니다." : "새 공지사항이 등록되었습니다.");
            setIsModalOpen(false);
            fetchNotices(); // 목록 갱신
        } catch (error) {
            console.error("저장 오류:", error);
            alert("처리 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    // 💡 4. 공지사항 삭제
    const handleDeleteNotice = async (id: number, title: string) => {
        if (!confirm(`'${title}' 공지사항을 정말 삭제하시겠습니까?`)) return;

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/v1/notices/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("삭제에 실패했습니다.");

            alert("공지사항이 삭제되었습니다.");
            setNotices(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 검색 필터링
    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 통계 계산
    const totalCount = notices.length;
    const pinnedCount = notices.filter(n => n.is_pinned).length;
    const publishedCount = notices.filter(n => n.is_published).length;

    return (
        <div className="space-y-6">
            {/* 페이지 타이틀 & 새 공지 작성 버튼 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Megaphone className="text-[#C1121F]" /> 공지사항 관리
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        홈페이지에 게시되는 공지사항과 중요 알림을 등록, 수정, 관리합니다.
                    </p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-[#C1121F] hover:bg-[#a00e1a] text-white font-bold rounded-xl shadow-lg shadow-[#C1121F]/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                >
                    <Plus size={18} /> 새 공지 작성
                </button>
            </div>

            {/* 3단 요약 통계 위젯 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. 전체 등록 공지 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-500">전체 등록 공지</span>
                        <span className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
                            <Megaphone size={18} />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {totalCount}<span className="text-base font-normal text-slate-400 ml-1">건</span>
                    </div>
                </div>
                {/* 2. 상단 고정 중요 공지 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-amber-600">상단 고정 (중요)</span>
                        <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                            <Pin size={18} />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-amber-600">
                        {pinnedCount}<span className="text-base font-normal text-slate-400 ml-1">건</span>
                    </div>
                </div>
                {/* 3. 홈페이지 공개 중 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-emerald-600">홈페이지 공개 중</span>
                        <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CheckCircle2 size={18} />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-emerald-600">
                        {publishedCount}<span className="text-base font-normal text-slate-400 ml-1">건</span>
                    </div>
                </div>
            </div>

            {/* 검색 바 & 새로고침 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="공지 제목이나 내용 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                    />
                </div>

                <button
                    onClick={fetchNotices}
                    disabled={isLoading}
                    className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    title="새로고침"
                >
                    <RefreshCw size={18} className={isLoading ? "animate-spin text-[#C1121F]" : ""} />
                </button>
            </div>

            {/* 공지사항 목록 테이블 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-16 text-center font-bold text-slate-600">구분</TableHead>
                            <TableHead className="font-bold text-slate-600">제목</TableHead>
                            <TableHead className="w-24 text-center font-bold text-slate-600">조회수</TableHead>
                            <TableHead className="w-24 text-center font-bold text-slate-600">공개 여부</TableHead>
                            <TableHead className="w-32 text-center font-bold text-slate-600">등록일</TableHead>
                            <TableHead className="w-28 text-center font-bold text-slate-600">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="animate-spin text-[#C1121F]" size={28} />
                                        <span>공지사항을 불러오는 중입니다...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredNotices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                                    등록된 공지사항이 없습니다. 새 공지를 작성해 보세요!
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredNotices.map((notice) => (
                                <TableRow key={notice.id} className="hover:bg-slate-50/80 transition-colors">
                                    {/* 구분 (상단고정 핀 또는 ID) */}
                                    <TableCell className="text-center font-medium">
                                        {notice.is_pinned ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">
                                                <Pin size={12} className="fill-amber-800" /> 공지
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">#{notice.id}</span>
                                        )}
                                    </TableCell>

                                    {/* 공지 제목 */}
                                    <TableCell>
                                        <div
                                            onClick={() => handleOpenModal(notice)}
                                            className="font-bold text-slate-800 hover:text-[#C1121F] cursor-pointer transition-colors"
                                        >
                                            {notice.title}
                                        </div>
                                    </TableCell>

                                    {/* 조회수 */}
                                    <TableCell className="text-center text-slate-500 text-sm">
                                        {notice.view_count.toLocaleString()}
                                    </TableCell>

                                    {/* 공개 상태 */}
                                    <TableCell className="text-center">
                                        {notice.is_published ? (
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">공개</span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">비공개</span>
                                        )}
                                    </TableCell>

                                    {/* 등록일 */}
                                    <TableCell className="text-center text-slate-400 text-xs">
                                        {new Date(notice.created_at).toLocaleDateString()}
                                    </TableCell>

                                    {/* 관리 버튼 (수정, 삭제) */}
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => handleOpenModal(notice)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="수정"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNotice(notice.id, notice.title)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

            {/* 📝 공지사항 등록/수정 모달 */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 닫기 버튼 */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* 모달 헤더 */}
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Megaphone className="text-[#C1121F]" />
                                {editingNotice ? "공지사항 수정" : "새 공지사항 작성"}
                            </h2>
                            <p className="text-slate-400 text-xs mt-1">
                                {editingNotice ? `공지사항 #${editingNotice.id}의 내용을 수정합니다.` : "홈페이지에 공개될 새로운 공지사항을 등록합니다."}
                            </p>
                        </div>

                        {/* 폼 본문 */}
                        <form onSubmit={handleSaveNotice} className="space-y-5">
                            {/* 옵션 스위치 (상단 고정 & 공개 여부) */}
                            <div className="flex flex-wrap gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_pinned}
                                        onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                                        className="w-4 h-4 text-[#C1121F] rounded border-slate-300 focus:ring-[#C1121F]"
                                    />
                                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                        <Pin size={14} className="text-amber-600" /> 상단 고정 (중요 공지)
                                    </span>
                                </label>

                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="w-4 h-4 text-[#C1121F] rounded border-slate-300 focus:ring-[#C1121F]"
                                    />
                                    <span className="text-sm font-bold text-slate-700">
                                        홈페이지에 공개 노출
                                    </span>
                                </label>
                            </div>

                            {/* 공지 제목 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    공지 제목 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="예) [안내] 2026년 파트너사 등급 유지 안내"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                />
                            </div>

                            {/* 공지 본문 내용 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    공지 내용 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={10}
                                    placeholder="공지사항 본문 내용을 상세히 작성하세요..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                />
                            </div>

                            {/* 하단 저장 버튼 */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all cursor-pointer"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-[#C1121F] hover:bg-[#a00e1a] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#C1121F]/20 flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                                    {editingNotice ? "수정 완료" : "공지사항 등록"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
