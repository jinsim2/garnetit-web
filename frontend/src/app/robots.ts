import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/garnet-adm/'], // 관리자 경로는 검색엔진 크롤링 봇 접근 차단
        },
        sitemap: 'https://garnetit-web.vercel.app/sitemap.xml',
    }
}
