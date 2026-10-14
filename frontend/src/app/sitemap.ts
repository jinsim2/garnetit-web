// frontend/src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    // 💡 실서버 도메인 (추후 정식 도메인 구입 시 변경)
    const baseUrl = 'https://garnet2014.cafe24.com'

    return [
        // 메인
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },

        // 회사소개
        { url: `${baseUrl}/company/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/company/history`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/company/cert`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/company/location`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

        // 사업영역
        { url: `${baseUrl}/business/cctv`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/business/network`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/business/broadcast`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/business/maintenance`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

        // 제품소개
        { url: `${baseUrl}/product`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/product/cctv`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/product/network`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/product/audio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

        // 고객지원
        { url: `${baseUrl}/support/notice`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${baseUrl}/support/download`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/support/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/support/inquiry`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 }
    ]
}
