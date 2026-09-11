import Image from "next/image";
import Link from "next/link";

// 모바일 메뉴 컴포넌트를 불러온다.
import MobileNav from "@/components/layout/MobileNav";

// 메가 메뉴 컴포넌트를 불러온다.
import DesktopNav from "@/components/layout/DesktopNav";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">

                {/* 시안의 좌측 로고 영역 */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative h-9 w-44">
                        <Image
                            src="/images/로고-흰of적.png"
                            alt="로고"
                            fill
                            priority
                            className="object-contain object-left"
                            sizes="200px"
                        />
                    </div>
                </Link>

                {/* 중앙 GNB 네비게이션 메뉴 */}
                {/*<nav className="hidden lg:flex items-center gap-10 text-[20px] font-medium text-slate-600">
                    <Link href="/about" className="text-[#C1121F] font-bold">회사소개</Link>
                    <Link href="/business" className="hover:text-[#C1121F] transition-colors">사업영역</Link>
                    <Link href="/products" className="hover:text-[#C1121F] transition-colors">제품 소개</Link>
                    <Link href="/portfolio" className="hover:text-[#C1121F] transition-colors">구축 사례</Link>
                    <Link href="/support" className="hover:text-[#C1121F] transition-colors">고객지원</Link>
                </nav> */}

                {/* 데스크탑 메가 메뉴를 불러온다. */}
                <DesktopNav />

                {/* 우측 강렬한 빨간색 CTA 버튼 */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/support/inquiry"
                        className="hidden lg:flex items-center justify-center bg-[#C1121F] hover:bg-[#A00F19] text-white px-7 py-2.5 rounded-sm font-semibold text-sm transition-colors"
                    >
                        Contact Us
                    </Link>
                    {/* 클라이언트 컴포넌트를 조립한다. 데스크탑에서는 스스로 숨고 모바일에서만 나타난다. */}
                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
