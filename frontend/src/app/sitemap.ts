import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://garnetit-web.vercel.app'   // 추후 회사 실제 도메인으로 변경! 'https://garnetit.co.kr'

    return [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
        { url: `${baseUrl}/company/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/business/cctv`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/product/cctv`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/support/notice`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ]
}
