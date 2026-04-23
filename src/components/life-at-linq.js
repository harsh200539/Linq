"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Static card images served from public folder (no bundle cost)
const LIFE_IMAGES = {
  Team_driven: "/life/team-driven.webp",
  cricket1: "/life/cricket.webp",
  office_infra: "/life/office-infra.webp",
  Learning_and_growth: "/life/learning-growth.webp",
};

export function LifeAtLinq() {
  const router = useRouter()
  return (
    
    <section id="life-at-linq" className="container py-5 py-md-5 py-lg-5" >
   
      <div className="event-card-wrapper row mx-auto my-5 g-4">
        <div className="col-12 text-center">
            <h2 className="display-6 fw-bold mb-3 text-linq-dark " >Life at LINQ</h2>
                <p className="lead text-linq-white-50 mb-4 text-linq-dark">
                  We combine professionalism with fun. Our culture is
                  collaborative, inclusive, and energetic. At LINQ, you’ll find:
                </p>
        </div>
                
        <div className="col-sm-12 col-md-6 col-lg-3" data-aos="zoom-out-up">
          <div className="event-card w-100">
            <div className="card-bg position-relative">
                <Image
                  src={LIFE_IMAGES.Team_driven}
                  alt="Team driven work"
                  fill
                  className="event-image object-fit-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="card-overlay2"></div>
                <div className="top-ui d-flex justify-content-start p-3">
                    <div className="yes-button"></div>
                </div>
                <div className="bottom-content p-4">
                    <h4 className="card-title text-white mb-0">Team-driven work environment</h4>
                </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-6 col-lg-3" data-aos="zoom-out-right">
          <div className="event-card w-100">
            <div className="card-bg position-relative">
                <Image
                  src={LIFE_IMAGES.cricket1}
                  alt="Team building events"
                  fill
                  className="event-image object-fit-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="card-overlay2"></div>
                <div className="top-ui d-flex justify-content-start p-3">
                    <div className="yes-button"></div>
                </div>
                <div className="bottom-content p-4">
                    <h1 className="card-title text-white mb-0">Team-building events</h1>
                </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-6 col-lg-3" data-aos="zoom-out-left">
          <div className="event-card w-100">
            <div className="card-bg position-relative">
                <Image
                  src={LIFE_IMAGES.office_infra}
                  alt="Office infrastructure"
                  fill
                  className="event-image object-fit-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="card-overlay3"></div>
                <div className="top-ui d-flex justify-content-start p-3">
                    <div className="yes-button"></div>
                </div>
                <div className="bottom-content p-4">
                    <h1 className="card-title text-white mb-0">Modern office infrastructure</h1>
                </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-6 col-lg-3" data-aos="zoom-out-down">
          <div className="event-card w-100">
            <div className="card-bg position-relative">
                <Image
                  src={LIFE_IMAGES.Learning_and_growth}
                  alt="Learning and growth"
                  fill
                  className="event-image object-fit-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="card-overlay4"></div>
                <div className="top-ui d-flex justify-content-start p-3">
                    <div className="yes-button"></div>
                </div>
                <div className="bottom-content p-4">
                    <h1 className="card-title text-white mb-0">Learning and growth</h1>
                </div>
            </div>
          </div>
        </div>
            <div className="d-flex flex-column flex-sm-row gap-2 mt-4 text-center justify-content-center align-items-center">
                <button
                  href="#life-at-linq"
                  className="Discover_Life_at_Linq"  onClick={() => router.push("/img-gallery")}
               >
                 Discover Life at LINQ  
               </button>
             </div>
        
    </div>
    
    </section>
  );
}