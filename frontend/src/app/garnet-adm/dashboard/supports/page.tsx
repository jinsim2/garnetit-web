export default function SupportsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">고객 문의 관리</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-slate-500">이곳은 고객 문의 목록이 들어갈 오른쪽 화면입니다!</p>
                <p className="text-sm mt-2 text-[#C1121F]">
                    (사이드바와 헤더는 새로고침 되지 않고 이 부분만 렌더링 된다.!)
                </p>
            </div>
        </div>
    );
}