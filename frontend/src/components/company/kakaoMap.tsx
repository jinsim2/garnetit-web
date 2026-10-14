"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";

declare global {
    interface Window {
        kakao: any;
    }
}

// 📍 가넷정보기술 본사 좌표 (부산국제금융센터 BIFC2)
const GARNET_COORDS = {
    lat: 35.1467,
    lng: 129.0655,
};

export default function KakaoMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

        // 💡 1. 키가 제대로 로드되었는지 확인
        if (!appKey) {
            console.error("🚨 NEXT_PUBLIC_KAKAO_MAP_API_KEY 가 설정되지 않았습니다. ...");
            setError(true);   // 추가
            return;
        }

        const renderMap = () => {
            if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

            window.kakao.maps.load(() => {
                const container = mapRef.current;
                const options = {
                    center: new window.kakao.maps.LatLng(GARNET_COORDS.lat, GARNET_COORDS.lng),
                    level: 3,
                };

                const map = new window.kakao.maps.Map(container, options);

                // 확대/축소 줌 컨트롤
                const zoomControl = new window.kakao.maps.ZoomControl();
                map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                // 본사 마커
                const markerPosition = new window.kakao.maps.LatLng(GARNET_COORDS.lat, GARNET_COORDS.lng);
                const marker = new window.kakao.maps.Marker({ position: markerPosition });
                marker.setMap(map);

                // 말풍선 인포윈도우
                const iwContent = `
                    <div style="padding:10px 14px; min-width:180px; font-family:sans-serif; text-align:left;">
                        <div style="font-weight:bold; font-size:13px; color:#1E293B; margin-bottom:2px;">
                            (주)가넷정보기술
                        </div>
                        <div style="font-size:11px; color:#64748B;">
                            부산국제금융센터2 (BIFC2) 12층
                        </div>
                    </div>
                `;
                const infowindow = new window.kakao.maps.InfoWindow({
                    content: iwContent,
                    removable: false,
                });
                infowindow.open(map, marker);

                setIsLoaded(true);
            });
        };

        // 💡 2. 이미 SDK가 로드되어 있다면 바로 지도 그리기
        if (window.kakao && window.kakao.maps) {
            renderMap();
            return;
        }

        // 💡 3. SDK가 없다면 https:// 주소로 스크립트를 직접 동적 삽입 (Next Script 버그 우회)
        const existingScript = document.getElementById("kakao-map-sdk");
        if (!existingScript) {
            const script = document.createElement("script");
            script.id = "kakao-map-sdk";
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
            script.async = true;
            script.onload = () => renderMap();
            script.onerror = () => setError(true);  // 도메인 미등록/키 오류 시
            document.head.appendChild(script);
        } else {
            existingScript.addEventListener("load", renderMap);
        }

    }, []);

    return (
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            {/* 실제 지도가 그려지는 DOM 박스 */}
            <div ref={mapRef} className="w-full h-[420px] bg-slate-100" />

            {/* 로딩 중 */}
            {!isLoaded && !error && (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 gap-2 font-medium">
                    <MapPin className="animate-bounce text-[#C1121F]" size={20} />
                    지도를 불러오는 중입니다...
                </div>
            )}
            {/* 실패 시 */}
            {!isLoaded && error && (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
                    지도를 불러오지 못했습니다. 아래 버튼으로 카카오맵에서 확인해 주세요.
                </div>
            )}

            {/* 우측 하단 카카오맵 바로가기 배지 */}
            <a
                href={`https://map.kakao.com/link/map/가넷정보기술,${GARNET_COORDS.lat},${GARNET_COORDS.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-10 bg-white/95 hover:bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-lg shadow-md border border-slate-200 flex items-center gap-1.5 transition-all hover:text-[#C1121F]"
            >
                카카오맵에서 크게 보기 <ExternalLink size={12} />
            </a>
        </div>
    );
}
