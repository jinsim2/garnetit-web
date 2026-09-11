"use client";

import { Video, Network, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BUSINESS_AREAS = [
    {
        id: "cctv",
        title: "CCTV & 보안 시스템",
        desc: "AI 기반의 고해상도 지능형 CCTV와 완벽한 출입통제 시스템으로 빈틈없는 보안 환경을 구축합니다.",
        icon: Video,
        image: "/business/cctv.jpg",
        tags: ["지능형 CCTV", "출입통제", "영상분석"]
    },
    {
        id: "network",
        title: "네트워크 & 인프라",
        desc: "차세대 방화벽과 최신 네트워크 장비를 기반으로 빠르고 안전한 무중단 기업 통신망을 설계합니다.",
        icon: Network,
        image: "/business/network.png",
        tags: ["방화벽", "라우터/스위치", "보안네트워크"]
    },
    {
        id: "broadcast",
        title: "재난 예경보 시스템",
        desc: "마을방송, 옥외 전광판, 민방위 경보 시스템 등 시민의 안전을 책임지는 통합 재난 예방 시스템을 구축합니다.",
        icon: AlertTriangle,
        image: "/business/disaster.png",
        tags: ["마을방송", "옥외전광판", "재난경보"]
    }
];

export default function BusinessSection() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* 섹션 헤더 */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-[#C1121F] uppercase mb-3">Our Business</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            가넷정보기술의 <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
                                핵심 비즈니스 영역
                            </span>
                        </h3>
                    </div>
                </div>

                {/* 3단 카드 그리드 (SolutionSection UI 재활용) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {BUSINESS_AREAS.map((business, idx) => {
                        const Icon = business.icon;
                        return (
                            <Link key={idx} href={`/business/${business.id}`} className="group block h-full">
                                <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:border-[#C1121F]/20 transition-all duration-500 h-full flex flex-col">

                                    {/* 썸네일 이미지 영역 */}
                                    <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                                        <div className="absolute inset-0 bg-slate-800/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-200 transform group-hover:scale-110 transition-transform duration-700">
                                            {/* 나중에 이미지가 준비되면 이 주석을 풀고 사용하세요! */}
                                            <Image
                                                src={business.image}
                                                alt={business.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover"
                                            />
                                            <span className="text-xs font-bold tracking-widest uppercase">Image Placeholder</span>
                                        </div>
                                    </div>

                                    {/* 하단 텍스트 및 아이콘 영역 */}
                                    <div className="p-8 flex flex-col flex-grow relative">
                                        <div className="absolute -top-8 right-8 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-[#C1121F] transition-colors duration-500 z-20">
                                            <Icon className="w-8 h-8" strokeWidth={1.5} />
                                        </div>

                                        <h4 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#C1121F] transition-colors mt-4">
                                            {business.title}
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                                            {business.desc}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {business.tags.map((tag, tIdx) => (
                                                <span key={tIdx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full group-hover:bg-[#C1121F]/10 group-hover:text-[#C1121F] transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
