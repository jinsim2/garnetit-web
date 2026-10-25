"use client";

import { useState, useEffect, useRef } from "react";
import {
    Download as DownloadIcon,
    Search,
    Plus,
    FileText,
    FileArchive,
    FileCode,
    FileDown,
    Edit3,
    Trash2,
    Loader2,
    RefreshCw,
    X,
    CheckCircle2,
    UploadCloud,
    FolderArchive
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 자료실 데이터 규격
interface DownloadItem {
    id: number;
    title: string;
    category: string;
    description?: string | null;
    file_url: string;
    file_name: string;
    file_size: string;
    file_ext: string;
    download_count: number;
    is_published: boolean;
    created_at: string;
}

const CATEGORIES = ["카탈로그", "매뉴얼", "소프트웨어", "드라이버", "기술문서", "기타"];

export default function DownloadsManagePage() {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("전체");

    // 모달 상태 (작성/수정)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // 숨겨진 파일 인풋 참조
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 폼 입력 State
    const [formData, setFormData] = useState({
        title: "",
        category: "카탈로그",
        description: "",
        file_url: "",
        file_name: "",
        file_size: "",
        file_ext: "",
        is_published: true,
    });

    // 컴포넌트 마운트 시 자료 목록 불러오기
    useEffect(() => {
        fetchDownloads();
    }, []);

    // 💡 1. 자료실 목록 API 호출
    const fetchDownloads = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch("/api/v1/downloads", {
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

            if (!res.ok) throw new Error("자료 목록을 불러오지 못했습니다.");
            const data = await res.json();
            setDownloads(data);
        } catch (error) {
            console.error("자료 목록 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 💡 2. 실제 파일 업로드 핸들러 (파일 선택 시 자동 실행)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 파일 크기 포맷팅 (KB 또는 MB)
            let formattedSize = "";
            if (file.size < 1024 * 1024) {
                formattedSize = (file.size / 1024).toFixed(1) + " KB";
            } else {
                formattedSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
            }

            // 파일 확장자 추출 (대문자)
            const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";

            // 백엔드 업로드 API 호출
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const res = await fetch("/api/v1/upload", {
                method: "POST",
                body: uploadFormData,
            });

            if (!res.ok) throw new Error("파일 업로드에 실패했습니다.");
            const data = await res.json();

            // 업로드된 파일 정보 폼 State에 자동 반영
            setFormData(prev => ({
                ...prev,
                file_url: data.url,
                file_name: file.name,
                file_size: formattedSize,
                file_ext: ext,
            }));
        } catch (error) {
            console.error("파일 업로드 오류:", error);
            alert("파일 업로드 중 오류가 발생했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    // 💡 3. 작성/수정 모달 열기 핸들러
    const handleOpenModal = (item?: DownloadItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                category: item.category,
                description: item.description || "",
                file_url: item.file_url,
                file_name: item.file_name,
                file_size: item.file_size,
                file_ext: item.file_ext,
                is_published: item.is_published,
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: "",
                category: "카탈로그",
                description: "",
                file_url: "",
                file_name: "",
                file_size: "",
                file_ext: "",
                is_published: true,
            });
        }
        setIsModalOpen(true);
    };

    // 💡 4. 자료 정보 저장 (POST 또는 PUT)
    const handleSaveDownload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert("자료 제목을 입력해 주세요.");
            return;
        }
        if (!formData.file_url) {
            alert("다운로드할 첨부파일을 업로드해 주세요.");
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem("admin_token");
            const url = editingItem ? `/api/v1/downloads/${editingItem.id}` : "/api/v1/downloads";
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("자료 저장에 실패했습니다.");

            alert(editingItem ? "자료 정보가 성공적으로 수정되었습니다." : "새 자료가 성공적으로 등록되었습니다.");
            setIsModalOpen(false);
            fetchDownloads();
        } catch (error) {
            console.error("저장 오류:", error);
            alert("처리 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    // 💡 5. 자료 삭제
    const handleDeleteDownload = async (id: number, title: string) => {
        if (!confirm(`'${title}' 자료를 정말 삭제하시겠습니까?`)) return;

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/v1/downloads/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("삭제에 실패했습니다.");

            alert("자료가 삭제되었습니다.");
            setDownloads(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 확장자에 따른 아이콘 도우미
    const renderExtBadge = (ext: string) => {
        const upper = ext.toUpperCase();
        let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
        if (upper === "PDF") colorClass = "bg-red-50 text-red-700 border-red-200";
        else if (upper === "ZIP" || upper === "RAR") colorClass = "bg-amber-50 text-amber-700 border-amber-200";
        else if (upper === "EXE") colorClass = "bg-blue-50 text-blue-700 border-blue-200";

        return (
            <span className={`px-2 py-0.5 text-[11px] font-black rounded border ${colorClass}`}>
                {upper}
            </span>
        );
    };

    // 필터링
    const filteredDownloads = downloads.filter(d => {
        const matchesCategory = selectedCategory === "전체" || d.category === selectedCategory;
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.file_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // 3단 통계 계산
    const totalCount = downloads.length;
    const totalDownloads = downloads.reduce((acc, cur) => acc + cur.download_count, 0);
    const publishedCount = downloads.filter(d => d.is_published).length;

    return (
        <div className="space-y-6">
            {/* 페이지 타이틀 & 새 자료 등록 버튼 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <DownloadIcon className="text-[#C1121F]" /> 자료실 관리
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        고객에게 제공할 카탈로그, 매뉴얼, 소프트웨어, 드라이버 파일을 업로드하고 관리합니다.
                    </p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-[#C1121F] hover:bg-[#a00e1a] text-white font-bold rounded-xl shadow-lg shadow-[#C1121F]/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                >
                    <Plus size={18} /> 새 자료 등록
                </button>
            </div>

            {/* 3단 요약 통계 위젯 (표준 규격 100% 일치) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. 전체 등록 자료 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-500">전체 등록 자료</span>
                        <span className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
                            <FolderArchive size={18} />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        {totalCount}<span className="text-base font-normal text-slate-400 ml-1">건</span>
                    </div>
                </div>

                {/* 2. 총 다운로드 횟수 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-blue-600">누적 다운로드</span>
                        <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <FileDown size={18} />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-blue-600">
                        {totalDownloads.toLocaleString()}<span className="text-base font-normal text-slate-400 ml-1">회</span>
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
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                    {/* 카테고리 셀렉터 */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                    >
                        <option value="전체">전체 카테고리</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* 검색 인풋 */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="자료 제목 또는 파일명 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={fetchDownloads}
                    disabled={isLoading}
                    className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer self-end sm:self-auto"
                    title="새로고침"
                >
                    <RefreshCw size={18} className={isLoading ? "animate-spin text-[#C1121F]" : ""} />
                </button>
            </div>

            {/* 자료실 목록 테이블 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-24 text-center font-bold text-slate-600">분류</TableHead>
                            <TableHead className="font-bold text-slate-600">자료 제목</TableHead>
                            <TableHead className="w-56 font-bold text-slate-600">첨부 파일 / 용량</TableHead>
                            <TableHead className="w-28 text-center font-bold text-slate-600">다운로드</TableHead>
                            <TableHead className="w-24 text-center font-bold text-slate-600">공개 여부</TableHead>
                            <TableHead className="w-28 text-center font-bold text-slate-600">등록일</TableHead>
                            <TableHead className="w-24 text-center font-bold text-slate-600">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="animate-spin text-[#C1121F]" size={28} />
                                        <span>자료 목록을 불러오는 중입니다...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredDownloads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-slate-400">
                                    등록된 자료가 없습니다. 새 자료를 등록해 보세요!
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDownloads.map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                    {/* 분류 뱃지 */}
                                    <TableCell className="text-center font-medium">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                                            {item.category}
                                        </span>
                                    </TableCell>

                                    {/* 자료 제목 */}
                                    <TableCell>
                                        <div
                                            onClick={() => handleOpenModal(item)}
                                            className="font-bold text-slate-800 hover:text-[#C1121F] cursor-pointer transition-colors"
                                        >
                                            {item.title}
                                        </div>
                                    </TableCell>

                                    {/* 첨부 파일 & 용량 */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {renderExtBadge(item.file_ext)}
                                            <a
                                                href={item.file_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                download={item.file_name}
                                                className="text-xs font-semibold text-slate-600 hover:text-blue-600 truncate max-w-[160px]"
                                                title={item.file_name}
                                            >
                                                {item.file_name}
                                            </a>
                                            <span className="text-[11px] text-slate-400">({item.file_size})</span>
                                        </div>
                                    </TableCell>

                                    {/* 다운로드 수 */}
                                    <TableCell className="text-center text-slate-600 font-semibold text-sm">
                                        {item.download_count.toLocaleString()}회
                                    </TableCell>

                                    {/* 공개 상태 */}
                                    <TableCell className="text-center">
                                        {item.is_published ? (
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">공개</span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">비공개</span>
                                        )}
                                    </TableCell>

                                    {/* 등록일 */}
                                    <TableCell className="text-center text-slate-400 text-xs">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </TableCell>

                                    {/* 관리 버튼 */}
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="수정"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDownload(item.id, item.title)}
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

            {/* 📝 자료 등록/수정 모달 */}
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
                                <DownloadIcon className="text-[#C1121F]" />
                                {editingItem ? "자료 정보 수정" : "새 자료 등록"}
                            </h2>
                            <p className="text-slate-400 text-xs mt-1">
                                {editingItem ? `자료 #${editingItem.id}의 정보를 수정합니다.` : "카탈로그, 매뉴얼, 소프트웨어 파일을 업로드하여 등록합니다."}
                            </p>
                        </div>

                        {/* 폼 본문 */}
                        <form onSubmit={handleSaveDownload} className="space-y-5">
                            {/* 자료 분류 & 공개 여부 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">
                                        자료 분류 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center pt-5">
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
                            </div>

                            {/* 자료 제목 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    자료 제목 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="예) 2026 통합 보안 솔루션 카탈로그"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                />
                            </div>

                            {/* 💡 파일 업로드 영역 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    첨부 파일 <span className="text-red-500">*</span>
                                </label>

                                {/* 숨겨진 진짜 파일 인풋 */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {/* 파일 업로드 박스 */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 hover:border-[#C1121F]/50 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group"
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                                            <Loader2 size={32} className="animate-spin text-[#C1121F]" />
                                            <span className="text-sm font-bold">서버로 파일을 전송 중입니다...</span>
                                        </div>
                                    ) : formData.file_url ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-800">{formData.file_name}</p>
                                                <p className="text-xs text-slate-400">용량: {formData.file_size} • 확장자: {formData.file_ext} (클릭하여 파일 교체)</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                                            <div className="p-3 bg-slate-100 group-hover:bg-[#C1121F]/10 group-hover:text-[#C1121F] rounded-2xl transition-colors">
                                                <UploadCloud size={30} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-700">이곳을 클릭하여 파일을 선택하세요</span>
                                                <p className="text-xs text-slate-400 mt-1">PDF, ZIP, EXE, HWP, DOCX 등 모든 형식 지원</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 자료 상세 설명 (선택) */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    자료 상세 설명 (선택)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="자료에 대한 간략한 안내나 변경사항을 적어주세요."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                    disabled={isSaving || isUploading}
                                    className="px-6 py-2.5 bg-[#C1121F] hover:bg-[#a00e1a] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#C1121F]/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                                    {editingItem ? "수정 완료" : "자료 등록"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
