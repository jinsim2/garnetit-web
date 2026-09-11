"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Briefcase,
    Building2,
    Headset,
    Users,
    Settings,
    ChevronDown,
    ChevronRight,
} from "lucide-react"; // 아이콘 라이브러리 활용

export const menuItems = [
    { name: "대시보드", path: "/garnet-adm/dashboard", icon: LayoutDashboard },
    { name: "제품 관리", path: "/garnet-adm/dashboard/products", icon: Package },
    { name: "구축사례 관리", path: "/garnet-adm/dashboard/portfolios", icon: Briefcase },
    { name: "파트너사 관리", path: "/garnet-adm/dashboard/partners", icon: Building2 },
    {
        name: "게시판 관리", icon: Headset,
        subItems: [ // 서브메뉴 배열 추가!
            { name: "공지사항 관리", path: "/garnet-adm/dashboard/boards/notices" },
            { name: "자료실 관리", path: "/garnet-adm/dashboard/boards/downloads" },
            { name: "묻고 답하기", path: "/garnet-adm/dashboard/boards/qna" },
            { name: "문의 접수함", path: "/garnet-adm/dashboard/boards/inquiries" },
        ]
    },
    { name: "관리자 계정", path: "/garnet-adm/dashboard/users", icon: Users },
    { name: "환경 설정", path: "/garnet-adm/dashboard/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname(); // 현재 사용자가 있는 URL 경로를 알아냅니다.
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    // 사용자가 서브메뉴 페이지를 새로고침해도 아코디언이 열려있도록 유지하는 훅
    useEffect(() => {
        menuItems.forEach((item) => {
            if (item.subItems) {
                const isActive = item.subItems.some((sub) => { return pathname.startsWith(sub.path) });
                if (isActive) {
                    setOpenMenus((prev) => { return { ...prev, [item.name]: true } });
                }
            }
        });
    }, [pathname]);

    const toggleMenu = (name: string) => {
        setOpenMenus((prev) => { return { ...prev, [name]: !prev[name] } });
    }

    return (
        // 짙은 네이비(#1E293B) 배경에 가로 크기 64(16rem), 왼쪽 고정(fixed)
        <aside className="w-64 bg-[#1E293B] text-slate-300 hidden md:flex flex-col min-h-screen fixed left-0 top-0 z-20 shadow-xl">

            {/* 로고 영역 */}
            <div className="h-16 flex items-center justify-center border-b border-slate-700/50 bg-slate-900/50">
                <span className="text-xl font-bold text-white tracking-wider">
                    GARNET<span className="text-[#C1121F]">IT</span> <span className="font-light text-slate-400 text-base">Admin</span>
                </span>
            </div>

            {/* 메뉴 네비게이션 영역 */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    // 1. 서브메뉴(아코디언)가 있는 경우
                    if (item.subItems) {
                        const isOpen = openMenus[item.name];
                        const isChildActive = item.subItems.some((sub) => { return pathname === sub.path });

                        return (
                            <div key={item.name} className="flex flex-col space-y-1">
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 ${isChildActive || isOpen
                                        ? "bg-slate-800 text-white font-medium"
                                        : "hover:bg-slate-800 hover:text-white"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} className={isChildActive || isOpen ? "text-white" : "text-slate-400"} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>

                                {isOpen && (
                                    <div className="pl-10 space-y-1 mt-1">
                                        {item.subItems.map((sub) => {
                                            const isSubActive = pathname === sub.path;
                                            return (
                                                <Link
                                                    key={sub.path}
                                                    href={sub.path}
                                                    className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${isSubActive
                                                        ? "bg-[#C1121F] text-white font-medium shadow-sm shadow-red-900/20"
                                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"} `}
                                                >
                                                    {sub.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // 2. 서브메뉴가 없는 일반 메뉴인 경우
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition0all duration-200 ${isActive
                                ? "bg-[#C1121F] text-white font-medium shadow-sm shadow-red-900/20"
                                : "hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
