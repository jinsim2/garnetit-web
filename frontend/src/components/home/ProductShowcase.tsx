"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PRODUCTS = [
    {
        id: "detail/1",
        name: "AI 돔 카메라",
        desc: "실내·외 전천후 지능형 영상 분석",
        image: "/products/dome.png"
    },
    {
        id: "detail/2",
        name: "AI 블릿 카메라",
        desc: "원거리 야간 및 악천후 최적화",
        image: "/products/bullet.png"
    },
    {
        id: "detail/3",
        name: "지능형 PTZ 카메라",
        desc: "360도 무사각 고해상도 집중 감시",
        image: "/products/ptz.png"
    },
    {
        id: "detail/4",
        name: "엔터프라이즈 NVR",
        desc: "대규모 영상 데이터 무중단 저장 및 분석",
        image: "/products/nvr.png"
    }
];

export default function ProductShowcase() {
    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="container mx-auto px-6 lg:px-12">

                {/* 💡 헤더 영역: 뱃지와 타이틀 */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#C1121F]/20 border border-[#C1121F]/30 text-[#C1121F] font-bold text-xs tracking-widest mb-4">
                            나라장터 종합쇼핑몰 우수제품
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                            자체 제조 고성능 보안 하드웨어
                        </h2>
                    </div>

                    <Link href="/product" className="group flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                        전체 제품 보기
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* 💡 제품 그리드 영역 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PRODUCTS.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                            {/* 제품 이미지 박스 */}
                            <div className="relative h-64 bg-slate-800 rounded-2xl overflow-hidden mb-6 border border-slate-700 group-hover:border-[#C1121F]/50 transition-colors duration-300">

                                {/* 
                                    이미지가 없을 때 보여줄 예비(Placeholder) 배경입니다.
                                    나중에 public/products 폴더에 이미지를 넣으시면 자동으로 이 위에 덮어씌워집니다!
                                */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                {/* 실제 제품 이미지 영역 */}
                                <div className="absolute inset-0 p-8 flex items-center justify-center">
                                    <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            priority
                                            className="object-contain drop-shadow-2xl opacity-0 transition-opacity duration-300"
                                            // 💡 팁: 이미지가 아직 없어서 엑스박스가 뜨는 것을 방지하기 위해, 
                                            // 로드 성공 시에만 opacity-100으로 보이게 하는 트릭입니다.
                                            onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 제품 텍스트 영역 */}
                            <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-[#C1121F] transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-slate-400 text-sm">
                                {product.desc}
                            </p>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}
