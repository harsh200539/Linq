import ViewOurTeam from "../../src/components/viewourteam";

// -> THESE SEO TAGS ARE STRICTLY FOR THE "VIEW OUR TEAM" PAGE <-
// (Powered by frontend component: src/components/viewourteam.js)
export const metadata = {
  title: "LINQ Corporate Solutions pvt ltd | HP",
  description: "Meet the talented professionals at LINQ who drive IQHUB's internal operations — from data analysts and web developers to sales specialists, designers, and market researchers based in India. | HP",
  alternates: {
    canonical: "https://linq-corporate.vercel.app/view-our-team",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LINQ Corporate Solutions pvt ltd | HP",
    description: "Discover the driven individuals at LINQ who bring IQHUB's vision to life every day across industries like Cybersecurity, Sustainability, Biotechnology, and Deep Sea Mining. | HP",
    url: "https://linq-corporate.vercel.app/view-our-team",
  },
  twitter: {
    card: "summary_large_image",
    title: "LINQ Corporate Solutions pvt ltd | HP",
    description:
      "Discover the driven individuals at LINQ who bring IQHUB's vision to life every day across industries like Cybersecurity, Sustainability, Biotechnology, and Deep Sea Mining. | HP",
    images: ["/og-team.jpg"],
  },
};

export default function Page() {
  return <ViewOurTeam />;
}
