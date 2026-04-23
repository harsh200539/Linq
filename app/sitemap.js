export const dynamic = 'force-static';

export default function sitemap() {
    return [
        {
            url: "https://linq-corporate.vercel.app",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: "https://linq-corporate.vercel.app/about-us",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://linq-corporate.vercel.app/view-our-team",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: "https://linq-corporate.vercel.app/career-growth",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];
}