"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// 이 수문장(Guard)은 자식 컴포넌트들(children)을 보여주기 전에 먼저 토큰을 검사합니다.
export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname(); // 현재 주소
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // 메뉴를 이동할 때마다(pathname 변경 시) 항상 토큰이 있는지 감시합니다.
        const token = localStorage.getItem("admin_token");
        if (!token) {
            alert("로그인이 필요합니다.");
            router.push("/garnet-adm/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router, pathname]);

    // 인증되기 전에는 화면을 그리지 않고 로딩 바를 띄웁니다.
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 animate-pulse">관리자 인증 정보를 확인 중입니다...</p>
            </div>
        );
    }

    // 인증을 무사히 통과하면 그때서야 진짜 화면(children)을 보여줍니다!
    return <>{children}</>;
}
