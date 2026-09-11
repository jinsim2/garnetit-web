"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 💡 1. 데이터 주도형(Data-Driven) 구조: 이 데이터만 바꾸면 100% 자동 렌더링 된다.
const MENU_DATA = [
    {
        id: "company",
        label: "회사소개",
        href: "/company",
        description: "가넷은 끊임없는 혁신과 기술력을 바탕으로 고객의 안전과 비즈니스 성공을 책임지는 IT 파트너입니다.",
        cards: [
            { title: "CEO 인사말", href: "/company/about", desc: "가넷의 비전과 고객을 향한 약속" },
            { title: "회사 연혁", href: "/company/history", desc: "가넷이 걸어온 눈부신 발자취" },
            { title: "인증 및 특허", href: "/company/cert", desc: "검증된 기술력과 굳건한 신뢰성" },
            { title: "오시는 길", href: "/company/location", desc: "가넷 본사 방문을 위한 안내" },
        ]
    },
    {
        id: "business",
        label: "사업영역",
        href: "/business",
        description: "물리적 보안부터 네트워크 인프라까지, 엔터프라이즈 환경을 위한 토탈 솔루션을 제공합니다.",
        cards: [
            { title: "영상 감시 체계", href: "/business/cctv", desc: "지능형 CCTV 및 AI 통합 관제 솔루션" },
            { title: "네트워크 보안 인프라", href: "/business/network", desc: "고속, 고가용성 유무선 보안 네트워크 인프라 구축" },
            { title: "재난 예경보 시스템", href: "/business/boardcast", desc: "고해상도 방송 및 비상 경보 체계" },
            { title: "통합 유지보수", href: "/business/maintenance", desc: "365일 무중단 시스템 운영 및 전문 관리" },
        ]
    },
    {
        id: "product",
        label: "제품소개",
        href: "/product",
        description: "업계를 선도하는 기술력으로 탄생한 가넷의 최첨단 하드웨어와 지능형 소프트웨어 라인업을 만나보십시오.",
        cards: [
            { title: "영상감시장치", href: "/product/cctv", desc: "고성능 렌즈와 4K 센서로 24시간 빈틈없는 시야를 제공합니다." },
            { title: "네트워크 보안장비", href: "/product/network", desc: "고속, 고안정성 보안 네트워크 환경을 구축합니다." },
            /*{ title: "출입통제시스템", href: "/product/access-control", desc: "생체 인식 및 모바일 기반의 최첨단 출입 관리 시스템입니다." },
            { title: "소프트웨어 및 솔루션", href: "/product/software", desc: "현장에서 검증된 안정성과 사용자 경험을 자랑하는 통합 소프트웨어입니다." },*/
            { title: "네트워크 방송장비", href: "/product/audio", desc: "선명한 음향과 최적화된 설계로 완성도를 높입니다." },
        ]
    },
    {
        id: "support",
        label: "고객지원",
        href: "/support",
        description: "고객의 비즈니스가 단 1초도 멈추지 않도록, 신속하고 정확한 기술 지원과 다양한 전문 자료를 제공합니다.",
        cards: [
            { title: "공지사항", href: "/support/notice", desc: "가넷의 새로운 소식과 주요 업데이트 안내를 가장 먼저 확인하세요." },
            { title: "자료실(메뉴얼/카탈로그)", href: "/support/download", desc: "제품별 상세 매뉴얼, 브로셔 및 최신 펌웨어를 다운로드하실 수 있습니다." },
            { title: "묻고 답하기(Q&A)", href: "/support/faq", desc: "전문 엔지니어가 고객님의 기술적인 궁금증을 신속하게 해결해 드립니다." },
        ]
    }

];

export default function DesktopNav() {
    // 💡 2. 현재 마우스가 올라간 탭을 추적 (애니메이션의 핵심)
    const [activeTab, setActiveTab] = useState<string | null>(null);

    // 현재 활성화된 탭의 데이터를 쏙 빼옵니다.
    const activeMenuData = MENU_DATA.find(menu => menu.id === activeTab);

    return (
        // 💡 3. onMouseLeave: 마우스가 헤더와 메뉴 영역 밖으로 완전히 벗어나면 닫습니다.
        <nav className="hidden lg:flex items-center h-full" onMouseLeave={() => setActiveTab(null)}>

            {/* 상단 1차 메뉴 (GNB) */}
            <ul className="flex items-center gap-10 text-[18px] font-medium text-slate-700 h-full">
                {MENU_DATA.map((menu) => (
                    <li key={menu.id} className="h-full flex items-center">
                        <Link
                            href={menu.href}
                            // 💡 마우스가 특정 메뉴에 올라가면 해당 메뉴를 active 시킵니다.
                            onMouseEnter={() => setActiveTab(menu.id)}
                            className={`py-8 transition-colors ${activeTab === menu.id ? "text-[#C1121F]" : "hover:text-[#C1121F]"}`}
                        >
                            {menu.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* 💡 4. 100vw 전체 화면 하얀색 패널 (열리고 닫히는 물리엔진 애니메이션) */}
            <AnimatePresence>
                {activeTab && activeMenuData && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-full left-0 w-full bg-white border-b border-t border-slate-200 shadow-xl overflow-hidden z-40"
                    >
                        {/* 💡 5. 패널 내부의 좌우 슬라이딩 애니메이션 (버카다의 핵심!) */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab} // 탭이 바뀔 때마다 애니메이션을 리셋시킵니다.
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                // 좌우 분할 1:3 그리드 적용 (Verkada 스타일)
                                className="container mx-auto px-4 py-12 grid grid-cols-[1fr_3fr] gap-16"
                            >
                                {/* 왼쪽: 굵직한 카테고리 설명 (1 비율) */}
                                <div className="flex flex-col border-r border-slate-100 pr-10">
                                    <h2 className="text-3xl font-black text-slate-900 mb-4">{activeMenuData.label}</h2>
                                    <p className="text-slate-500 leading-relaxed text-sm">
                                        {activeMenuData.description}
                                    </p>
                                    <Link
                                        href={activeMenuData.href}
                                        className="mt-8 text-[#C1121F] font-bold text-sm hover:underline w-max"
                                    >
                                        {activeMenuData.label} 전체보기 &rarr;
                                    </Link>
                                </div>

                                {/* 오른쪽: 2x2 카드 그리드 영역 (3 비율) */}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    {activeMenuData.cards.map((card, idx) => (
                                        <Link
                                            key={idx}
                                            href={card.href}
                                            className="group block p-4 rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#C1121F] transition-colors">
                                                {card.title}
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                                {card.desc}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

        </nav>
    );
}
