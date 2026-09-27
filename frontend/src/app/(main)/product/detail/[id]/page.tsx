"use client";

import { useState, useEffect } from "react"; // [추가됨]
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// [수정됨] DB에 저장된 아이콘 문자열("Check", "Eye" 등)을 실제 아이콘으로 바꿔주기 위해 다 불러온다.
import { ArrowLeft, Download, Mail, Check, Eye, Zap, Shield, Settings, Server, Video, Wifi, Loader2 } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types/product";  // [추가됨] 타입 불러오기

// [추가됨] 백엔드에서 온 글자(string)를 진짜 아이콘 컴포넌트로 변환해 주는 마법의 사전
const ICON_MAP: Record<string, any> = {
    "Check": Check,
    "Eye": Eye,
    "Zap": Zap,
    "Shield": Shield,
    "Settings": Settings,
    "Download": Download,
    "Video": Video,
    "Wifi": Wifi,
};


export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // [추가됨] 백엔드에서 가져온 진짜 '단 1개의 제품'을 담을 바구니
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // [추가됨] 화면이 커지면 주소창의 ID를 백엔드에 던져서 제품을 찾아온다!
    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        fetch(`/api/v1/products/${id}`)
            .then(res => {
                if (!res.ok) {
                    alert("삭제되었거나 존재하지 않는 제품입니다.");
                    router.back();
                    throw new Error("제품을 찾을 수 없습니다.");
                }
                return res.json();
            })
            .then(data => setProduct(data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));

    }, [id, router]);

    // 데이터를 가져오는 동안에는 로딩 뺑뺑이를 보여준다.
    if (isLoading) {
        return (
            <div className="min-h-screen flex itmes-center jsutify-center bg-slate-50">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    // 만약 제품이 없다면 빈 화면을 보여준다.
    if (!product) return null;

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
                                    src={product.image_url || "/products/dome.png"}
                                    alt={product.name}
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* 우측: 텍스트 및 CTA(행동유도) 버튼 */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 font-bold tracking-wider text-sm rounded-full mb-4">
                                    {product.model_number} {/* 모델명 */}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                                    {product.name}
                                </h1>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {product.description} {/* 상세 설명 */}
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
                                {/* 💡 [트렌디한 방식] 카탈로그가 있으면 a 태그(버튼 모양), 없으면 비활성화된 버튼을 보여줍니다. */}
                                {product.catalog_url ? (
                                    <a
                                        href={product.catalog_url}
                                        target="_blank" // 새 창에서 열기 (선택)
                                        rel="noopener noreferrer"
                                        download // 다운로드 속성 부여
                                        className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-[#C1121F] py-4 px-6 rounded-xl font-bold text-lg transition-colors"
                                    >
                                        <Download size={20} />
                                        카탈로그 다운로드
                                    </a>
                                ) : (
                                    <button
                                        disabled
                                        className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-400 border-2 border-slate-200 py-4 px-6 rounded-xl font-bold text-lg cursor-not-allowed"
                                        onClick={() => alert("등록된 카탈로그가 없습니다.")}
                                    >
                                        <Download size={20} />
                                        카탈로그 준비중
                                    </button>
                                )}

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
                        {/* 💡 [수정됨] 객체 배열 맵핑 및 아이콘 동적 변환 */}
                        {product.features?.map((feature, idx) => {
                            // DB에 저장된 아이콘 이름("Check")을 실제 루시드 아이콘 컴포넌트로 변환!
                            // 만약 맵핑이 안 되면 기본값으로 Check 아이콘을 띄움.
                            const Icon = ICON_MAP[feature.icon] || Check;
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
                                {/* 💡 [수정됨] 기술 스펙 동적 맵핑 */}
                                {product.specs?.map((spec, idx) => (
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
