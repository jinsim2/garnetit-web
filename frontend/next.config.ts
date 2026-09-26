import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 기존 images 설정은 그대로 둔다.
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

  // [추가됨] 프론트엔드로 들어오는 특정 요청을 백엔드로 몰래 연결해 주는 터널!
  async rewrites() {
    return [
      {
        source: '/backend-uploads/:path*',
        destination: 'http://localhost:8000/uploads/:path*',  // 실제 백엔드 주소
      }
    ];
  },

};

export default nextConfig;
