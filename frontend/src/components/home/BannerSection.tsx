"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, X, ExternalLink } from "lucide-react";

// 💡 logo 경로가 있는 곳은 이미지가 출력되고, 없는 곳은 자동으로 텍스트가 출력되도록 설계했습니다.
const PARTNERS = [
    { name: "엑스게이트", desc: "차세대 방화벽", logo: "/partners/axgate_logo.svg", url: "https://www.axgate.com" },
    { name: "한드림넷", desc: "백본망", logo: "/partners/HDN_CI_2016.png", url: "https://www.handreamnet.com" },
    { name: "시큐아이", desc: "네트워크 보안", logo: "/partners/secui.png", url: "https://www.secui.com" },
    { name: "팔로알토", desc: "차세대 방화벽", logo: "/partners/Palo_Alto_Networks_id8CjrAWiV_0.svg", url: "https://www.paloaltonetworks.co.kr" },
    { name: "원캐스트", desc: "재난예경보 시스템", logo: "/partners/Onecast_logo.png", url: "http://www.onecast.co.kr" },
    { name: "안랩", desc: "차세대 방화벽", logo: "/partners/AhnLab_CI.jpg", url: "https://www.ahnlab.com" },
    { name: "시스코", desc: "네트워크 스위치", logo: "/partners/cisco-systems-logo.svg", url: "https://www.cisco.com/c/ko_kr/index.html" },
];

export default function BannerSection() {
    // 1. 전체보기 모달 열림/닫힘 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 2. 자동 롤링 + 모바일 터치 슬라이드를 동시에 지원하는 스크롤 컨테이너 Ref & 일시정지 상태
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        let animationFrameId: number;
        // 소수점 단위 스크롤 누적을 위한 변수 (부드러운 속도 제어)
        let exactScroll = container.scrollLeft;
        const step = () => {
            if (!isPaused && !isModalOpen && container) {
                exactScroll += 0.6; // 숫자 조절로 롤링 속도 제어 (0.5 ~ 1.0)
                // 원본 배열 길이(전체 폭의 절반)만큼 지나가면 감쪽같이 0으로 되돌려 무한 루프 구현
                if (exactScroll >= container.scrollWidth / 2) {
                    exactScroll = 0;
                }
                container.scrollLeft = exactScroll;
            } else if (container) {
                // 사용자가 손가락으로 직접 밀었을 때의 위치값을 그대로 이어받음!
                exactScroll = container.scrollLeft;
            }
            animationFrameId = requestAnimationFrame(step);
        };
        animationFrameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, isModalOpen]);

    return (
        <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
            {/* 상단 헤더: 타이틀 & 심플한 텍스트형 '전체보기 →' 링크 */}
            <div className="container mx-auto px-6 lg:px-12 mb-8 flex items-center justify-between">
                <div className="hidden sm:block w-24" /> {/* 데스크톱 중앙 정렬 균형용 투명 여백 */}
                <h3 className="text-slate-400 font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase">
                    Trusted Partners
                </h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-400 hover:text-[#C1121F] transition-colors cursor-pointer"
                >
                    전체보기
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="relative w-full flex overflow-hidden group">
                {/* 1. 양쪽 그라데이션 마스크: 모바일에서는 좁게(w-10), 데스크톱에서는 넓게(md:w-32) */}
                <div className="absolute top-0 left-0 w-10 md:w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-10 md:w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                {/* 2. 무한 롤링 + 모바일 터치 스와이프 트랙 (overflow-x-auto + hide-scrollbar) */}
                <div
                    ref={scrollRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => {
                        // 모바일에서 손가락을 뗀 뒤 관성 스크롤이 끝날 때쯤(1.2초 후) 다시 자동 롤링 재개
                        setTimeout(() => setIsPaused(false), 1200);
                    }}
                    className="flex w-full overflow-x-auto hide-scrollbar py-2"
                >
                    <div className="flex w-max">
                        {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                            <a
                                key={idx}
                                href={partner.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative flex flex-col items-center justify-center w-44 h-24 mx-2 md:w-64 md:h-28 md:mx-4 bg-white border border-slate-100 rounded-xl hover:border-[#C1121F]/30 hover:shadow-lg transition-all duration-300 cursor-pointer group/card overflow-hidden shrink-0"
                            >
                                {/* 로고 이미지 영역 */}
                                <div className="relative w-full h-full flex items-center justify-center transform group-hover/card:-translate-y-4 group-hover/card:scale-75 transition-all duration-500">
                                    {partner.logo ? (
                                        <Image
                                            src={partner.logo}
                                            alt={partner.name}
                                            fill
                                            className="object-contain px-6 py-4 grayscale opacity-40 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-500"
                                        />
                                    ) : (
                                        <span className="text-lg md:text-xl font-black text-slate-300 group-hover/card:text-slate-800 transition-colors duration-500">
                                            {partner.name}
                                        </span>
                                    )}
                                </div>
                                {/* 설명 텍스트 영역 */}
                                <div className="absolute bottom-0 left-0 w-full text-center pt-4 pb-2.5 bg-gradient-to-t from-white via-white/95 to-transparent transform translate-y-full opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
                                    {partner.logo && (
                                        <span className="block text-xs md:text-sm font-bold text-slate-900 leading-tight">
                                            {partner.name}
                                        </span>
                                    )}
                                    <span className="block text-[11px] font-semibold text-[#C1121F] mt-0.5">
                                        {partner.desc}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            {/* 3. 전체 파트너사 한눈에 보기 모달 (Modal) */}
            {isModalOpen && (
                <div
                    onClick={() => setIsModalOpen(false)}
                    className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col"
                    >
                        {/* 모달 헤더 */}
                        <div className="flex items-start justify-between pb-5 border-b border-slate-100">
                            <div>
                                <span className="text-[11px] font-bold tracking-widest text-[#C1121F] uppercase">
                                    TRUSTED PARTNERS
                                </span>
                                <h4 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
                                    가넷정보기술 주요 기술 파트너사
                                </h4>
                                <p className="text-xs md:text-sm text-slate-500 mt-1">
                                    카드를 클릭하시면 각 파트너사의 공식 홈페이지로 이동합니다.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {/* 모달 본문: 파트너사 그리드 (모바일 2열, 태블릿/데스크톱 3열) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mt-6 overflow-y-auto pr-1">
                            {PARTNERS.map((partner, idx) => (
                                <a
                                    key={idx}
                                    href={partner.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/item relative flex flex-col items-center justify-between p-4 md:p-5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-100 hover:border-[#C1121F]/30 hover:shadow-md transition-all duration-300"
                                >
                                    <ExternalLink
                                        size={14}
                                        className="absolute top-3 right-3 text-slate-300 group-hover/item:text-[#C1121F] transition-colors"
                                    />
                                    <div className="relative w-full h-16 flex items-center justify-center my-2">
                                        {partner.logo ? (
                                            <Image
                                                src={partner.logo}
                                                alt={partner.name}
                                                fill
                                                className="object-contain px-2 group-hover/item:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <span className="text-lg font-black text-slate-700">
                                                {partner.name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-center mt-2 pt-2.5 border-t border-slate-200/60 w-full">
                                        <span className="block text-sm font-bold text-slate-900 group-hover/item:text-[#C1121F] transition-colors">
                                            {partner.name}
                                        </span>
                                        <span className="block text-xs text-slate-500 mt-0.5">
                                            {partner.desc}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}