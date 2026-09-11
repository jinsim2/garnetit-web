"use client";

export default function DashboardPage() {

    // 검사 통과 후 보여줄 진짜 대시보드 화면. 검사는 AdminGuard가 해준다.
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">대시보드 요약</h1>

            {/* AXGATE 느낌의 통계 위젯 카드들 (일단 예시 데이터를 넣습니다) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 font-medium mb-2">등록된 제품</h3>
                    <p className="text-3xl font-bold text-slate-800">12<span className="text-base font-normal text-slate-400 ml-1">개</span></p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 font-medium mb-2">구축 사례</h3>
                    <p className="text-3xl font-bold text-slate-800">45<span className="text-base font-normal text-slate-400 ml-1">건</span></p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 font-medium mb-2">파트너사</h3>
                    <p className="text-3xl font-bold text-slate-800">8<span className="text-base font-normal text-slate-400 ml-1">곳</span></p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-slate-500">대시보드에는 어떤 부분들을 넣었으면 좋을까?</p>
                <p className="text-sm mt-2 text-[#C1121F]">
                    (사이드바와 헤더는 새로고침 되지 않고 이 부분만 렌더링 된다.!)
                </p>

            </div>

        </div>
    );
}
