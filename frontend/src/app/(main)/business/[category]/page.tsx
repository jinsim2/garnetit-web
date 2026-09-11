"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Camera, ShieldCheck, Radio, Wrench, CheckCircle2 } from "lucide-react";

// 사업영역 탭 데이터
const businessTabs = [
    { id: "cctv", name: "영상 감시 체계", icon: Camera },
    { id: "network", name: "네트워크 및 보안", icon: ShieldCheck },
    { id: "broadcast", name: "재난 예경보 시스템", icon: Radio },
    { id: "maintenance", name: "통합 유지보수", icon: Wrench },
];

// 시연을 위한 고퀄리티 B2B 카피라이팅 가짜 데이터
const businessData = {
    cctv: {
        title: "지능형 영상 감시 체계 (CCTV)",
        subtitle: "단순한 감시를 넘어, AI 기반의 예측 가능한 통합 관제 솔루션을 제공합니다.",
        heroImage: "/business/cctv_2.png",
        competencies: [
            { title: "고해상도 무중단 모니터링", desc: "4K UHD 급 카메라와 고가용성 NVR을 연동하여 주야간 사각지대 없는 선명한 화질을 보장합니다." },
            { title: "AI 지능형 객체 분석", desc: "차량 번호판 인식, 배회자 감지, 화재/연기 감지 등 딥러닝 기반의 알고리즘으로 사전 위험을 식별합니다." },
            { title: "중앙 집중형 관제 센터 구축", desc: "분산된 수천 대의 카메라를 하나의 VMS(Video Management System)로 통합하여 직관적인 모니터링 환경을 제공합니다." }
        ]
    },
    network: {
        title: "네트워크 및 보안 인프라",
        subtitle: "강력하고 유연한 네트워크 설계로 기업과 공공기관의 데이터를 가장 안전하게 보호합니다.",
        heroImage: "/business/network_2.png",
        competencies: [
            { title: "차세대 방화벽 및 IPS/IDS", desc: "진화하는 사이버 위협에 대응하여 알려지지 않은 악성코드와 랜섬웨어를 네트워크 단에서 원천 차단합니다." },
            { title: "무중단 고가용성(HA) 설계", desc: "네트워크 장비의 물리적/논리적 이중화 구성을 통해 장애 발생 시에도 서비스 중단 없는 통신을 보장합니다." },
            { title: "망분리 시스템 구축", desc: "업무망과 인터넷망을 완벽하게 분리하여 외부 해킹 위협으로부터 내부 중요 데이터를 원천적으로 격리합니다." }
        ]
    },
    broadcast: {
        title: "재난 예경보 및 방송 시스템",
        subtitle: "골든타임을 지키는 가장 확실한 방법. 빠르고 정확한 대국민 정보 전달 체계입니다.",
        heroImage: "/business/disaster_2.jpg",
        competencies: [
            { title: "IP 기반 통합 오디오 방송", desc: "네트워크가 연결된 곳이라면 어디든 개별/그룹/전체 방송이 가능한 차세대 디지털 음향 송출 시스템입니다." },
            { title: "국가 재난망 자동 연동", desc: "지진, 화재, 홍수 등 국가 재난 데이터(API)와 연동하여 위급 상황 발생 시 즉각적인 자동 경보를 송출합니다." },
            { title: "명료도 높은 음향 설계", desc: "거리별 음압 보정 기술을 적용하여 악천후나 소음이 심한 환경에서도 시민들에게 정확한 내용을 전달합니다." }
        ]
    },
    maintenance: {
        title: "SI 및 통합 유지보수",
        subtitle: "시스템 구축보다 중요한 것은 '안정적인 유지'입니다. 365일 빈틈없는 사후 관리를 약속합니다.",
        heroImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000&auto=format&fit=crop",
        competencies: [
            { title: "24/7 장애 모니터링", desc: "전문 엔지니어가 고객사의 시스템 상태를 상시 모니터링하여 장애 징후를 사전에 포착하고 즉각 조치합니다." },
            { title: "정기 예방 점검 및 헬스체크", desc: "월간/분기별 꼼꼼한 시스템 점검을 통해 인프라의 최적 상태를 유지하고 상세한 기술 리포트를 제공합니다." },
            { title: "맞춤형 SI (System Integration)", desc: "고객의 비즈니스 환경과 예산을 면밀히 분석하여 최적의 하드웨어와 소프트웨어를 조합해 구축해 드립니다." }
        ]
    }
};

export default function BusinessPage() {
    const params = useParams();
    const activeCategory = (params.category as string) || "cctv";

    // Fallback: 이상한 주소로 들어오면 CCTV를 보여줍니다.
    const currentData = businessData[activeCategory as keyof typeof businessData] || businessData.cctv;

    // 부드러운 탭 스크롤 효과
    const handleTabClick = () => {
        setTimeout(() => {
            const anchor = document.getElementById("tab-anchor");
            if (anchor) {
                const y = anchor.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }, 10);
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32">

            <div id="tab-anchor"></div>

            {/* 1. Hero 상단 영역 */}
            <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
                    style={{ backgroundImage: `url(${currentData.heroImage})` }}
                ></div>
                <div className="absolute inset-0 bg-slate-900/70"></div>
                <div className="container mx-auto px-6 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <span className="inline-block px-4 py-1.5 bg-[#C1121F]/20 border border-[#C1121F]/30 text-white font-bold tracking-wider text-sm rounded-full mb-6 backdrop-blur-sm">
                        BUSINESS AREA
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                        {currentData.title}
                    </h1>
                    <p className="text-slate-200 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                        {currentData.subtitle}
                    </p>
                </div>
            </section>



            {/* 2. 탭 메뉴 영역 (sticky) */}
            <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="container mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="flex overflow-x-auto hide-scrollbar gap-8 md:justify-center">
                        {businessTabs.map((tab) => {
                            const isActive = activeCategory === tab.id;
                            const Icon = tab.icon;
                            return (
                                <Link
                                    key={tab.id}
                                    href={`/business/${tab.id}`}
                                    scroll={false}
                                    onClick={handleTabClick}
                                    className={`flex items-center gap-1.5 md:gap-2 py-4 md:py-5 font-semibold text-sm md:text-base transition-colors whitespace-nowrap border-b-2 ${isActive
                                        ? "border-[#C1121F] text-[#C1121F]"
                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    <Icon size={20} />
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. 콘텐츠 영역 (안랩 / 한화비전 스타일의 핵심 역량 카드) */}
            <section className="py-24 px-6 lg:px-12">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">핵심 역량 및 제공 가치</h2>
                        <p className="text-slate-500 text-lg">가넷정보기술이 제안하는 엔터프라이즈 맞춤형 솔루션</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {currentData.competencies.map((comp, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#C1121F] group-hover:text-white text-[#C1121F] transition-colors duration-300">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug">
                                    {comp.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {comp.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* 하단 CTA (Call To Action) 배너 */}
                    <div className="mt-24 bg-slate-900 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C1121F] rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                        <div className="relative z-10 text-center md:text-left">
                            <h3 className="text-3xl font-bold text-white mb-4">솔루션 도입이 필요하십니까?</h3>
                            <p className="text-slate-400 text-lg">전문 엔지니어가 귀사의 환경에 맞는 최적의 인프라를 무상으로 컨설팅해 드립니다.</p>
                        </div>
                        <Link
                            href="/support/inquiry"
                            className="relative z-10 whitespace-nowrap px-8 py-4 bg-[#C1121F] hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-900/20 text-lg"
                        >
                            무료 컨설팅 문의하기
                        </Link>
                    </div>

                </div>
            </section>

        </div>
    );
}
