import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "가넷정보기술 | 관리자 대시보드",
    description: "가넷정보기술 관리자 워크스페이스입니다.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        // 관리자 페이지 전용 어두운 네이비색 배경 적용 (html, body 태그는 최상단 루트 레이아웃이 담당하므로 여기서는 <div>만 씁니다!)
        <div className="flex flex-col min-h-screen bg-slate-900 text-slate-800">
            {children}
        </div>
    );
}
