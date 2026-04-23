import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "../src/css/consolidated.css";
import Providers from "./providers";

// -> THESE ARE GLOBAL SEO TAGS. THEY APPLY TO ALL PAGES UNLESS OVERRIDDEN <-
// (This is the root fallback for your entire website)
export const metadata = {
  metadataBase: new URL('https://linq-corporate.vercel.app'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  title: {
    template: 'LINQ Corporate Solutions pvt ltd | HP',
    default: "LINQ Corporate Solutions pvt ltd | HP",
  },
  description: "LINQ is the dedicated operational arm of IQHUB, delivering expert data mining, sales, web development, graphic design, market research, and event management across Oil & Gas, Biotech, Defence, Aviation, and more.",
  openGraph: {
    title: 'LINQ Corporate Solutions pvt ltd | HP',
    description: "LINQ is the dedicated operational arm of IQHUB, delivering expert data mining, sales, web development, graphic design, market research, and event management across Oil & Gas, Biotech, Defence, Aviation, and more.",
    url: 'https://linq-corporate.vercel.app',
    siteName: 'LINQ',
    images: [
      {
        url: 'https://linq-corporate.vercel.app/',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/lfavicon.webp',
  },
};

import { Nunito_Sans } from "next/font/google";
import { fetchAllWebsiteData } from "../src/lib/api";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
  variable: "--font-nunito-sans",
});

export default async function RootLayout({ children }) {
  // Global Data Fetcher (Master SSR/SSG fetch)
  const initialData = await fetchAllWebsiteData();

  return (
    <html lang="en" className={nunitoSans.variable}>
      <head>
        {/* Bulk Resource Preloading */}
        {initialData.imageUrls && initialData.imageUrls.map((url, idx) => (
          <link key={idx} rel="preload" as="image" href={url} />
        ))}
      </head>
      <body className="antialiased">
        <Providers initialData={initialData}>{children}</Providers>
      </body>
    </html>
  );
}
