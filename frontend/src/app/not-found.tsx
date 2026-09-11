import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100 text-center relative overflow-hidden">
                {/* 장식용 배경 원 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1121F]/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#C1121F]">
                    <AlertTriangle size={40} />
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">404</h1>
                <h2 className="text-xl font-bold text-slate-800 mb-2">페이지를 찾을 수 없습니다.</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    요청하신 페이지의 주소가 변경되었거나,<br />
                    현재 사용할 수 없는 상태입니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                    >
                        <Home size={18} />
                        메인으로
                    </Link>
                    <Link
                        href="/support/notice"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                    >
                        고객지원
                    </Link>
                </div>
            </div>
        </div>
    );
}
