import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 기본값 10분(나중에 환경설정에서 받아오도록 변경 할 예정)
export function useIdleTimeout(timeoutMinutes: number = 10) {
    const router = useRouter();
    const timeoutMs = timeoutMinutes * 60 * 1000;

    const [remainingTime, setRemainingTime] = useState(timeoutMs);
    const lastActivityRef = useRef(Date.now());  //  핵심! 렌더링 없이 값만 기억하는 함수

    // 로그아웃 처리 함수
    const handleLogout = useCallback(() => {
        localStorage.removeItem('admin_token');
        window.location.href = "/garnet-adm/login";
    }, []);

    useEffect(() => {
        // 1. 마우스나 키보드가 움직일 때마다 '마지막 활동 시간'만 조용히 갱신한다.
        const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
        const updateLastActivity = () => {
            lastActivityRef.current = Date.now();
        };

        activityEvents.forEach(event => document.addEventListener(event, updateLastActivity));

        // 2. 1초마다 남은 시간을 계산해서 화면을 1번씩만 그리기 (성능 최적화)
        const intervalId = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastActivityRef.current;  // 안 움직인 시간
            const remaining = timeoutMs - elapsed;

            if (remaining <= 0) {
                // 10분이 넘도록 안 움직였다면!
                clearInterval(intervalId);
                alert("보안을 위해 장시간 활동이 없어 자동 로그아웃 되었습니다.")
                handleLogout();
            } else {
                setRemainingTime(remaining);  // 남은 시간 업데이트
            }
        }, 1000);

        // 클린업: 컴포넌트가 사라질 때 이벤트 리스너 청소
        return () => {
            activityEvents.forEach(event => document.removeEventListener(event, updateLastActivity));
            clearInterval(intervalId);
        };

    }, [timeoutMs, handleLogout]);

    //  화면에 보여줄 "09:59" 포맷으로 변환
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return { formattedTime, handleLogout };

}