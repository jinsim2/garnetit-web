"use client";

//import { useState } from "react";
// useState 대신 useParams를 쓴다.
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Network, Mic } from "lucide-react";

// --- 가짜 데이터 (Dummy Data) ---
// 나중에 백엔드 API가 연결되면 이 부분을 fetch로 대체하면 된다!
const categories = [
    { id: "cctv", name: "영상감시장치", icon: ShieldCheck },
    { id: "network", name: "네트워크 보안장비", icon: Network },
    { id: "audio", name: "네트워크 방송장비", icon: Mic },
];

const dummyProducts = {
    cctv: [
        {
            id: 1,
            name: "GARNET Full-HD IR 돔 카메라",
            model: "GCD-403020I-01",
            desc: "어두운 환경에서도 선명한 Full-HD 화질과 IR 기술을 탑재하여 완벽한 실내외 감시를 지원합니다.",
            features: ["Full-HD 해상도", "IP67 방수방진 & IK10 내충격"],
            image: "/products/dome.png",
        },
        {
            id: 2,
            name: "GARNET Full HD IR 블릿 카메라(히터 내장)",
            model: "GCB-403020I-01",
            desc: "가혹한 날씨 속에서도 흔들림 없는 모니터링. 야간 가시거리 50m를 자랑하는 적외선(IR) 블릿 카메라입니다.",
            features: ["Full-HD 해상도", "히터 내장 (영하 40도)", "IP67 방수방진"],
            image: "/products/bullet.png",
        },
        {
            id: 3,
            name: "GARNET Full-HD 36배 라이트마스터 IR PTZ 카메라",
            model: "GCP-3602I-01",
            desc: "360도 무사각 고해상도 집중 감시. 스마트 PTZ 조작을 통해 정확하고 신속한 상황 파악이 가능합니다.",
            features: ["Full-HD 해상도", "IP67 방수방진", "IK10 내충격"],
            image: "/products/ptz.png",
        },
        {
            id: 4,
            name: "DirectIP 16채널 녹화기",
            model: "GN-16C",
            desc: "대규모 영상 데이터 무중단 저장 및 분석. 고성능 서버용 CPU를 탑재하여 안정적인 녹화 및 실시간 모니터링이 가능합니다.",
            features: ["16채널 실시간 녹화", "실시간 모니터링", "RAID 1 지원"],
            image: "/products/nvr.png",
        }
    ],
    network: [
        {
            id: 5,
            name: "AXGATE 차세대 통합 방화벽",
            model: "AXGATE 7000S",
            desc: "대규모 네트워크 환경을 위한 최고의 성능. 완벽한 위협 탐지 및 차단 성능을 제공하는 차세대 통합보안 시스템(NGFW).",
            features: ["멀티코어 분산 처리 엔진", "랜섬웨어/악성코드 원천 차단", "고가용성(HA) 클러스터링"],
            image: "/products/AXGATE_7000S.png",
        }
    ],
    audio: [
        {
            id: 6,
            name: "Onecast 네트워크 방송 서버 ",
            model: "SBC-7200",
            desc: "안전과 신뢰를 최우선으로 하는 방송 인프라 구축. 신뢰할 수 있는 네트워크 기반 방송 솔루션으로 재난 상황에서도 끊김 없는 소통을 보장합니다.",
            features: ["PoE (전원 및 통신 통합)", "양방향 오디오 통신", "스케줄 및 TTS 방송 지원"],
            image: "/products/AGT-7200.png",
        }
    ]
};

