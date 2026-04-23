"use client";
import { Network, MessageSquare, Sprout } from "lucide-react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import Image from "next/image"

export function HeroSection() {
  const sliderImages = [
    { id: 1, src: "/hero/hero-1.webp" },
    { id: 2, src: "/hero/hero-2.webp" },
    { id: 3, src: "/hero/hero-3.webp" },
    { id: 4, src: "/hero/hero-4.webp" },
  ]

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
  }




  return (
    <section id="home" className="py-5 py-md-5 py-lg-5 text-linq-white position-relative overflow-hidden linq_hero">
      <div id="about" style={{ position: 'absolute', top: 0 }}></div>
      {/* Background Slider - Positioned Absolutely */}
      <div className="linq-hero-slider-bg">
        <div className="linq-hero-slider-wrapper">
          <Slider {...sliderSettings}>
            {sliderImages.map((image) => (
              <div key={image.id} className="linq-hero-slide">
                <Image
                  src={image.src}
                  alt="Hero Background"
                  className="linq-hero-slide-img"
                  fill
                  priority
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>



      {/* Dark Overlay */}
      <div className="linq-hero-overlay"></div>

      {/* Content Container */}
      <div className="container linq-hero-content position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center g-4 g-lg-5 heroContant">
          <div className="col-12">
            <div className="d-flex flex-column justify-content-center space-y-4">
              <div className="mb-4">
                <span className="display-3 fw-bold mb-2 LINQ_Name">

                  LINQ CORPORATE SOLUTIONS <br />PRIVATE LIMITED.
                </span>
              </div>

              <div className="row row-cols-1 row-cols-sm-3 g-3 mt-4">
                <div className="col" data-aos="fade-right">
                  <div className="card text-center p-3 h-100 hero-linq-card">
                    <Network className="mx-auto mb-2" size={40} strokeWidth={1.25} />
                    <h3 className="h5 fw-bold">Connect</h3>
                    <p className="card-text text-linq-white-75 text-linq-white">
                      Bringing people, ideas, or industries together.
                    </p>
                  </div>
                </div>

                <div className="col" data-aos="fade-down">
                  <div className="card text-center p-3 h-100 hero-linq-card">
                    <MessageSquare className="mx-auto mb-2" size={40} strokeWidth={1.25} />
                    <h3 className="h5 fw-bold">Communicate</h3>
                    <p className="card-text text-linq-white-75 text-linq-white">
                      Emphasizes the exchange of knowledge, insights, and updates.
                    </p>
                  </div>
                </div>

                <div className="col" data-aos="fade-left">
                  <div className="card text-center p-3 h-100 hero-linq-card">
                    <Sprout className="mx-auto mb-2" size={40} strokeWidth={1.25} />
                    <h3 className="h5 fw-bold">Cultivate</h3>
                    <p className="card-text text-linq-white-75 text-linq-white">
                      Encouraging deeper understanding of trends and future directions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
