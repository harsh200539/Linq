export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: "https://linq-corporate.vercel.app/sitemap.xml",
  };
}