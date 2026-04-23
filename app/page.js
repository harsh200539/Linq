import { CareersSection } from "../src/components/CareersSection";
import { ContactUs } from "../src/components/contact-us";
import Footer from "../src/components/footer";
import { HeroSection } from "../src/components/hero-section";
import { IndustriesWeServe } from "../src/components/IndustriesWeServe";
import { LifeAtLinq } from "../src/components/life-at-linq";
import { Navbar } from "../src/components/navbar";
import { WhatWeDo } from "../src/components/what-we-do";
import Testimonials from "../src/components/testimonials";
import CareerGrowth from "../src/components/career-growth";

// -> THESE SEO TAGS ARE FOR THE MAIN HOMEPAGE (LINQHOME) <-
// (They cover the Hero Section, Services, Testimonials, etc., shown on the root URL)
export const metadata = {
  title: "LINQ Corporate Solutions pvt ltd | HP",
  description: "LINQ drives IQHUB's global operations from India — specializing in data mining, sales telecalling, web development, graphic design, market research, and large-scale event handling across 12+ industries including Healthcare, Defence, and Aviation. | HP",
  alternates: {
    canonical: "https://linq-corporate.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LINQ Corporate Solutions pvt ltd | HP",
    description: "From data mining to event management, LINQ is the internal force behind IQHUB's success across Oil & Gas, Pharma, Biotech, Automotive, and more. | HP",
  },
  twitter: {
    card: "summary_large_image",
    title: "LINQ Corporate Solutions pvt ltd | HP",
    description:
      "From data mining to event management, LINQ is the internal force behind IQHUB's success across Oil & Gas, Pharma, Biotech, Automotive, and more. | HP",
  },
};

import { fetchJobs, fetchMembers, fetchTestimonials } from "../src/lib/api";

export default async function Home() {
  // Server-side fetching
  const [jobs, members, testimonials] = await Promise.all([
    fetchJobs(),
    fetchMembers(),
    fetchTestimonials()
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LINQ Corporate Solutions",
    "alternateName": "LINQ",
    "url": "https://linq-corporate.vercel.app",
    "logo": "https://linq-corporate.vercel.app/logo.png",
    "parentOrganization": {
      "@type": "Organization",
      "name": "IQHUB",
      "url": "https://iqhub.com"
    },
    "description": "The dedicated operational arm of IQHUB specializing in data-driven business solutions."
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-linq-white text-linq-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-grow-1">
        <HeroSection />
        <WhatWeDo />
        <CareersSection jobs={jobs} />
        <div id="career-growth">
          <CareerGrowth members={members} />
        </div>
        <div id="industries">
          <IndustriesWeServe />
        </div>
        <div id="life-at-linq">
          <LifeAtLinq />
        </div>
        <div id="testimonials">
          <Testimonials initialTestimonials={testimonials} />
        </div>
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}
