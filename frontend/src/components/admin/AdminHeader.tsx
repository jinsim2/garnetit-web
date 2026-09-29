"use client";

import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import Link from "next/link"; // 모바일 메뉴용 링크
import { LogOut, Timer, User as UserIcon, Menu, Home } from "lucide-react"; // Menu 아이콘 추가!
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import { menuItems } from "@/components/admin/AdminSidebar"; // 사이드바에서 메뉴 목록 가져오기!

// 기존 AlertDialog
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// 새롭게 추가한 모바일 서랍(Sheet) 컴포넌트들
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminHeader() {
    const pathname = usePathname();
    const { formattedTime, handleLogout } = useIdleTimeout(10);
    const [adminName, setAdminName] = useState("로딩 중...");

    // 서랍이 열려있는지 닫혀있는지 기억하는 '상태(State)'를 만든다.
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchMyInfo = async () => {
            const token = localStorage.getItem("admin_token");
            if (!token) return;

            try {
                const res = await fetch("/api/v1/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAdminName(data.name);
                }
            } catch (error) {
                console.error("관리자 정보를 가져오는데 실패했습니다.", error);
            }
        };
        fetchMyInfo();
    }, []);



    return (
        // 헤더 여백도 모바일에서는 줄여줍니다 (px-4 md:px-8)
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">

            {/* 왼쪽 영역: 햄버거 메뉴 + 현재 페이지 제목 */}
            <div className="flex items-center gap-4">

                {/* 🍔 모바일 햄버거 메뉴 (데스크톱에선 숨김 md:hidden) */}
                {/* Sheet에 open과 onOpenChange 속성을 달아서 직접 통제한다.*/}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                        <Menu size={24} />
                    </SheetTrigger>

                    {/* 서랍 내용 (왼쪽에서 열림) */}
                    <SheetContent side="left" className="!w-72 bg-[#1E293B] p-0 border-none flex flex-col">
                        <SheetHeader className="h-16 flex items-center justify-center border-b border-slate-700/50 bg-slate-900/50 m-0">
                            <SheetTitle className="text-xl font-bold text-white tracking-wider m-0 p-0 text-center">
                                GARNET<span className="text-[#C1121F]">IT</span> <span className="font-light text-slate-400 text-base">Admin</span>
                            </SheetTitle>
                        </SheetHeader>

                        {/* 모바일 메뉴 목록 */}
                        <nav className="flex flex-col py-6 px-3 space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                // 1. 서브메뉴가 있는 경우 (모바일에서는 기본적으로 다 펼쳐 보여줍니다)
                                if (item.subItems) {
                                    return (
                                        <div key={item.name} className="flex flex-col space-y-1">
                                            <div className="flex items-center gap-3 px-3 py-3 text-slate-500 font-bold text-sm">
                                                <Icon size={20} />
                                                <span>{item.name}</span>
                                            </div>
                                            <div className="pl-10 flex flex-col space-y-1 mb-2">
                                                {item.subItems.map((sub) => (
                                                    <Link
                                                        key={sub.path}
                                                        href={sub.path}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`block px-3 py-2 rounded-md text-sm transition-all ${pathname === sub.path ? "bg-[#C1121F] text-white font-medium" : "text-slate-400"
                                                            }`}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                // 2. 일반 메뉴인 경우
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path!}
                                        href={item.path!}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                                            ? "bg-[#C1121F] text-white font-medium shadow-md shadow-red-900/20"
                                            : "hover:bg-slate-800 text-slate-300 hover:text-white"
                                            }`}
                                    >
                                        <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* 모바일용 하단 로그아웃 버튼 */}
                        <div className="flex p-4 border-t border-slate-700/50">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center justify-center gap-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-red-900/50 transition-colors py-3 rounded-lg cursor-pointer"
                            >
                                <LogOut size={18} />
                                <span>로그아웃</span>
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* 현재 위치 경로 (Breadcrumb) - 모바일에서는 숨기고 데스크톱에서만 보여줍니다 */}
                <div className="hidden md:flex items-center text-sm font-medium text-slate-500">
                    <span className="text-slate-400">Home</span>
                    <span className="mx-2 text-slate-300">/</span>

                    {pathname === '/garnet-adm/dashboard' && <span className="text-slate-800">대시보드</span>}

                    {pathname.includes('/products') && (
                        <>
                            <span className={pathname === '/garnet-adm/dashboard/products' ? 'text-slate-800' : ''}>제품 관리</span>
                            {pathname.includes('/new') && (
                                <>
                                    <span className="mx-2 text-slate-300">/</span>
                                    <span className="text-slate-800">신규 등록</span>
                                </>
                            )}
                        </>
                    )}

                    {pathname.includes('/portfolios') && <span className="text-slate-800">구축사례 관리</span>}
                    {pathname.includes('/partners') && <span className="text-slate-800">파트너사 관리</span>}

                    {pathname.includes('/boards') && (
                        <>
                            <span>게시판 관리</span>
                            <span className="mx-2 text-slate-300">/</span>
                            {pathname.includes('/notices') && <span className="text-slate-800">공지사항</span>}
                            {pathname.includes('/downloads') && <span className="text-slate-800">자료실</span>}
                            {pathname.includes('/qna') && <span className="text-slate-800">묻고 답하기</span>}
                            {pathname.includes('/inquiries') && <span className="text-slate-800">문의 접수함</span>}
                        </>
                    )}

                    {pathname.includes('/users') && <span className="text-slate-800">관리자 계정</span>}
                    {pathname.includes('/settings') && <span className="text-slate-800">환경 설정</span>}
                </div>

            </div>

            {/* 오른쪽 영역: 내 정보 + 타이머 + 로그아웃 */}
            <div className="flex items-center gap-4 md:gap-6">

                {/* 1. 현재 관리자 이름 (모바일(sm 이하)에서는 좁으니까 숨깁니다! hidden sm:flex) */}
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
                    <UserIcon size={16} className="text-slate-400" />
                    <span>{adminName}</span>
                </div>

                {/* 2. 남은 시간 타이머 (언제나 보임) */}
                <div className="flex items-center gap-2 text-sm font-mono font-bold text-[#C1121F] bg-red-50/50 md:bg-transparent px-2 py-1 md:p-0 rounded-md">
                    <Timer size={18} />
                    <span>{formattedTime}</span>
                </div>

                {/* 3. 데스크톱용 로그아웃 버튼 (모바일에서는 서랍으로 이사 갔으므로 hidden md:block 으로 숨김) */}
                <div className="hidden md:block">
                    <AlertDialog>
                        <AlertDialogTrigger className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#C1121F] transition-colors font-medium px-4 py-2 rounded-lg hover:bg-red-50 cursor-pointer">
                            <LogOut size={18} />
                            <span>로그아웃</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>로그아웃 하시겠습니까?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    진행 중이던 작업이 있다면 모두 저장되었는지 다시 한번 확인해 주세요.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction onClick={handleLogout} className="bg-[#C1121F] hover:bg-red-800 text-white">
                                    로그아웃
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

            </div>

        </header>
    );
}
