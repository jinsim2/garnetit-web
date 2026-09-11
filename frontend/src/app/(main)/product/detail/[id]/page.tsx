"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Mail, CheckCircle2, Shield, Zap, Settings, Eye } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

// --- 상세 페이지용 가짜 데이터 (Dummy Data) ---
// 실제 DB가 연결되면 이 부분은 지워지고 fetch API로 대체됩니다.
const detailedProducts = {
    // ID 1번: CCTV 돔 카메라 예시
    "1": {
        id: "1",
        name: "GARNET Full-HD IR 돔 카메라",
        model: "GCD-403020I-01",
        desc: "어두운 환경에서도 선명한 Full-HD 화질과 IR 기술을 탑재하여 완벽한 실내외 감시를 지원합니다.",
        image: "/products/dome.png",
        category: "cctv",
        features: [
            { icon: Eye, title: "Full-HD 고해상도", desc: "1920x1080 해상도로 또렷한 객체 식별이 가능합니다." },
            { icon: Zap, title: "스마트 IR 기술", desc: "빛이 전혀 없는 야간에도 최대 30m 가시거리를 확보합니다." },
            { icon: Shield, title: "강력한 내구성", desc: "IP67 방수방진 및 IK10 내충격 인증을 획득하여 실외 환경에서도 안전합니다." },
            { icon: Settings, title: "PoE 지원", desc: "랜선 하나로 전원과 데이터를 동시에 전송하여 시공이 간편합니다." }
        ],
        specs: [
            { label: "이미지 센서", value: "1/2.8\" 2MP CMOS" },
            { label: "최대 해상도", value: "1920 x 1080 @ 30fps" },
            { label: "초점 거리", value: "2.8mm / 4.0mm 고정 초점 렌즈" },
            { label: "최저 조도", value: "Color: 0.01 Lux / B&W: 0 Lux (IR LED On)" },
            { label: "비디오 압축", value: "H.265, H.264, MJPEG" },
            { label: "네트워크 통신", value: "10/100 Mbps Ethernet, PoE (IEEE802.3af)" },
            { label: "동작 온도/습도", value: "-30°C ~ 60°C / 95% RH 이하" }
        ]
    },
    // ID 5번: 엑스게이트 방화벽 예시
    "5": {
        id: "5",
        name: "AXGATE 차세대 통합 방화벽",
        model: "AXGATE 7000S",
        desc: "대규모 네트워크 환경을 위한 최고의 성능. 완벽한 위협 탐지 및 차단 성능을 제공하는 차세대 통합보안 시스템(NGFW).",
        image: "/products/AXGATE_7000S.png",
        category: "network",
        features: [
            { icon: Shield, title: "강력한 방화벽 성능", desc: "최대 40Gbps의 방화벽 처리 성능을 제공합니다." },
            { icon: Zap, title: "멀티코어 분산 처리", desc: "독자적인 분산 처리 기술로 트래픽 병목 현상을 제거합니다." },
            { icon: CheckCircle2, title: "랜섬웨어 원천 차단", desc: "알려지지 않은 신종 악성코드 및 랜섬웨어를 사전에 탐지합니다." },
            { icon: Settings, title: "고가용성(HA)", desc: "시스템 장애 시에도 무중단 서비스를 보장하는 이중화 기능을 지원합니다." }
        ],
        specs: [
            { label: "방화벽 처리 성능", value: "40 Gbps" },
            { label: "VPN 처리 성능", value: "15 Gbps" },
            { label: "IPS 처리 성능", value: "10 Gbps" },
            { label: "최대 동시 연결 수", value: "8,000,000 Sessions" },
            { label: "네트워크 인터페이스", value: "8 x 1GbE (RJ45), 4 x 10GbE (SFP+)" },
            { label: "전원 공급 장치", value: "Redundant Power Supply (이중화)" },
            { label: "외형 크기 (장비)", value: "2U 랙마운트 사이즈" }
        ]
    },
};

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // 시연용 가짜 데이터 가져오기 (만약 매칭되는 ID가 없으면 1번 데이터를 보여줍니다)
    const product = detailedProducts[id as keyof typeof detailedProducts] || detailedProducts["1"];

    return (
        <div className="min-h-screen bg-slate-50 pb-32">

            {/* 1. 상단 뒤로가기 네비게이션 */}
            <div className="bg-white border-b border-slate-200 sticky top-20 z-40">
                <div className="container mx-auto max-w-6xl px-6 lg:px-12 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-[#C1121F] transition-colors font-medium"
                    >
                        <ArrowLeft size={18} />
                        목록으로 돌아가기
                    </button>
                </div>
            </div>

            {/* 2. Hero 섹션 (제품 메인 소개) */}
            <section className="bg-white py-16 lg:py-24 border-b border-slate-100">
                <div className="container mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        {/* 좌측: 대형 제품 이미지 */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-square md:aspect-[4/3] bg-slate-50 rounded-3xl overflow-hidden p-12 flex items-center justify-center border border-slate-100 group">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* 우측: 텍스트 및 CTA(행동유도) 버튼 */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 font-bold tracking-wider text-sm rounded-full mb-4">
                                    {product.model}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                                    {product.name}
                                </h1>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {product.desc}
                                </p>
                            </div>

                            {/* B2B 영업을 위한 핵심 버튼 2개 */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                                <Link
                                    href={`/support/inquiry`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#C1121F] text-white py-4 px-6 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-slate-200"
                                >
                                    <Mail size={20} />
                                    도입 문의하기
                                </Link>
                                <button
                                    className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-[#C1121F] py-4 px-6 rounded-xl font-bold text-lg transition-colors"
                                    onClick={() => alert("해당 제품의 PDF 카탈로그 다운로드가 시작됩니다! (시연용)")}
                                >
                                    <Download size={20} />
                                    카탈로그 다운로드
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. 특장점(Features) - 벤토(Bento) 그리드 스타일 */}
            <section className="py-24 px-6 lg:px-12 bg-slate-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">핵심 특장점</h2>
                        <p className="text-slate-500 text-lg">가넷정보기술의 차별화된 기술력을 확인하십시오.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {product.features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-start gap-6">
                                    <div className="p-4 bg-slate-50 text-[#C1121F] rounded-xl flex-shrink-0">
                                        <Icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. 기술 제원(Specifications) 표 (Shadcn UI 버전!) */}
            <section className="py-24 px-6 lg:px-12 bg-white border-t border-slate-200">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">기술 스펙 (Specifications)</h2>
                        <p className="text-slate-500 text-lg">엔지니어 및 실무자를 위한 상세 제원입니다.</p>
                    </div>
                    {/* ✨ 여기서부터 Shadcn UI Table이 적용됩니다 */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <Table>
                            <TableBody>
                                {product.specs.map((spec, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="w-1/3 py-5 px-6 lg:px-8 bg-slate-50/50 font-semibold text-slate-700 border-r border-slate-100">
                                            {spec.label}
                                        </TableCell>
                                        <TableCell className="py-5 px-6 lg:px-8 text-slate-600 font-medium">
                                            {spec.value}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </section>
        </div>
    );
}
