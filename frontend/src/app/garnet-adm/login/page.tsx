"use client"  // 이 페이지는 버튼 클릭 등 사용자의 액션이 있으므로 클라이언트 컴포넌트로 선언한다.

import { useState } from "react";
import { useRouter } from "next/navigation"; // NEXTJS에서 페이지를 이동시킬 때 사용한다. (Next.js 훅)

export default function AdminLoginPage() {
    // 1. 사용자가 입력할 이메일과 비밀번호 상태(state) 관리
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");  // 에러 메시지 찍을 공간
    const router = useRouter();

    // 2. 로그인 버튼을 눌렀을 때 생성되는 함수
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 버튼 눌렀을 때 페이지가 새로고침 되는 기본 동작을 막는다.
        setError(""); // 기존 에러 초기화

        try {
            // 중요: 백엔드의 OAuth2 로그인 방식은 일반 JSON이 아니라 '돔 데이터' 형식을 원한다.
            const formData = new URLSearchParams();
            formData.append("username", email); // 이메일(아이디)을 'username' 키값으로 넣는다. 이후 백엔드가 받는다.
            formData.append("password", password); // 비밀번호를 'password' 키값으로 넣는다.

            // 3. 백엔드로 로그인 요청을 보낸다.
            const res = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
            });

            // 4. 백엔드에서 401(거절) 에러를 뱉었다면?
            if (!res.ok) {
                throw new Error("이메일이나 비밀번호가 틀렸습니다.");
            }

            // 5. 로그인 성공! 백엔드가 준 데이터를 JSON으로 푼다.
            const data = await res.json();

            // 6. 가장 중요! 발급받은 'JWT 토큰(출입중)'을 브라우저의 localStorage에 저장한다.
            localStorage.setItem("admin_token", data.access_token);

            // 7. 관리자 대시보드 화면으로 이동시킨다.
            router.push("/garnet-adm/dashboard");

        } catch (err: any) {
            setError(err.message); // 에러가 났다면 에러 메시지를 화면에 띄운다.

        }

    };

    return (
        // 배경은 네이비(slate-900), 로그인 카드는 화이트(slate-50)로 구성한다.
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-50 rounded-2xl shadow-2xl p-8">

                {/* 타이틀 영역 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1E293B]">
                        GARNET<span className="text-[#C1121F]">IT</span>
                    </h1>
                    <p className="text-slate-500 mt-2">관리자 시스템 로그인</p>
                </div>
                {/* 폼(Form) 영역 */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">이메일 (ID)</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
                            placeholder="admin@garnetit.co.kr"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">비밀번호</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* 에러 메시지 표시 영역 (에러가 있을 때만 빨간 박스가 뜬다) */}
                    {error && (
                        <div className="text-[#C1121F] text-sm text-center bg-red-50 py-2 rounded">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-[#1E293B] hover:bg-[#0f172a] text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );

}