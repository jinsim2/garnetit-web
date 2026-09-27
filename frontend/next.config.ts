import type { NextConfig } from "next";

// 1. 서버 환경변수에 백엔드 주소가 있으면 그걸 쓰고, 없으면 로컬(localhost)을 쓴다.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**', // 💡 uploads 폴더 밑의 모든 이미지를 허락함!
      },
      // 나중에 Vercel 배포 후 실제 서버 도메인이 생기면 여기에 추가하면 됩니다.
    ],
  },

  // 2. RAM 2GB짜리 서버가 터지지 않게 막아주는, 도커 전용 초경량 압축 빌드 모드!
  output: "standalone",

  // 3. 도커 내부망 통신을 위한 프록시 터널(프론트엔드로 들어오는 특정 요청을 백엔드로 몰래 연결해 주는 터널!)
  async rewrites() {
    return [
      {
        // 이미지 터널
        source: '/backend-uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,  // 실제 백엔드 주소
      },
      {
        // API 통신 터널(이게 뚫려야 로그인, 데이터 조회 등이 가능하다.)
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,  // 실제 백엔드 주소
      }
    ];
  },

};

export default nextConfig;
