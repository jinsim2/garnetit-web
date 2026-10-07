import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 서버 환경변수에 백엔드 주소가 있으면 그걸 쓰고, 없으면 로컬로 간주
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// 💡 [추가됨] 백엔드의 절대 주소(http://localhost...)를 프록시 주소(/backend-uploads/...)로 변장시켜주는 함수
export function getProxyImageUrl(url: string | undefined | null) {
  if (!url) return "/products/dome.png"; // 기본 이미지

  // 1. 정상적인 상대 경로로 들어온 경우 (Best Case)
  if (url.startsWith("/uploads/")) {
    return url.replace("/uploads/", "/backend-uploads/");
  }
  // 2. 만약의 사태를 대비한 방어 로직 (기존 localhost 데이터가 남아있을 경우)
  if (url.includes("localhost:8000/uploads/")) {
    // 도메인을 잘라내고 프록시 주소로 바꾼다
    return url.split("localhost:8000")[1].replace("/uploads/", "/backend-uploads/");
  }

  return url;
}