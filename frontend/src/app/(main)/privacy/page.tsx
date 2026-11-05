import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
    title: "개인정보처리방침",
    description: "(주)가넷정보기술 홈페이지 개인정보처리방침 안내입니다.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6 lg:px-12">
            <div className="container mx-auto max-w-4xl">
                {/* 상단 타이틀 카드 */}
                <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mb-8 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C1121F]/20 border border-[#C1121F]/30 text-[#C1121F] text-xs font-bold tracking-wider uppercase mb-4">
                            <ShieldCheck size={15} /> Privacy Policy
                        </div>
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                            개인정보처리방침
                        </h1>
                        <p className="text-slate-300 text-sm md:text-base mt-3 leading-relaxed">
                            (주)가넷정보기술은 고객님의 개인정보를 소중히 다루며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
                        </p>
                    </div>
                </div>

                {/* 본문 영역 */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-8 text-slate-600 text-sm md:text-base leading-relaxed">
                    <section className="space-y-3">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900">
                            1. 개인정보의 처리 목적
                        </h2>
                        <p>
                            (주)가넷정보기술(이하 &apos;회사&apos;)은 다음의 목적을 위하여 최소한의 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                            <li>온라인 도입 문의 및 견적 상담 접수·회신</li>
                            <li>기술 지원 및 유지보수(A/S) 관련 고객 응대</li>
                            <li>문의 내역 확인 및 상담 이력 관리</li>
                        </ul>
                    </section>

                    <section className="space-y-3 border-t border-slate-100 pt-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900">
                            2. 수집하는 개인정보의 항목 및 수집 방법
                        </h2>
                        <p>
                            회사는 별도의 회원가입 없이 홈페이지를 운영하며, <strong>온라인 문의</strong> 접수 시에만 아래와 같은 항목을 수집합니다.
                        </p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2 text-sm">
                            <p><strong className="text-slate-900">• 필수 수집 항목:</strong> 회사명(기관명), 담당자 성함, 연락처(전화번호), 이메일 주소, 문의 내용</p>
                            <p><strong className="text-slate-900">• 수집 방법:</strong> 홈페이지 내 &apos;고객지원 &gt; 온라인 문의&apos; 양식을 통한 이용자 직접 입력</p>
                        </div>
                    </section>

                    <section className="space-y-3 border-t border-slate-100 pt-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900">
                            3. 개인정보의 처리 및 보유 기간
                        </h2>
                        <p>
                            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보 수집 시에 동의받은 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                            <li><strong>보유 기간:</strong> 온라인 문의 접수 및 상담 완료 후 <strong>3년간 보관 후 파기</strong> (단, 정보주체의 삭제 요청 시 지체 없이 파기)</li>
                        </ul>
                    </section>

                    <section className="space-y-3 border-t border-slate-100 pt-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900">
                            4. 개인정보의 제3자 제공 및 위탁
                        </h2>
                        <p>
                            회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 사전 동의나 법률의 특별한 규정이 있는 경우를 제외하고는 개인정보를 제3자에게 제공하거나 외부에 위탁하지 않습니다.
                        </p>
                    </section>

                    <section className="space-y-3 border-t border-slate-100 pt-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900">
                            5. 정보주체의 권리·의무 및 파기절차
                        </h2>
                        <p>
                            정보주체는 언제든지 회사에 대해 본인의 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있으며, 회사는 보유 기간의 경과 또는 처리 목적 달성 시 전자적 파일 형태인 경우 복원이 불가능한 방법으로 영구 삭제합니다.
                        </p>
                    </section>

                    <section className="space-y-3 border-t border-slate-100 pt-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900">
                            6. 개인정보 보호책임자 및 담당 부서 안내
                        </h2>
                        <p>
                            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 관련 불만처리 및 피해구제를 위하여 아래와 같이 개인정보 보호 담당 부서를 지정하고 있습니다.
                        </p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-1.5 text-sm">
                            <p><strong className="text-slate-900">• 상호명:</strong> (주)가넷정보기술</p>
                            <p><strong className="text-slate-900">• 주소:</strong> 부산광역시 남구 남동천로 128, 1227~1229호 (문현동, 부산국제금융센터2)</p>
                            <p><strong className="text-slate-900">• 대표전화:</strong> 051-925-1223</p>
                            <p><strong className="text-slate-900">• 이메일:</strong> garnet@garnetit.co.kr</p>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>시행일자: 2026년 1월 1일</span>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-[#C1121F] transition-colors"
                        >
                            <ArrowLeft size={14} /> 메인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}