import { AboutUs } from "../../src/components/about-us";
import { fetchVision, fetchVisionImages, fetchTimeline } from "../../src/lib/api";

// -> THESE SEO TAGS ARE STRICTLY FOR THE "ABOUT US" PAGE <-
export const metadata = {
  title: "LINQ Corporate Solutions pvt ltd | HP",
  description: "Learn how LINQ operates as the dedicated internal unit of IQHUB, fueling growth through data-driven operations, creative services, and strategic market research — all from India, serving global industries. | HP",
  alternates: {
    canonical: "https://linq-corporate.vercel.app/about-us",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LINQ Corporate Solutions pvt ltd | HP",
    description: "LINQ is not a service agency — we are the internal engine of IQHUB, built to serve its operations across 12+ global industries with precision, creativity, and scale. | HP",
    url: "https://linq-corporate.vercel.app/about-us",
  },
};

export default async function Page() {
  const [vision, visionImages, timeline] = await Promise.all([
    fetchVision(),
    fetchVisionImages(),
    fetchTimeline()
  ]);

  return (
    <AboutUs 
      initialVision={vision} 
      initialVisionImages={visionImages} 
      initialTimeline={timeline}
    />
  );
}
