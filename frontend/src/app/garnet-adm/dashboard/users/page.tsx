"use client";

import { useState, useEffect } from "react";
import { Users, ShieldCheck, UserCheck, KeyRound, Plus, Edit3, Trash2, RefreshCw, Loader2, X, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 관리자 계정 데이터 타입 규격 (백엔드 UserResponse의 1:1 매칭)
interface AdminUser {
    id: number;
    email: string;
    name: string;
    role: "SUPERADMIN" | "EDITOR";
    is_active: boolean;
    created_at: string;
}

export default function UsersPage() {
    const [myInfo, setMyInfo] = useState<AdminUser | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. [모달 A] 내 비밀번호 변경 모달 State
    const [isPwModalOpen, setIsPwModalOpen] = useState(false);
    const [isChangingPw, setIsChangingPw] = useState(false);
    const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm_password: "", });

    // 2. [모달 B] 관리자 추가/수정 모달 State
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [isSavingUser, setIsSavingUser] = useState(false);
    const [userForm, setUserForm] = useState({ email: "", name: "", password: "", role: "EDITOR" as "SUPERADMIN" | "EDITOR", is_active: true, });

    useEffect(() => {
        fetchInitialData();
    }, []);


    // 내 정보 조회 후, 최고관리자면 전체 계정 목록까지 연달아 조회
    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const headers = { Authorization: `Bearer ${token}` };

            const meRes = await fetch("/api/v1/users/me", { headers });

            if (meRes.status === 401) {
                localStorage.removeItem("admin_token");
                window.location.href = "/garnet-adm/login";
                return;
            }

            if (meRes.ok) {
                const meData: AdminUser = await meRes.json();
                setMyInfo(meData);

                // 최고관리자(SUPERADMIN)인 경우에만 전체 관리자 목록 조회
                if (meData.role === "SUPERADMIN") {
                    const listRes = await fetch("/api/v1/users", { headers });
                    if (listRes.ok) {
                        setUsers(await listRes.json());
                    }
                }
            }
        } catch (error) {
            console.error("관리자 정보 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // [기능 1] 내 비밀번호 변경 제출 핸들러
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwForm.new_password !== pwForm.confirm_password) {
            alert("새 비밀번호의 확인 비밀번호가 일치하지 않습니다.");
            return;
        }
        if (pwForm.new_password.length < 4) {
            alert("새 비밀번호는 최소 4자 이상 입력해주세요!");
            return;
        }

        setIsChangingPw(true);

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch("/api/v1/users/me/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: pwForm.current_password,
                    new_password: pwForm.new_password,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.detail || "비밀번호 변경에 실패했습니다.");
                return;
            }

            alert("비밀번호가 성공적으로 변경되었습니다.");
            setIsPwModalOpen(false);
            setPwForm({ current_password: "", new_password: "", confirm_password: "" });
        } catch (error) {
            console.error("비밀번호 변경 오류:", error);
            alert("서버 통신 중 오류가 발생했습니다.");
        } finally {
            setIsChangingPw(false);
        }
    }

    // [기능 2] 관리자 등록/수정 모달 열기
    const handleOpenUserModal = (target?: AdminUser) => {
        if (target) {
            setEditingUser(target);
            setUserForm({
                email: target.email,
                name: target.name,
                password: "", // 수정 시 비워두면 기존 비밀번호 유지
                role: target.role,
                is_active: target.is_active,
            });
        } else {
            setEditingUser(null);
            setUserForm({
                email: "",
                name: "",
                password: "",
                role: "EDITOR",
                is_active: true,
            });
        }
        setIsUserModalOpen(true);
    };

    // [기능 3] 관리자 등록(POST) 또는 수정(PUT) 저장
    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userForm.name.trim()) {
            alert("관리자 이름을 입력해 주세요.");
            return;
        }
        if (!editingUser && (!userForm.email.trim() || !userForm.password.trim())) {
            alert("신규 등록 시 이메일과 초기 비밀번호는 필수입니다.");
            return;
        }

        setIsSavingUser(true);
        try {
            const token = localStorage.getItem("admin_token");
            const url = editingUser ? `/api/v1/users/${editingUser.id}` : "/api/v1/users";
            const method = editingUser ? "PUT" : "POST";

            // 수정 모드일 때는 이메일을 제외한 필드(비밀번호는 입력했을 때만) 전송
            const payload = editingUser
                ? {
                    name: userForm.name,
                    role: userForm.role,
                    is_active: userForm.is_active,
                    ...(userForm.password.trim() ? { password: userForm.password } : {}),
                }
                : userForm;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.detail || "계정 저장에 실패했습니다.");
                return;
            }

            alert(editingUser ? "관리자 계정 정보가 수정되었습니다." : "새 관리자 계정이 등록되었습니다.");
            setIsUserModalOpen(false);
            fetchInitialData();
        } catch (error) {
            console.error("관리자 저장 오류: ", error);
            alert("서버와 통신하는 중 오류가 발생했습니다.");
        } finally {
            setIsSavingUser(false);
        }
    };

    // [기능 4] 관리자 계정 삭제(DELETE)
    const handleDeleteUser = async (target: AdminUser) => {
        if (target.id === myInfo?.id) {
            alert("현재 로그인 중인 본인 계정은 삭제할 수 없습니다.");
            return;
        }
        if (!confirm(`정말 '${target.name} (${target.email})' 관리자 계정을 삭제하시겠습니까? `)) return;

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/v1/users/${target.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.detail || "계정 삭제에 실패했습니다.");
                return;
            }

            alert("관리자 계정이 삭제되었습니다.");
            fetchInitialData();
        } catch (error) {
            console.error("계정 삭제 오류: ", error);
            alert("계정 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* 상단 헤더 바 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Users className="text-[#C1121F]" /> 관리자 계정 관리
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        현재 로그인된 계정의 비밀번호를 변경하거나 사내 담당자별 관리자 권한을 관리합니다.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchInitialData}
                        disabled={isLoading}
                        className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin text-[#C1121F]" : ""} />
                        새로고침
                    </button>

                    {myInfo?.role === "SUPERADMIN" && (
                        <button
                            onClick={() => handleOpenUserModal()}
                            className="px-5 py-2.5 bg-[#C1121F] hover:bg-[#9E0E19] text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                        >
                            <Plus size={18} /> 신규 관리자 등록
                        </button>
                    )}
                </div>
            </div>

            {/* 1. 내 계정 프로필 & 비밀번호 변경 카드(모든 관리자 공통) */}
            {myInfo && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                            <ShieldCheck size={28} className="text-[#C1121F]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-lg font-bold text-slate-900">{myInfo.name}</span>
                                <span
                                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${myInfo.role === "SUPERADMIN"
                                        ? "bg-red-50 text-[#C1121F] border border-red-200"
                                        : "bg-blue-50 text-blue-700 border border-blue-200"
                                        }`}
                                >
                                    {myInfo.role === "SUPERADMIN" ? "최고관리자(SUPERADMIN)" : "콘텐츠 관리자(EDITOR)"}
                                </span>
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    현재 로그인 중
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{myInfo.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsPwModalOpen(true)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer self-stretch md:self-auto"
                    >
                        <KeyRound size={16} /> 내 비밀번호 변경
                    </button>
                </div>
            )}

            {/* 2. 전체 관리자 목록 테이블(SUPERADMIN 전용) */}
            {myInfo?.role === "SUPERADMIN" ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">전체 등록 관리자 목록</h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                퇴사자 발생 시 계정을 비활성화하거나 삭제하여 보안을 유지하세요.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            총 {users.length}명
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                            <Loader2 className="animate-spin text-[#C1121F]" size={28} />
                            <p className="text-sm">관리자 목록을 불러오는 중입니다...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-16 text-center font-bold text-slate-600">ID</TableHead>
                                    <TableHead className="font-bold text-slate-600">이름</TableHead>
                                    <TableHead className="font-bold text-slate-600">로그인 이메일(ID)</TableHead>
                                    <TableHead className="w-40 text-center font-bold text-slate-600">권한 등급</TableHead>
                                    <TableHead className="w-28 text-center font-bold text-slate-600">상태</TableHead>
                                    <TableHead className="w-36 text-center font-bold text-slate-600">생성일</TableHead>
                                    <TableHead className="w-28 text-center font-bold text-slate-600">관리</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => {
                                    const isMe = u.id === myInfo.id;
                                    return (
                                        <TableRow key={u.id} className="hover:bg-slate-50/80">
                                            <TableCell className="text-center font-mono text-xs text-slate-400">
                                                #{u.id}
                                            </TableCell>
                                            <TableCell className="font-bold text-slate-800">
                                                <div className="flex items-center gap-2">
                                                    {u.name}
                                                    {isMe && (
                                                        <span className="text-[11px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                                                            나(본인)
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-600 text-sm">{u.email}</TableCell>
                                            <TableCell className="text-center">
                                                <span
                                                    className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${u.role === "SUPERADMIN"
                                                        ? "bg-red-50 text-[#C1121F]"
                                                        : "bg-blue-50 text-blue-700"
                                                        }`}
                                                >
                                                    {u.role === "SUPERADMIN" ? "최고관리자" : "일반 에디터"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {u.is_active ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                                        <CheckCircle2 size={12} /> 활성
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                                                        <AlertCircle size={12} /> 정지됨
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center text-xs text-slate-400">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleOpenUserModal(u)}
                                                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                        title="계정 정보 수정"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(u)}
                                                        disabled={isMe}
                                                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-25 disabled:pointer-events-none"
                                                        title={isMe ? "본인 계정은 삭제할 수 없습니다" : "계정 삭제"}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
            ) : (
                !isLoading && (
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center text-slate-500">
                        <Lock className="mx-auto mb-3 text-slate-400" size={28} />
                        <p className="font-bold text-slate-700">전체 관리자 계정 관리 권한 안내</p>
                        <p className="text-xs text-slate-400 mt-1">
                            다른 관리자의 계정을 생성하거나 삭제하는 기능은 최고관리자(SUPERADMIN)에게만 표시됩니다.
                        </p>
                    </div>
                )
            )}
            {/* 모달 A: 내 비밀번호 변경 모달 */}
            {isPwModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <KeyRound size={20} className="text-[#C1121F]" /> 내 비밀번호 변경
                            </h3>
                            <button
                                onClick={() => setIsPwModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordChange} className="space-y-4 mt-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">현재 비밀번호 *</label>
                                <input
                                    type="password"
                                    required
                                    value={pwForm.current_password}
                                    onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                                    placeholder="현재 사용 중인 비밀번호 입력"
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">새 비밀번호 *</label>
                                <input
                                    type="password"
                                    required
                                    value={pwForm.new_password}
                                    onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                                    placeholder="새 비밀번호 입력 (4자 이상)"
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">새 비밀번호 확인 *</label>
                                <input
                                    type="password"
                                    required
                                    value={pwForm.confirm_password}
                                    onChange={(e) => setPwForm({ ...pwForm, confirm_password: e.target.value })}
                                    placeholder="새 비밀번호 한 번 더 입력"
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsPwModalOpen(false)}
                                    className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isChangingPw}
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#C1121F] hover:bg-[#9E0E19] rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isChangingPw && <Loader2 size={16} className="animate-spin" />}
                                    변경 저장
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* 모달 B: 신규 관리자 등록 / 기존 관리자 수정 모달 */}
            {isUserModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <UserCheck size={20} className="text-[#C1121F]" />
                                {editingUser ? "관리자 계정 수정" : "신규 관리자 등록"}
                            </h3>
                            <button
                                onClick={() => setIsUserModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveUser} className="space-y-4 mt-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    로그인 이메일(ID) *
                                </label>
                                <input
                                    type="email"
                                    required
                                    disabled={!!editingUser}
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    placeholder="예: manager@garnetit.co.kr"
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] disabled:bg-slate-100 disabled:text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    이름 / 직책 *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={userForm.name}
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                    placeholder="예: 홍길동 대리 (기술지원팀)"
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    {editingUser ? "비밀번호 재설정 (변경 시에만 입력)" : "초기 비밀번호 *"}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    value={userForm.password}
                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                    placeholder={editingUser ? "비워두면 기존 비밀번호가 유지됩니다" : "초기 비밀번호 입력"}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">권한 등급</label>
                                <select
                                    value={userForm.role}
                                    disabled={editingUser?.id === myInfo?.id}
                                    onChange={(e) =>
                                        setUserForm({ ...userForm, role: e.target.value as "SUPERADMIN" | "EDITOR" })
                                    }
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] disabled:bg-slate-100"
                                >
                                    <option value="EDITOR">일반 에디터 (콘텐츠 관리 전용)</option>
                                    <option value="SUPERADMIN">최고관리자 (계정 관리 포함 모든 권한)</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs font-bold text-slate-700">계정 활성화 상태</span>
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        disabled={editingUser?.id === myInfo?.id}
                                        checked={userForm.is_active}
                                        onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })}
                                        className="w-4 h-4 accent-[#C1121F] rounded"
                                    />
                                    <span className="text-sm text-slate-700">
                                        {userForm.is_active ? "활성 (로그인 허용)" : "정지 (로그인 차단)"}
                                    </span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsUserModalOpen(false)}
                                    className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingUser}
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#C1121F] hover:bg-[#9E0E19] rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSavingUser && <Loader2 size={16} className="animate-spin" />}
                                    {editingUser ? "수정 저장" : "계정 생성"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}