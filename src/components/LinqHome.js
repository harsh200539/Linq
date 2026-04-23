import { CareersSection } from "./CareersSection";
import { ContactUs } from "./contact-us";
import Footer from "./footer";
import { HeroSection } from "./hero-section";
import { IndustriesWeServe } from "./IndustriesWeServe";
import { LifeAtLinq } from "./life-at-linq";
import { Navbar } from "./navbar";
import { WhatWeDo } from "./what-we-do";
import Testimonials from "./testimonials";
import CareerGrowth from "./career-growth";
export default function LinqHome() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-linq-white text-linq-black">
      <Navbar />
      <main className="flex-grow-1">
        <div id="home">
          <HeroSection />
        </div>
        <div id="services">
          <WhatWeDo />
        </div>
        <div id="careers">
          <CareersSection />
        </div>
        <div id="career-growth">
          <CareerGrowth />
        </div>
        <div id="industries">
          <IndustriesWeServe />
        </div>
        <div id="">
          <LifeAtLinq />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <div id="contact">
          <ContactUs />
        </div>
      </main>
      <Footer />
    </div>
  );
}
