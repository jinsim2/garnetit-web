"use client";

import { useState, useEffect } from "react"; // [추가됨] 데이터를 불러와서 담아둘 바구니
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Network, Mic } from "lucide-react";
import type { Product, Category } from "@/types/product"; // [추가됨] 글로벌 타입 임포트

// [추가됨] 백엔드 카테고리(Slug) 이름에 맞춰 아이콘을 맵핑해주는 딕셔너리
const CATEGORY_ICONS: Record<string, any> = {
    "cctv": ShieldCheck,
    "network": Network,
    "audio": Mic,
}

export default function ProductPage() {

    // 주소창에서 [category] 글자를 쏙 빼온다. (예: 주소가 /product/network 면 "network"를 가져옴)
    const params = useParams();
    const activeCategory = params.category as string;

    // [추가됨] 백엔드에서 가져온 진짜 데이터를 담을 바구니(State)
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // [추가됨] 화면이 켜지거나 카테고리 탭(slug)이 바뀔 때마다 백엔드에 요청!
    useEffect(() => {
        // 1. 최상단 메뉴를 그리기 위해 카테고리 목록 가져오기
        fetch("http://localhost:8000/api/v1/categories/?is_visible=true")
            .then(res => res.json())
            .then(data => setCategories(data));

        // 2. 주소창의 slug("cctv")를 백엔드에 던져서, 해당 카테고리 제품만 쏙 가져오기!
        if (activeCategory) {
            setIsLoading(true);
            fetch(`http://localhost:8000/api/v1/products/?category_slug=${activeCategory}`)
                .then(res => res.json())
                .then(data => setProducts(data))
                .finally(() => setIsLoading(false));
        }

    }, [activeCategory]);

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
                            // categories 테이블에서 type 컬럼의 값이 "PRODUCT" 인 것만 필터링
                            if (category.type !== "PRODUCT") return null;

                            // [수정됨] id 비교 -> slug 비교로 변경, Icon 맵핑 방식 변경
                            // [방어 코드] 나중에 관리자에서 아이콘 맵핑이 안 된 새 카테고리를 만들면
                            // 에러가 나지 않도록 기본값(|| ShieldCheck)을 준다.
                            const isActive = activeCategory === category.slug;
                            const Icon = CATEGORY_ICONS[category.slug] || ShieldCheck;

                            return (
                                // button 대신 Link로 변경하고, href로 이동시킨다.
                                <Link
                                    key={category.id}
                                    href={`/product/${category.slug}`}
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
                    {products.map((product, index) => {
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
                                            src={product.image_url || "/products/dome.png"}
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
                                    {/* [수정됨] 모델명 대신 제품 한 줄 설명(description) 렌더링 */}
                                    <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 font-medium text-sm rounded-full">
                                        {product.description || product.model_number}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                        {product.name}
                                    </h2>

                                    {/* [수정됨] 객체 배열로 업그레이드 된 특징(features) 렌더링 */}
                                    <ul className="space-y-3 py-4 border-y border-slate-100">
                                        {product.features?.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                                <div className="w-2 h-2 rounded-full bg-[#C1121F]"></div>
                                                {feature.title} {/* 객체 안의 title만 꺼내서 보여준다! */}
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
