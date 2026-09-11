import type { Metadata } from "next";
import localFont from "next/font/local";
import "./(main)/globals.css"; // 경로 주의! (기존 main 안에 있는 css를 불러온다)

// 로컬 폰트 설정
const pretendard = localFont({
    src: "./fonts/PretendardVariable.woff2", // 경로 주의! (app 폴더 기준)
    display: "swap",
    weight: "45 920",
    variable: "--font-pretendard",
});

export const metadata: Metadata = {
    title: {
        template: "%s | 가넷정보기술",
        default: "가넷정보기술 - 엔터프라이즈 IT 보안 및 네트워크 인프라 구축",
    },
    description: "부산·경남 1등 IT 인프라 기업. 지능형 CCTV, 방화벽, 재난예경보 시스템, 서버 구축 및 유지보수 전문 기업입니다.",
    keywords: ["가넷정보기술", "부산 CCTV", "네트워크 구축", "방화벽", "정보통신공사", "서버 구축", "재난방송"],
    openGraph: {
        title: "가넷정보기술 - 엔터프라이즈 IT 보안 및 네트워크 인프라",
        description: "지능형 CCTV, 방화벽, 재난예경보 시스템, 서버 구축 및 유지보수",
        url: "https://garnetit-web.vercel.app",  // 추후 실제 도메인으로 교체 예정 https://garnetit.co.kr
        siteName: "가넷정보기술",
        images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: "가넷정보기술 대표 썸네일" }],
        locale: "ko_KR",
        type: "website",
    },
    metadataBase: new URL("https://garnetit-web.vercel.app"),  // 카톡에 공유할 때 기준이 되는 기본 도메인 주소 명시
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className="h-full antialiased">
            <body className={`${pretendard.variable} min-h-full font-sans`}>
                {children}
            </body>
        </html>
    );
}
