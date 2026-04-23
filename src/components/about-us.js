"use client";

import { Navbar } from "./navbar";
import OurStory from "./OurStory";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import Image from "next/image";
import Footer from "./footer";
import CountUpAnimation from "./CountUpAnimation";

import { DEFAULT_VISION, DEFAULT_VISION_IMAGES } from "../lib/default-data";
import { fetchVision, fetchVisionImages, fetchTimeline } from "../lib/api";

const ABOUT_IMAGES = {
  about: "/about/about-1.webp",
  img2: "/about/about-2.webp",
  img3: "/about/about-3.webp",
  Visionimg: "/about/vision.webp",
};

const StatsContent = () => (
  <div className="row stats mb-3 p-1 gx-1 justify-content-center">
    <div className="col-3 col-md-3">
      <div className="stat-value">
        <CountUpAnimation end={500} suffix="+" />
      </div>
      <div className="text-center stat-value_text">Completed Projects</div>
    </div>
    <div className="col-3 col-md-3">
      <div className="stat-value">
        <CountUpAnimation end={15} suffix="k+" />
      </div>
      <div className="text-center stat-value_text">Satisfied Customers</div>
    </div>
    <div className="col-3 col-md-3">
      <div className="stat-value">
        <CountUpAnimation end={45} suffix="+" />
      </div>
      <div className="text-center stat-value_text">Worldwide Honors</div>
    </div>
  </div>
);

