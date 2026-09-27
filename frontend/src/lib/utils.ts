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

  // 만약 URL이 로컬 백엔드 주소로 시작한다면?
  if (url.startsWith(`${BACKEND_URL}/uploads/`)) {
    // 프록시 터널 주소로 글자만 싹 바꿔치기 합니다!
    return url.replace(`${BACKEND_URL}/uploads/`, "/backend-uploads/");
  }

  return url;
}