export default function ProductPage() {
    // 현재 선택된 탭을 기억하는 상태 (기본값: cctv)
    // const [activeTab, setActiveTab] = useState("cctv");

    // 1. 주소창에서 [category] 글자를 쏙 빼온다. (예: 주소가 /product/network 면 "network"를 가져옴)
    const params = useParams();
    const activeCategory = (params.category as string) || "cctv";

    // 2. 주소창 글자에 맞는 제품 리스트를 꺼낸다.
    // 만약 이상한 주소(/product/ass)를 치고 들어오면 기본값(cctv) 데이터나 빈 배열은 준다.
    const currentProducts = dummyProducts[activeCategory as keyof typeof dummyProducts] || dummyProducts.cctv;

    // 탭 클릭 시 상태 변경 + 부드러운 스크롤!
    const handleTabClick = () => {

        // React가 새로운 화면을 렌더링할 시간을 아주 잠깐(비동기) 벌어준다. (10ms)
        setTimeout(() => {
            // sticky 요소 대신, 고정된 '투명 닻'을 찾는다.
            const anchor = document.getElementById("tab-anchor");
            if (anchor) {
                // 글로벌 헤더(h-20 = 80px) 높이만큼 오프셋을 뺀다.
                const y = anchor.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 0);
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* 1. Hero 상단 영역 (어두운 배경에 강렬한 메시지) */}
            <section className="bg-[#1E293B] py-20 px-6 lg:px-12">
                <div className="container mx-auto max-w-6xl text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        세상을 안전하게 연결하는 <br className="md:hidden" />
                        <span className="text-[#C1121F]">가넷의 혁신 기술</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                        자체 제조 4K 영상감시 장치부터 차세대 방화벽까지, <br />
                        타협 없는 성능으로 귀하의 비즈니스를 지킵니다.
                    </p>
                </div>
            </section>

            {/* ✨ 여기에 투명 닻(Anchor)을 내린다! */}
            <div id="tab-anchor"></div>

            {/* 2. 탭 메뉴 영역 (스크롤을 내려도 상단에 착 달라붙음 sticky) */}
            <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="flex overflow-x-auto hide-scrollbar gap-8 md:justify-center">
                        {categories.map((category) => {
                            const isActive = activeCategory === category.id;
                            const Icon = category.icon;
                            return (
                                // button 대신 Link로 변경하고, href로 이동시킨다.
                                <Link
                                    key={category.id}
                                    href={`/product/${category.id}`}
                                    scroll={false} // Next.js의 뚝 끊기는 스크롤 방지!
                                    onClick={handleTabClick} // 부드러운 스크롤 실행!
                                    // 모바일 반응형 적용 text-sm, py-4 등으로 줄이되, PC(md:)에서는 원래 크기를 유지한다.
                                    className={`flex items-center gap-2 py-4 md:py-5 font-semibold text-sm md:text-base transition-colors whitespace-nowrap border-b-2 cursor-pointer ${isActive
                                        ? "border-[#C1121F] text-[#C1121F]"
                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    <Icon size={20} />
                                    {category.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. 대형 교차(지그재그) 쇼케이스 영역 */}
            <section className="py-20 px-6 lg:px-12">
                <div className="container mx-auto max-w-6xl space-y-32">
                    {currentProducts.map((product, index) => {
                        // 짝수 번째 인덱스(0, 2, 4...)는 이미지가 왼쪽, 홀수 번째는 오른쪽으로 강제 지정
                        const isImageLeft = index % 2 === 0;

                        return (
                            <div
                                key={product.id}
                                className={`flex flex-col gap-12 lg:gap-24 items-center ${isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                                    }`}
                            >
                                {/* 이미지 영역 (거대한 비율과 애니메이션 부여) */}
                                <div className="w-full lg:w-1/2">
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-white group">
                                        {/* Next.js의 Image 컴포넌트로 외부 이미지를 가져올 땐 외부 링크 허용 설정이 필요하지만, 여기선 Vercel 시연을 위해 Unsplash 임시 이미지를 썼습니다. 혹시 에러가 난다면 <img /> 태그로 임시 교체하셔도 됩니다! */}
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            className="w-full h-full object-contain p-8 md:p-12 transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* 이미지가 없을 때를 대비한 희미한 오버레이 */}
                                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                                    </div>
                                </div>

                                {/* 텍스트 영역 (제품명, 스펙, 버튼) */}
                                <div className="w-full lg:w-1/2 space-y-6">
                                    <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 font-medium text-sm rounded-full">
                                        {product.model}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                        {product.name}
                                    </h2>
                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        {product.desc}
                                    </p>

                                    {/* 핵심 스펙 리스트 */}
                                    <ul className="space-y-3 py-4 border-y border-slate-100">
                                        {product.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                                <div className="w-2 h-2 rounded-full bg-[#C1121F]"></div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* 상세보기 버튼 */}
                                    <div className="pt-4">
                                        <Link
                                            href={`/product/detail/${product.id}`}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E293B] hover:bg-[#C1121F] text-white font-semibold rounded-lg transition-colors"
                                        >
                                            상세 스펙 보기
                                            <ChevronRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