export function AboutUs({ initialVision = null, initialVisionImages = [], initialTimeline = [] }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [vision, setVision] = useState(initialVision || DEFAULT_VISION);
  const [visionImages, setVisionImages] = useState(initialVisionImages.length > 0 ? initialVisionImages : DEFAULT_VISION_IMAGES);
  const [timelineData, setTimelineData] = useState(initialTimeline.length > 0 ? initialTimeline : []);
  const [mainImageIndex, setMainImageIndex] = useState(0); // For top card
  const [bottomImageIndex, setBottomImageIndex] = useState(0); // For bottom slider

  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
    AOS.init({ duration: 1000, once: false });
    // trust initialVision and initialVisionImages from SSR
    // refreshes AOS if data was already present
    if (vision || visionImages.length > 0) {
      setTimeout(() => AOS.refresh(), 500);
    }
  }, [initialVision, initialVisionImages]);

  const mainSlider = visionImages.filter(img => img.category === 'MAIN');
  const bottomSlider = visionImages.filter(img => img.category === 'BOTTOM');

  // Multi-slider auto-play logic
  useEffect(() => {
    if (mainSlider.length <= 1) return;
    const interval = setInterval(() => {
      setMainImageIndex((prev) => (prev + 1) % mainSlider.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [mainSlider.length]);

  useEffect(() => {
    // If we have dynamic images, use their count, otherwise use fallback count (2)
    const count = bottomSlider.length > 0 ? bottomSlider.length : 2;
    if (count <= 1) return;
    const interval = setInterval(() => {
      setBottomImageIndex((prev) => (prev + 1) % count);
    }, 10000);
    return () => clearInterval(interval);
  }, [bottomSlider.length]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    
    // Client-side fetch to ensure data freshness in static export
    const loadVisionData = async () => {
      try {
        const [freshVision, freshImages, freshTimeline] = await Promise.all([
          fetchVision(),
          fetchVisionImages(),
          fetchTimeline()
        ]);
        if (freshVision) setVision(freshVision);
        if (freshImages && freshImages.length > 0) setVisionImages(freshImages);
        if (freshTimeline && freshTimeline.length > 0) setTimelineData(freshTimeline);
      } catch (err) {
        console.error("Failed to fetch fresh vision/timeline data:", err);
      }
    };
    
    loadVisionData();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <div>
        <Navbar />
        <section className="about-us py-5 mt-5">
          <div className="container">
            <div className="text-center mb-5">
              <h1 className="display-6 fw-bold mb-3 text-linq-dark">About Us</h1>
            </div>

            <div className="row align-items-center ">
              <div className="col-lg-3" data-aos="fade-up-left">
                <div className="info-block mb-5">
                  <h2 className="fw-bold mb-3">Who We Are</h2>
                  <p className="text-muted small">
                    Connecting industries, ideas, and opportunities worldwide
                  </p>
                </div>
                <div className="info-block">
                  <h2 className=" fw-bold mb-3">What We Stand For</h2>
                  <p className="text-muted small">
                    We invest in your development with continuous learning
                    opportunities and career advancement paths.
                  </p>
                </div>
              </div>

              <div className="col-lg-6 text-center">
                <Image
                  src={ABOUT_IMAGES.about}
                  alt="Business Meeting Illustration"
                  className="img-fluid"
                  width={600}
                  height={400}
                  style={{ height: 'auto', width: '100%' }}
                />
              </div>

              <div className="col-lg-3" data-aos="fade-up-right">
                <div className="info-block mb-5">
                  <h2 className=" fw-bold mb-3">Our Vision for the Future</h2>
                  <p className="text-muted small">
                    Shaping the industries of tomorrow through innovation
                  </p>
                </div>
                <div className="info-block">
                  <h2 className=" fw-bold mb-3">Collaborative Culture</h2>
                  <p className="text-muted small">
                    Thrive in a supportive team where your ideas are valued and
                    your contributions make a real difference.
                  </p>
                </div>
              </div>
            </div>
            <hr />
          </div>
        </section>
        <OurStory initialTimeline={timelineData} />
        <div className="container py-5">
          <div className="row align-items-center mb-4">
            <div className="col-md-7">
              <div className="d-flex align-items-center mb-2" data-aos="flip-left">
                <span className="divider"></span>
                <span className="text-uppercase" data-aos="flip-left">
                  {vision ? vision.title : 'Our Vision'}
                </span>
              </div>
              <div className="headline mb-2" data-aos="fade-right">
                {vision ? vision.subtitle : 'Connecting global industries through ideas that drive opportunity'}
                <span className="subheadline d-block">Leads Dominate.</span>
              </div>
            </div>
            <div className="col-md-5" data-aos="fade-down">
              <div className="card card-custom" style={{ overflow: 'hidden', height: '300px', position: 'relative' }}>
                {mainSlider.length > 0 ? (
                  mainSlider.map((img, idx) => (
                    <Image
                      key={img.id}
                      src={img.image}
                      alt="Vision"
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{
                        objectFit: 'cover',
                        opacity: idx === mainImageIndex ? 1 : 0,
                        transition: 'opacity 1s ease-in-out'
                      }}
                    />
                  ))
                ) : (
                  <Image 
                    src={vision && vision.image ? vision.image : ABOUT_IMAGES.Visionimg} 
                    alt="Vision"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-fit-cover"
                  />
                )
                }
              </div>
            </div>
          </div>
          <div className="row ">
            <div className="col-12 col-xl-7 img-slider order-2 order-md-1">
              {bottomSlider.length > 0 ? (
                bottomSlider.map((image, index) => (
                  <Image
                    key={image.id}
                    src={image.image}
                    alt={`Slide ${index + 1}`}
                    fill
                    sizes="(max-width: 1200px) 100vw, 60vw"
                    className={`rounded shadow slider-image ${index === bottomImageIndex ? "active" : ""}`}
                    style={{ objectFit: 'cover' }}
                  />
                ))
              ) : (
                // Fallback hardcoded if no dynamic images exist yet
                [ABOUT_IMAGES.img2, ABOUT_IMAGES.img3].map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Slide ${index + 1}`}
                    fill
                    sizes="(max-width: 1200px) 100vw, 60vw"
                    className={`rounded shadow slider-image ${index === bottomImageIndex % 2 ? "active" : ""}`}
                    style={{ objectFit: 'cover' }}
                  />
                ))
              )}
            </div>
            <div className="col-12 col-xl-5 mt-3 order-1 order-md-2">
              <p className="description2">
                {vision ? vision.description : 'Our vision is to connect global industries through ideas that drive opportunity and deliver measurable business value. We are committed to empowering organizations with accurate, timely, and actionable insights that support confident and informed decision-making.'}
                <br /><br />
                <span className="tablet-hidden">
                  {vision ? vision.description_extended : 'Through strong partnerships and a truly global perspective, we work closely with clients to understand their unique challenges and objectives. Our approach is centered on collaboration, innovation, and long-term value creation, enabling organizations to achieve sustainable growth.'}
                </span>
              </p>
              <div className="d-none d-xl-block">
                <StatsContent />
              </div>
            </div>
            <div className="col-12 order-3 d-xl-none">
              <StatsContent />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}