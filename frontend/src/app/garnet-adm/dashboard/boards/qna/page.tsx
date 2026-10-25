"use client";

import { useState, useEffect } from "react";
import {
    HelpCircle,
    Search,
    Plus,
    Edit3,
    Trash2,
    Loader2,
    RefreshCw,
    X,
    CheckCircle2,
    Layers,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// FAQ 데이터 타입 규격
interface FaqItem {
    id: number;
    category: string;
    question: string;
    answer: string;
    sort_order: number;
    is_published: boolean;
    created_at: string;
}

const CATEGORIES = ["제품/기술", "도입/견적", "유지보수", "구매/계약", "기타"];

export default function QnaManagePage() {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("전체");

    // 답변 미리보기 펼침 상태 (faq id 배열)
    const [expandedIds, setExpandedIds] = useState<number[]>([]);

    // 모달 상태 (작성/수정)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // 폼 입력 State
    const [formData, setFormData] = useState({
        category: "제품/기술",
        question: "",
        answer: "",
        sort_order: 0,
        is_published: true,
    });

    // 컴포넌트 마운트 시 FAQ 목록 불러오기
    useEffect(() => {
        fetchFaqs();
    }, []);

    // 💡 1. FAQ 목록 API 호출 (관리자는 비공개 항목도 모두 확인)
    const fetchFaqs = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch("/api/v1/faqs?include_unpublished=true", {
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

            if (!res.ok) throw new Error("FAQ 목록을 불러오지 못했습니다.");
            const data = await res.json();
            setFaqs(data);
        } catch (error) {
            console.error("FAQ 목록 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 💡 2. 모달 열기 핸들러 (신규 등록 또는 수정)
    const handleOpenModal = (item?: FaqItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                category: item.category,
                question: item.question,
                answer: item.answer,
                sort_order: item.sort_order,
                is_published: item.is_published,
            });
        } else {
            setEditingItem(null);
            setFormData({
                category: "제품/기술",
                question: "",
                answer: "",
                sort_order: 0,
                is_published: true,
            });
        }
        setIsModalOpen(true);
    };

    // 💡 3. FAQ 저장 (신규 등록 POST 또는 수정 PUT)
    const handleSaveFaq = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.question.trim()) {
            alert("질문 내용을 입력해 주세요.");
            return;
        }
        if (!formData.answer.trim()) {
            alert("답변 내용을 입력해 주세요.");
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem("admin_token");
            const url = editingItem ? `/api/v1/faqs/${editingItem.id}` : "/api/v1/faqs";
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("FAQ 저장에 실패했습니다.");

            alert(editingItem ? "FAQ가 성공적으로 수정되었습니다." : "새 FAQ가 성공적으로 등록되었습니다.");
            setIsModalOpen(false);
            fetchFaqs();
        } catch (error) {
            console.error("저장 오류:", error);
            alert("처리 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    // 💡 4. FAQ 삭제
    const handleDeleteFaq = async (id: number, question: string) => {
        if (!confirm(`'${question}' FAQ를 정말 삭제하시겠습니까?`)) return;

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/v1/faqs/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("삭제에 실패했습니다.");

            alert("FAQ 항목이 삭제되었습니다.");
            setFaqs(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 답변 펼치기/접기 토글
    const toggleExpand = (id: number) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // 필터링된 목록
    const filteredFaqs = faqs.filter(item => {
        const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
        const matchesSearch =
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // 3단 통계 계산
    const totalCount = faqs.length;
    const categoryCount = new Set(faqs.map(f => f.category)).size;
    const publishedCount = faqs.filter(f => f.is_published).length;

    return (
        <div className="space-y-6">
            {/* 페이지 타이틀 & 새 FAQ 등록 버튼 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <HelpCircle className="text-[#C1121F]" /> 묻고 답하기 (FAQ) 관리
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        고객지원 페이지에 노출되는 자주 묻는 질문과 답변을 등록, 수정, 관리합니다.
                    </p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-[#C1121F] hover:bg-[#a00e1a] text-white font-bold rounded-xl shadow-lg shadow-[#C1121F]/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                >
                    <Plus size={18} /> 새 FAQ 등록
                </button>
            </div>

            {/* 3단 요약 통계 위젯 (일관 규격 완벽 적용) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. 전체 등록 FAQ */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-500">전체 등록 FAQ</span>
                        <span className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
                            <HelpCircle size={18} />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {totalCount}<span className="text-base font-normal text-slate-400 ml-1">건</span>
                    </div>
                </div>

                {/* 2. 등록 카테고리 수 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-blue-600">등록 카테고리</span>
                        <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Layers size={18} />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-blue-600">
                        {categoryCount}<span className="text-base font-normal text-slate-400 ml-1">종</span>
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

            {/* 검색 & 카테고리 필터 바 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
                    {/* 카테고리 선택 */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                    >
                        <option value="전체">전체 카테고리</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* 검색어 입력창 */}
                    <div className="relative w-full flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="질문 또는 답변 내용 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                        />
                    </div>
                </div>

                {/* 새로고침 버튼 */}
                <button
                    onClick={fetchFaqs}
                    className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all self-end sm:self-auto cursor-pointer"
                    title="목록 새로고침"
                >
                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* FAQ 목록 테이블 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/80">
                        <TableRow>
                            <TableHead className="w-[80px] text-center font-bold text-slate-600">순서</TableHead>
                            <TableHead className="w-[120px] text-center font-bold text-slate-600">분류</TableHead>
                            <TableHead className="font-bold text-slate-600">질문 및 답변</TableHead>
                            <TableHead className="w-[100px] text-center font-bold text-slate-600">상태</TableHead>
                            <TableHead className="w-[120px] text-center font-bold text-slate-600">등록일</TableHead>
                            <TableHead className="w-[120px] text-center font-bold text-slate-600">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="animate-spin text-[#C1121F]" size={28} />
                                        <span className="text-sm">FAQ 목록을 불러오는 중입니다...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredFaqs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-slate-400 text-sm">
                                    {searchTerm || selectedCategory !== "전체"
                                        ? "검색 조건과 일치하는 FAQ가 없습니다."
                                        : "등록된 FAQ가 없습니다. 상단의 '+ 새 FAQ 등록' 버튼을 눌러 추가해 보세요."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredFaqs.map((item) => {
                                const isExpanded = expandedIds.includes(item.id);
                                return (
                                    <>
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                                            onClick={() => toggleExpand(item.id)}
                                        >
                                            {/* 정렬 순서 */}
                                            <TableCell className="text-center font-bold text-slate-400 text-xs">
                                                {item.sort_order}
                                            </TableCell>

                                            {/* 카테고리 뱃지 */}
                                            <TableCell className="text-center">
                                                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700">
                                                    {item.category}
                                                </span>
                                            </TableCell>

                                            {/* 질문 내용 */}
                                            <TableCell>
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-[#C1121F] bg-red-50 px-1.5 py-0.5 rounded">Q</span>
                                                        <span className="font-semibold text-slate-800 text-sm hover:text-[#C1121F] transition-colors">
                                                            {item.question}
                                                        </span>
                                                    </div>
                                                    <span className="text-slate-400 p-1">
                                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* 공개 여부 뱃지 */}
                                            <TableCell className="text-center">
                                                {item.is_published ? (
                                                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-700">
                                                        공개
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 text-slate-400">
                                                        비공개
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* 작성일 */}
                                            <TableCell className="text-center text-xs text-slate-400">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </TableCell>

                                            {/* 수정 / 삭제 버튼 */}
                                            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleOpenModal(item)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                        title="수정"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFaq(item.id, item.question)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="삭제"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* 질문 클릭 시 바로 펼쳐지는 답변 미리보기 행 */}
                                        {isExpanded && (
                                            <TableRow key={`${item.id}-answer`} className="bg-slate-50/70 border-b border-slate-100">
                                                <TableCell colSpan={6} className="py-4 px-12">
                                                    <div className="flex gap-3 bg-white p-4 rounded-xl border border-slate-200">
                                                        <span className="text-xs font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded h-fit">A</span>
                                                        <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                            {item.answer}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 💡 새 FAQ 등록 / 수정 모달 */}
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
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        {/* 모달 헤더 */}
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <HelpCircle className="text-[#C1121F]" />
                                {editingItem ? "FAQ 수정" : "새 FAQ 등록"}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                고객들이 자주 궁금해하는 질문과 명확한 답변을 작성해 주세요.
                            </p>
                        </div>

                        {/* 모달 폼 */}
                        <form onSubmit={handleSaveFaq} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 카테고리 선택 */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        카테고리 분류 <span className="text-[#C1121F]">*</span>
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 노출 순서 */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        노출 우선순위 (낮을수록 상단 노출)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* 질문 입력 */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    질문 (Q) <span className="text-[#C1121F]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="예: 유지보수 계약 기간 내에 무상 A/S가 가능한가요?"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                />
                            </div>

                            {/* 답변 입력 */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    답변 (A) <span className="text-[#C1121F]">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    placeholder="고객이 이해하기 쉽도록 친절하고 상세하게 답변 내용을 작성해 주세요."
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] resize-none"
                                />
                            </div>

                            {/* 공개 여부 체크박스 */}
                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="w-4 h-4 rounded text-[#C1121F] focus:ring-[#C1121F] border-slate-300"
                                    />
                                    <span className="text-sm font-semibold text-slate-700">홈페이지 고객지원에 즉시 공개</span>
                                </label>
                            </div>

                            {/* 저장 / 취소 버튼 */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-[#C1121F] hover:bg-[#a00e1a] text-white font-bold rounded-xl text-sm shadow-md shadow-[#C1121F]/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                    {editingItem ? "수정 완료" : "FAQ 등록하기"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
