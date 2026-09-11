import Link from "next/link";
// import Image from "next/image"; // 나중에 푸터 전용 로고 이미지가 생기면 사용하세요!

export default function Footer() {
    return (
        <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
            <div className="container mx-auto px-6 lg:px-12">

                {/* 💡 1. 상단: 강렬한 영업 사원 (Call to Action) */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-12 mb-12 gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">보안 인프라 통합 구축이 필요하신가요?</h2>
                        <p className="text-slate-400">가넷정보기술의 보안 전문가가 귀사에 최적화된 맞춤형 솔루션을 제안해 드립니다.</p>
                    </div>
                    <Link href="/support/inquiry" className="px-8 py-4 bg-[#C1121F] hover:bg-[#A00F19] text-white font-bold rounded-lg transition-colors flex items-center shadow-lg shadow-[#C1121F]/20">
                        프로젝트 도입 문의
                    </Link>
                </div>

                {/* 💡 2. 하단: 회사 정보 및 필수 링크 (B2B 신뢰의 명함) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">

                    {/* 회사 정보 (왼쪽 넓은 영역 50% 차지) */}
                    <div className="lg:col-span-2">
                        {/* 흰색 로고 텍스트 (나중에 이미지로 교체 가능) */}
                        <div className="text-2xl font-black text-white tracking-tighter mb-6">
                            GARNET <span className="text-[#C1121F]">IT</span>
                        </div>
                        <ul className="text-sm text-slate-400 space-y-3 font-light">
                            <li><strong className="font-semibold text-slate-300">상호명:</strong> 가넷정보기술</li>
                            <li><strong className="font-semibold text-slate-300">주소:</strong> 부산광역시 남구 남동천로 128 1227~1229호 (문현동, 부산국제금융센터2)</li>
                            <li><strong className="font-semibold text-slate-300">대표전화:</strong> 051-925-1223</li>
                            <li><strong className="font-semibold text-slate-300">이메일:</strong> garnet@garnetit.co.kr</li>
                        </ul>
                    </div>

                    {/* 바로가기 링크 (필수 메뉴만 압축) */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Quick Links</h4>
                        <ul className="text-sm text-slate-400 space-y-3">
                            <li><Link href="/company/about" className="hover:text-[#C1121F] transition-colors">회사소개</Link></li>
                            <li><Link href="/business/cctv" className="hover:text-[#C1121F] transition-colors">핵심 사업영역</Link></li>
                            <li><Link href="https://shop.g2b.go.kr/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C1121F] transition-colors">나라장터 제품</Link></li>
                        </ul>
                    </div>

                    {/* 고객 지원 및 정책 */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support & Policy</h4>
                        <ul className="text-sm text-slate-400 space-y-3">
                            <li><Link href="/support/notice" className="hover:text-[#C1121F] transition-colors">공지사항</Link></li>
                            <li><Link href="/support/inquiry" className="hover:text-[#C1121F] transition-colors">온라인 문의</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
                        </ul>
                    </div>
                </div>

                {/* 💡 3. 카피라이트 */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 text-xs text-slate-500">
                    <p>© 2026 Garnet Information Technology. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
