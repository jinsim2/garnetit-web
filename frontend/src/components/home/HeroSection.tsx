"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

const HERO_SLIDES = [
    {
        id: 1,
        category: "Garnet Information Technology",
        title: "유무선 통합 보안 솔루션\n가넷정보기술",
        desc: "안전하고 스마트한 미래를 디자인하는 글로벌 보안 및 IT 인프라 파트너.\n검증된 기술력과 풍부한 경험으로 고객의 자산을 완벽하게 보호합니다.",
    },
    {
        id: 2,
        category: "Intelligent Video Surveillance",
        title: "지능형 영상 감시 체계\n\n",
        desc: "AI 기반 객체 인식 및 행동 분석으로 사각지대 없는\n24시간 철통 보안을 약속합니다.",
    },
    {
        id: 3,
        category: "Network Infrastructure",
        title: "엔터프라이즈 네트워크 구축\n\n",
        desc: "초고속, 고가용성 유무선 네트워크 인프라 설계로\n비즈니스의 완벽한 연속성을 보장합니다.",
    }
];

export default function HeroSection() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    );

    React.useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <section className="relative w-full h-[calc(100dvh-80px)] bg-slate-900 overflow-hidden">

            {/* 💡 1. 영구 고정 비디오 배경 (PC / 모바일 해상도 이중화) */}

            {/* 🖥️ PC 전용 비디오 (태블릿/PC: 768px 이상에서만 보임) */}
            <video
                autoPlay loop muted playsInline
                className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/land_web.mp4" type="video/mp4" />
            </video>

            {/* 📱 모바일 전용 비디오 (스마트폰: 768px 미만에서만 보임) */}
            <video
                autoPlay loop muted playsInline
                className="block md:hidden absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/land_mobile.mp4" type="video/mp4" />
            </video>


            {/* 비디오 텍스트 가독성을 위한 기본 50% 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>

            {/* 💡 2. 투명한 카로셀 엔진 (마우스 드래그 및 시간 제어용) */}
            {/* 나중에 슬라이드마다 비디오를 다르게 하고 싶다면, 이 안의 CarouselItem 안에 video 태그를 넣으면 된다! */}
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                opts={{ loop: true, duration: 60 }}
                className="absolute inset-0 w-full h-full z-10"
            >
                <CarouselContent className="h-full ml-0">
                    {HERO_SLIDES.map((slide) => (
                        <CarouselItem key={slide.id} className="w-full h-full pl-0" />
                    ))}
                </CarouselContent>
            </Carousel>

            {/* 💡 3. 하단 고정 글래스모피즘 바 (모바일 컴팩트 최적화) */}
            <div className="absolute bottom-0 left-0 w-full z-20 bg-black/40 backdrop-blur-md border-t border-white/10">
                {/* 모바일에서는 pb-4, gap-4로 슬림하게 줄임 */}
                <div className="container mx-auto px-5 lg:px-12 py-3 lg:pb-6 flex flex-col lg:flex-row items-end justify-between gap-3 lg:gap-10">

                    {/* 텍스트 영역: 모바일에서 min-h 강제 제거(min-h-0) */}
                    <div className="flex-1 w-full min-h-0 lg:min-h-[180px] flex flex-col justify-end">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                // 💡 박스가 너무 두껍지 않도록 슬림하게 조절
                                className="w-full flex flex-col items-start text-left"
                            >
                                {/* 1층: 카테고리 (모바일에서 여백 축소) */}
                                <h2 className="text-[#C1121F] font-bold tracking-[0.2em] text-[11px] lg:text-sm mb-1 lg:mb-3 uppercase">
                                    {HERO_SLIDES[current].category}
                                </h2>

                                {/* 2층: 50:50 좌우 분할 그리드 (타이틀과 설명이 같은 선상에서 시작됨!) */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 items-start w-full">
                                    {/* 모바일 타이틀: text-xl ~ text-2xl로 다이어트! */}
                                    <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight lg:leading-[1.3] whitespace-pre-line">
                                        {HERO_SLIDES[current].title}
                                    </h1>

                                    {/* 모바일 설명: line-clamp-2로 최대 2줄만 깔끔하게 표시 */}
                                    <p className="text-slate-300 text-xs lg:text-base leading-relaxed line-clamp-2 lg:line-clamp-none">
                                        {HERO_SLIDES[current].desc}
                                    </p>
                                </div>
                            </motion.div>

                        </AnimatePresence>
                    </div>

                    {/* 우측 하단 컨트롤러: 모바일에서는 원형 타이머를 숨기고 도트만 심플하게 표시 */}
                    <div className="flex items-center justify-end lg:justify-between w-full lg:w-auto gap-4 pt-1 lg:pt-0">

                        {/* 도트(점) 네비게이션 */}
                        <div className="flex gap-1.5">
                            {HERO_SLIDES.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => api?.scrollTo(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${current === idx ? "w-6 bg-[#C1121F]" : "w-1.5 bg-white/30 hover:bg-white/50"
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>

                        {/* 원형 타이머: 모바일(작은 화면)에서는 숨김(hidden sm:flex) 처리하여 공간 확보! */}
                        <div className="hidden sm:flex relative w-12 h-12 lg:w-14 lg:h-14 items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                                <motion.circle
                                    key={current}
                                    cx="50"
                                    cy="50"
                                    r="46"
                                    stroke="#C1121F"
                                    strokeWidth="6"
                                    fill="none"
                                    initial={{ pathLength: 1 }}
                                    animate={{ pathLength: 0 }}
                                    transition={{ duration: 5, ease: "linear" }}
                                />
                            </svg>
                            <span className="text-white font-bold text-lg">
                                0{current + 1}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 💡 4. 마우스 스크롤 인디케이터 (PC 환경에서만 노출!) */}
            <div
                /* [수정] hidden lg:flex 로 변경하여 모바일 화면에서는 완전히 숨김 */
                className="hidden lg:flex absolute lg:bottom-[240px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                {/* 내부 마우스 모양 코드는 그대로 유지 */}
                <div className="w-[28px] h-[44px] rounded-full border-2 border-white/40 flex justify-center p-1">
                    {/* 마우스 휠 (Framer Motion으로 위아래 바운스 애니메이션 적용) */}
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </div>
                {/* 텍스트 라벨 */}
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">
                    Scroll
                </span>
            </div>

        </section>
    );
}
