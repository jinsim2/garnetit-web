"use client"; // 💡 매우 중요: 이 컴포넌트는 사용자의 클릭을 받아야 하므로 반드시 선언해야 한다.

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react"; // 햄버거 아이콘
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle, // 접근성(Accessibility)을 위해 필요하다.
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function MobileNav() {
    // Sheet의 열림/닫힘 상태를 관리하는 State
    const [isOpen, setIsOpen] = useState(false);

    // 현재 경로(pathname)를 감지
    const pathname = usePathname();

    // 경로가 변경될 때마다 isOpen을 false로 만들어 Sheet를 닫는다.
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);


    return (
        // 💡 lg(데스크탑) 사이즈에서는 이 햄버거 버튼이 아예 숨겨지도록 hidden 처리한다.
        <div className="flex lg:hidden">
            {/* Sheet 컴포넌트를 Controlled Component로 사용 */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                {/* 1. 트리거: 누르면 열리는 버튼 */}
                <SheetTrigger className="text-slate-600 hover:text-[#C1121F] transition-colors p-2">
                    <Menu className="h-7 w-7" />
                </SheetTrigger>

                {/* 2. 컨텐츠: 열렸을 때 왼쪽(left)에서 튀어나오는 패널 */}
                <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-white">
                    <SheetTitle className="sr-only">모바일 내비게이션 메뉴</SheetTitle>

                    <div className="flex flex-col gap-8 mt-10 px-6">
                        {/* 모바일 로고 영역 */}
                        <Link href="/" className="text-2xl font-black text-slate-900 tracking-tighter">
                            <div className="relative h-9 w-44">
                                <Image
                                    src="/images/로고-흰of회.png"
                                    alt="로고"
                                    fill
                                    priority
                                    className="object-contain object-left"
                                    sizes="200px"
                                />
                            </div>
                        </Link>

                        {/* 세로로 정렬된 모바일 메뉴 */}
                        {/*<nav className="flex flex-col gap-6 text-lg font-medium text-slate-700">
                            <Link href="/about" className="hover:text-[#C1121F] transition-colors">회사소개</Link>
                            <Link href="/business" className="hover:text-[#C1121F] transition-colors">사업영역</Link>
                            <Link href="/products" className="hover:text-[#C1121F] transition-colors">제품 소개</Link>
                            <Link href="/portfolio" className="hover:text-[#C1121F] transition-colors">구축 사례</Link>
                            <Link href="/support" className="hover:text-[#C1121F] transition-colors">고객지원</Link> 
                        </nav>*/}
                        {/* 아코디언 메뉴 */}
                        <Accordion className="w-full">
                            <AccordionItem value="item-1" className="border-b border-slate-100">
                                <AccordionTrigger className="text-lg font-medium text-slate-700 hover:text-[#C1121F] hover:no-underline">
                                    회사소개
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-4 pl-4 pt-2 pb-4 text-slate-500">
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/company/about">CEO 인사말</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/company/history">회사 연혁</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/company/cert">인증 및 특허</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/company/location">오시는길</Link>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-b border-slate-100">
                                <AccordionTrigger className="text-lg font-medium text-slate-700 hover:text-[#C1121F] hover:no-underline">
                                    사업영역
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-4 pl-4 pt-2 pb-4 text-slate-500">
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/business/cctv">영상 감시 체계</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/business/network">네트워크 및 보안 인프라</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/business/broadcast">재난 예경보 시스템</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/business/maintenance">SI 및 통합 유지보수</Link>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-b border-slate-100">
                                <AccordionTrigger className="text-lg font-medium text-slate-700 hover:text-[#C1121F] hover:no-underline">
                                    제품 소개
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-4 pl-4 pt-2 pb-4 text-slate-500">
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/product/cctv">영상감시장치</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/product/network">네트워크보안장비</Link>
                                        {/*<Link className="!no-underline hover:!text-[#C1121F]" href="/product/access-control">출입통제시스템</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/product/software">소프트웨어 및 솔루션</Link>*/}
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/product/audio">네트워크방송장비</Link>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-lg font-medium text-slate-700 hover:text-[#C1121F] hover:no-underline">
                                    고객지원
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-4 pl-4 pt-2 pb-4 text-slate-500">
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/support/notice">공지사항</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/support/download">자료실(메뉴얼/카탈로그)</Link>
                                        <Link className="!no-underline hover:!text-[#C1121F]" href="/support/qna">묻고 답하기(Q&A)</Link>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* 모바일 하단 강조 버튼 */}
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <Link
                                href="/support/inquiry"
                                className="flex items-center justify-center w-full bg-[#C1121F] text-white py-3 rounded-md font-bold"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
