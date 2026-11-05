import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/garnet-adm/'], // 관리자 경로는 검색엔진 크롤링 봇 접근 차단
        },
        sitemap: 'https://garnet2014.cafe24.com/sitemap.xml', // 실서버 도메인으로 통일
    }
}
