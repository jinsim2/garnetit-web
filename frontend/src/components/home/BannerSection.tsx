"use client";

import Image from "next/image";

// 💡 logo 경로가 있는 곳은 이미지가 출력되고, 없는 곳은 자동으로 텍스트가 출력되도록 설계했습니다.
const PARTNERS = [
    { name: "AXGATE", desc: "차세대 방화벽", logo: "/partners/axgate_logo.svg" }, // 회원님이 업로드하신 파일!
    { name: "한드림넷", desc: "백본망", logo: "" },
    { name: "SECUI", desc: "네트워크 보안", logo: "" },
    { name: "Palo Alto", desc: "글로벌 엔터프라이즈 보안", logo: "" },
    { name: "Onecast", desc: "재난예경보 시스템", logo: "" },
    { name: "AnLab", desc: "차세대 방화벽", logo: "" },
    { name: "CISCO", desc: "네트워크 스위치", logo: "" },
];

export default function BannerSection() {
    return (
        <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 mb-8 text-center">
                <h3 className="text-slate-400 font-semibold text-sm tracking-[0.2em] uppercase">
                    Trusted Partners
                </h3>
            </div>

            <div className="relative w-full flex overflow-hidden group">
                {/* 양쪽 그라데이션 마스크 */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                {/* 무한 롤링 트랙 */}
                <div className="flex w-max animate-marquee">
                    {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                        <div
                            key={idx}
                            className="relative flex flex-col items-center justify-center w-64 h-24 mx-4 bg-white border border-slate-100 rounded-xl hover:border-[#C1121F]/30 hover:shadow-lg transition-all duration-300 cursor-pointer group/card overflow-hidden"
                        >
                            {/* 💡 1. 로고 이미지 영역 (호버 시 원본 컬러로 변하며 위로 살짝 올라감) */}
                            <div className="relative w-full h-full flex items-center justify-center transform group-hover/card:-translate-y-3 transition-all duration-500">
                                {partner.logo ? (
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        fill
                                        // 평소엔 흑백(grayscale) + 반투명, 호버 시 풀컬러 + 불투명
                                        className="object-contain p-6 grayscale opacity-40 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-500"
                                    />
                                ) : (
                                    <span className="text-xl font-black text-slate-300 group-hover/card:text-slate-800 transition-colors duration-500">
                                        {partner.name}
                                    </span>
                                )}
                            </div>

                            {/* 💡 2. 설명 텍스트 영역 (평소엔 바닥 아래 숨어있다가 호버 시 솟아오름) */}
                            <div className="absolute bottom-3 left-0 w-full text-center transform translate-y-8 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500">
                                {/* 로고가 있는 카드일 때만 회사 이름을 띄워줍니다 */}
                                {partner.logo && (
                                    <span className="block text-sm font-bold text-slate-800">
                                        {partner.name}
                                    </span>
                                )}
                                <span className="block text-[11px] font-semibold text-[#C1121F] mt-0.5">
                                    {partner.desc}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
