"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Building2, History, MapPin, Award } from "lucide-react";

// 회사소개 탭 데이터
const companyTabs = [
    { id: "about", name: "인사말", icon: Building2 },
    { id: "history", name: "회사연혁", icon: History },
    { id: "cert", name: "인증 및 특허", icon: Award },
    { id: "location", name: "오시는길", icon: MapPin },
];

export default function CompanyPage() {
    const params = useParams();
    const activeCategory = (params.category as string) || "about";

    // 클릭된 인증서의 정보를 기억하는 상태(아무것도 안 누르면 null)
    const [selectedCert, setSelectedCert] = useState<{ title: string, image: string } | null>(null);

    // 부드러운 탭 스크롤 효과 (제품 페이지에서 쓴 것과 동일!)
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
            {/* 1. Hero 상단 영역 (세련된 배경 이미지 적용) */}
            <section className="bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center py-24 px-6 relative">
                {/* 배경 이미지를 어둡게 눌러주는 오버레이 */}
                <div className="absolute inset-0 bg-[#1E293B]/80 mix-blend-multiply"></div>
                <div className="container mx-auto max-w-6xl text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        신뢰와 기술로 미래를 여는 기업 <br className="md:hidden" />
                        <span className="text-[#C1121F]">가넷정보기술</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        네트워크 통합부터 정보보안, 재난 예경보 시스템까지<br />
                        고객의 비즈니스 가치를 극대화하는 최적의 IT 인프라 파트너입니다.
                    </p>
                </div>
            </section>

            <div id="tab-anchor"></div>

            {/* 2. 탭 메뉴 영역 (sticky) */}
            <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="container mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="flex overflow-x-auto hide-scrollbar gap-8 md:justify-center">
                        {companyTabs.map((tab) => {
                            const isActive = activeCategory === tab.id;
                            const Icon = tab.icon;
                            return (
                                <Link
                                    key={tab.id}
                                    href={`/company/${tab.id}`}
                                    scroll={false}
                                    onClick={handleTabClick}
                                    className={`flex items-center gap-2 py-4 md:py-5 font-semibold text-sm md:text-base transition-colors whitespace-nowrap border-b-2 ${isActive
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

            {/* 3. 콘텐츠 영역 (동적 렌더링) */}
            <section className="py-20 px-6 lg:px-12">
                <div className="container mx-auto max-w-5xl">

                    {/* 3-1. 인사말 (CEO Greeting) */}
                    {activeCategory === "about" && (
                        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-12">
                            <div className="w-full md:w-1/3">
                                {/* 대표이사 사진 영역 */}
                                <div className="aspect-[3/4] bg-slate-200 rounded-2xl overflow-hidden relative group">
                                    <img
                                        src="/company/about.jpg"
                                        alt="vision"
                                        className="object-cover w-full h-full md:grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-2/3 space-y-6">
                                <h2 className="text-3xl font-bold text-slate-900 leading-snug">
                                    "안전한 IT 인프라로 <br /><span className="text-[#C1121F]">고객의 비즈니스 가치</span>를 극대화합니다."
                                </h2>
                                <div className="h-1 w-12 bg-[#C1121F]"></div>
                                <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                                    <p>
                                        안녕하십니까? (주)가넷정보기술 대표이사 임정헌입니다.<br />
                                        저희 홈페이지를 방문해 주신 고객 여러분께 진심으로 감사의 말씀을 드립니다.
                                    </p>
                                    <p>
                                        2014년 설립 이래, 저희 가넷정보기술은 부산·경남 지역을 대표하는 IT 보안 및 네트워크 인프라 전문 기업으로 성장해 왔습니다.
                                        특히 영상감시 체계, 네트워크 보안장비, 재난 예경보 시스템 구축 등 다양한 공공기관 프로젝트를 수행하며 그 기술력과 신뢰성을 입증받고 있습니다.
                                    </p>
                                    <p>
                                        앞으로도 끊임없는 기술 혁신과 철저한 유지보수를 통해, 단 1초의 멈춤도 허용하지 않는 무결점 IT 인프라 환경을 제공할 것을 약속드립니다.
                                    </p>
                                </div>
                                <div className="pt-8 flex flex-col gap-1 text-slate-800">
                                    <span className="font-semibold text-sm text-slate-500">(주)가넷정보기술 대표이사</span>
                                    <span className="text-2xl font-bold font-signature tracking-widest mt-1">임 정 헌</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3-2. 회사연혁 (History) - 완벽한 반응형 타임라인 */}
                    {activeCategory === "history" && (
                        <div className="max-w-4xl mx-auto py-12">
                            <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">가넷이 걸어온 길</h2>

                            {/* 전체 타임라인 래퍼 (모바일: 왼쪽에 선 / PC: 선 제거) */}
                            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-0 md:border-none">

                                {/* PC(md 이상) 전용 세로 기준선 (왼쪽에서 25% 지점에 배치) */}
                                <div className="hidden md:block absolute left-1/4 top-0 bottom-0 w-0.5 bg-slate-200 transform -translate-x-1/2"></div>

                                {/* --- 2026년 --- */}
                                <div className="mb-16 relative md:flex md:gap-12 w-full group">
                                    {/* 빨간색 동그라미 (모바일: 왼쪽 선 위 / PC: 25% 기준선 위) */}
                                    <div className="absolute -left-[9px] top-1.5 md:left-1/4 md:top-2 w-4 h-4 rounded-full bg-[#C1121F] border-4 border-white shadow-sm z-10 md:-translate-x-1/2 group-hover:scale-150 transition-transform duration-300"></div>

                                    {/* 년도 영역 (모바일: 왼쪽 여백 / PC: 폭 25% 차지 및 우측 정렬) */}
                                    <div className="pl-6 md:pl-0 md:w-1/4 md:text-right mb-4 md:mb-0">
                                        <h3 className="text-3xl font-black text-[#C1121F] tracking-tighter">2026</h3>
                                    </div>

                                    {/* 내용 영역 (모바일: 왼쪽 여백 / PC: 폭 75% 차지) */}
                                    <div className="pl-6 md:pl-0 md:w-3/4">
                                        <ul className="space-y-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                            <li className="flex flex-col sm:flex-row gap-1 sm:gap-6">
                                                <span className="font-bold text-slate-800 text-lg w-16 shrink-0">12월</span>
                                                <span className="text-slate-600 text-lg">부산시 재난예경보 시스템 고도화 사업 수주</span>
                                            </li>
                                            <li className="flex flex-col sm:flex-row gap-1 sm:gap-6">
                                                <span className="font-bold text-slate-800 text-lg w-16 shrink-0">05월</span>
                                                <span className="text-slate-600 text-lg">본사 사옥 확장 이전 (부산국제금융센터)</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {/* --- 2014년 --- */}
                                <div className="mb-16 relative md:flex md:gap-12 w-full group">
                                    {/* 회색 동그라미 */}
                                    <div className="absolute -left-[9px] top-1.5 md:left-1/4 md:top-2 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm z-10 md:-translate-x-1/2 group-hover:scale-150 transition-transform duration-300"></div>

                                    <div className="pl-6 md:pl-0 md:w-1/4 md:text-right mb-4 md:mb-0">
                                        <h3 className="text-3xl font-black text-slate-400 tracking-tighter">2014</h3>
                                    </div>

                                    <div className="pl-6 md:pl-0 md:w-3/4">
                                        <ul className="space-y-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                            <li className="flex flex-col sm:flex-row gap-1 sm:gap-6">
                                                <span className="font-bold text-slate-800 text-lg w-16 shrink-0">03월</span>
                                                <span className="text-slate-600 text-lg">(주)가넷정보기술 법인 설립</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* 3-3. 인증 및 특허 (certification) */}
                    {activeCategory === "cert" && (
                        <div className="space-y-12 py-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">인증 및 특허</h2>
                                <p className="text-slate-500 text-lg">끊임없는 연구 개발과 품질 경영으로 인정받은 기술력입니다.</p>
                            </div>
                            {/* 반응형 그리드: 모바일 2줄, 태블릿 3줄, PC 4줄 */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                                {/* 가짜 데이터 배열로 map을 돌립니다. 
                                    실제로는 회원님이 public/cert 폴더에 넣으신 이미지 파일명을 맞춰서 쓰시면 됩니다. */}
                                {[
                                    { title: "직접생산확인증명서", type: "영상감시장치", date: "2023.08", image: "cert1.png" },
                                    { title: "품질경영시스템인증", type: "ISO 9001", date: "2022.05", image: "cert2.png" },
                                    { title: "정보통신공사업 등록", type: "기업면허", date: "2026.03", image: "cert_telecom_2026.png" },
                                    { title: "소프트웨어사업자", type: "기업면허", date: "2015.01", image: "cert4.png" },
                                    { title: "벤처기업확인서", type: "기업인증", date: "2021.11", image: "cert5.png" },
                                    { title: "우수기술기업인증", type: "T-4 등급", date: "2023.02", image: "cert6.png" }
                                ].map((cert, idx) => (
                                    <div key={idx} className="group cursor-pointer" onClick={() => setSelectedCert({ title: cert.title, image: cert.image })}>

                                        {/* 문서 이미지 영역 (호버 시 확대 + 돋보기 등장 효과) */}
                                        <div className="bg-white border border-slate-200 rounded-2xl aspect-[3/4] overflow-hidden relative mb-5 shadow-sm group-hover:shadow-xl group-hover:border-[#C1121F]/30 transition-all duration-500 flex items-center justify-center p-4">

                                            {/* ✨ 여기에 실제 이미지를 띄웁니다. 
                                                회원님의 파일 이름이 다르면 배열의 image 속성을 수정해주세요! 
                                            */}
                                            <img
                                                src={`/cert/${cert.image}`}
                                                alt={cert.title}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                                // 이미지가 없을 때 엑스박스 대신 빈 회색 박스로 보이도록 에러 처리 (시연용 방어코드)
                                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                                            />

                                            {/* 이미지가 없을 때 나타나는 시연용 글자 (실제 이미지가 잘 뜨면 안보입니다) */}
                                            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-300 font-bold text-xl -z-10">
                                                문서 이미지
                                            </div>

                                            {/* 마우스 올렸을 때 나타나는 돋보기 오버레이 효과 */}
                                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300 flex items-center justify-center">
                                                <div className="bg-white text-slate-800 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                                    {/* 루시드 아이콘 대신 더 가벼운 SVG 하드코딩 돋보기 */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                                </div>
                                            </div>
                                        </div>
                                        {/* 하단 텍스트 영역 */}
                                        <div className="px-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-[#C1121F] bg-[#C1121F]/10 px-2.5 py-1 rounded-md">
                                                    {cert.type}
                                                </span>
                                                <span className="text-xs font-medium text-slate-400">
                                                    {cert.date}
                                                </span>
                                            </div>
                                            <h3 className="text-slate-900 font-bold text-lg group-hover:text-[#C1121F] transition-colors">
                                                {cert.title}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* 3-4. 오시는 길 (Location) */}
                    {activeCategory === "location" && (
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8">오시는 길</h2>

                            {/* 지도 자리 (시연용 가짜 이미지) */}
                            <div className="w-full h-96 bg-slate-200 rounded-2xl mb-8 overflow-hidden relative group flex items-center justify-center">
                                <span className="text-slate-400 font-medium z-10 bg-white/90 px-6 py-2 rounded-full shadow-sm">
                                    📍 카카오맵 API가 연동될 자리입니다.
                                </span>
                                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="map placeholder" />
                            </div>

                            {/* 실제 스크래핑한 주소 정보 */}
                            <div className="grid md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-2xl">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                        <MapPin size={18} className="text-[#C1121F]" /> 주소
                                    </h4>
                                    <p className="text-slate-600 pl-6">부산광역시 남구 남동천로 128<br />1227호 ~ 1229호 (문현동, 부산국제금융센터2)</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                        <Building2 size={18} className="text-[#C1121F]" /> 연락처
                                    </h4>
                                    <p className="text-slate-600 pl-6">TEL : 051-925-1222<br />FAX : 051-925-1223</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </section>

            {/* ✨ 인증서 확대 모달 (라이트박스) */}
            {selectedCert && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6 cursor-zoom-out animate-in fade-in duration-300"
                    onClick={() => setSelectedCert(null)} // 여백을 클릭하면 창 닫기
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-2xl shadow-2xl cursor-default"
                        onClick={(e) => e.stopPropagation()} // 하얀 박스를 눌렀을 땐 안 닫히게 막기
                    >
                        {/* 닫기 버튼 */}
                        <button
                            className="absolute -top-12 right-0 text-white hover:text-slate-300 flex items-center gap-2 font-bold"
                            onClick={() => setSelectedCert(null)}
                        >
                            닫기 ✕
                        </button>

                        {/* 큼지막한 이미지 출력 */}
                        <div className="w-full h-full max-h-[85vh] overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                            <img
                                src={`/cert/${selectedCert.image}`}
                                alt={selectedCert.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
