import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminGuard from "@/components/admin/AdminGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // 이제 AdminGuard 안쪽에 있는 모든 화면은 토큰 없이는 절대 접근할 수 없다!
        <AdminGuard>
             // 전체 배경은 아주 옅은 회색(slate-50)으로 깔아줍니다.
            <div className="min-h-screen bg-slate-50 flex">

                {/* 1. 좌측 사이드바 (고정) */}
                <AdminSidebar />

                {/* 2. 우측 메인 영역 (사이드바 너비인 64(16rem)만큼 왼쪽 여백(ml-64)을 줍니다) */}
                <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

                    {/* 우측 상단 헤더 */}
                    <AdminHeader />

                    {/* 우측 하단 실제 내용이 바뀔 도화지 (여백 p-8) */}
                    <main className="flex-1 md:p-8 p-4">
                        {children}
                    </main>

                </div>

            </div>
        </AdminGuard>

    );
}
