"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { MapPin, Clock4, ExternalLink, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import CareersAnimatedList from "./CareersAnimatedList.js";

const CAREERS_IMAGE = "/about/careers.webp";

// ── LOCAL JOB CARD COMPONENT ──
const JobCard = ({ job, index }) => {
  const router = useRouter();

  return (
    <div className="job-card">
      <div className="card-header-linq">
        <div className="title-pill-linq">
          <span>{job.title}</span>
        </div>
        {job.status && (
          <span className="status-badge" style={{ color: job.status_color || job.statusColor || '#0e224e' }}>
            {job.status}
          </span>
        )}
      </div>

      <div className="card-content-linq">
        {job.context && (
          <div className="mb-3">
            <p className="detail-label-linq">Context</p>
            <p className="detail-text-linq smaller">{job.context}</p>
          </div>
        )}

        <p className="detail-label-linq">Job Description</p>
        <p className="detail-text-linq">
          {job.short_description || job.description || "No description provided."}
        </p>

        {job.qualification && (
          <div className="mb-3">
            <p className="detail-label-linq">Qualification</p>
            <p className="detail-text-linq smaller">{job.qualification}</p>
          </div>
        )}

        <div className="job-meta-linq">
          {job.location && (
            <div className="meta-item-linq">
              <MapPin size={16} className="meta-icon-linq" />
              <span>{job.location}</span>
            </div>
          )}
          {(job.employment_type || job.jobType || job.job_type) && (
            <div className="meta-item-linq">
              <Clock4 size={16} className="meta-icon-linq" />
              <span>{job.employment_type || job.jobType || job.job_type}</span>
            </div>
          )}
        </div>

        {(job.application_email || (job.emails && job.emails.length > 0)) && (
          <div className="contact-section-linq mt-3">
            <p className="detail-label-linq">Contact</p>
            {job.application_email ? (
              <div className="meta-item-linq mb-1">
                <Mail size={14} className="meta-icon-linq" />
                <span className="smaller">
                  <a href={`mailto:${job.application_email}`} className="email-link">{job.application_email}</a>
                </span>
              </div>
            ) : (
              job.emails.map((emailStr, idx) => {
                const parts = emailStr.split(':');
                const label = parts.length > 1 ? parts[0].trim() : '';
                const email = parts.length > 1 ? parts[1].trim() : emailStr.trim();
                return (
                  <div key={idx} className="meta-item-linq mb-1">
                    <Mail size={14} className="meta-icon-linq" />
                    <span className="smaller">
                      {label && <span className="fw-bold">{label}: </span>}
                      <a href={`mailto:${email}`} className="email-link">{email}</a>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="card-footer-linq mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
        <div className="avatar-group-linq d-flex align-items-center">
          {(job.avatars || []).slice(0, 3).map((avatar, idx) => (
            <img
              key={idx}
              className="avatar-small shadow-sm"
              src={avatar}
              alt="User"
              style={{ marginLeft: idx === 0 ? '0' : '-8px' }}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (job.slug) {
              router.push(`/careers/${job.slug}`);
            } else if (job.id) {
              router.push(`/careers/${job.id}`);
            }
          }}
          className="job-btn-sm"
          disabled={!(job.slug || job.id)}
          style={{ opacity: !(job.slug || job.id) ? 0.5 : 1, cursor: !(job.slug || job.id) ? 'not-allowed' : 'pointer' }}
        >
          View Full Details <ExternalLink size={14} />
        </button>
      </div>

      <style jsx>{`
        .job-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          height: 100%;
          min-height: 520px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(14, 34, 78, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(14, 34, 78, 0.08);
        }
        .card-header-linq {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .title-pill-linq {
          background: rgba(14, 34, 78, 0.05);
          color: #0e224e;
          padding: 6px 16px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .detail-label-linq {
          color: #9ca3af;
          text-transform: uppercase;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .detail-text-linq {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #4b5563;
          margin-bottom: 16px;
        }
        .detail-text-linq.smaller {
          font-size: 0.85rem;
          color: #6b7280;
        }
        .job-meta-linq {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .meta-item-linq {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 0.85rem;
        }
        .meta-icon-linq {
          color: #0e224e;
          opacity: 0.6;
        }
        .email-link {
          color: #0e224e;
          text-decoration: none;
          font-weight: 500;
        }
        .email-link:hover {
          text-decoration: underline;
        }
        .smaller {
          font-size: 0.8rem;
        }
        .avatar-small {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #fff;
          object-fit: cover;
        }
        .job-btn-sm {
          background: #0e224e;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .job-btn-sm:hover {
          background: #1a3a7a;
          transform: translateX(3px);
        }
      `}</style>
    </div>
  );
};

export function CareersSection({ jobs = [] }) {
  const router = useRouter();
  
  // ── EMBLA CAROUSEAL SETUP WITH AUTOPLAY ──
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const isWideLayout = jobs.length > 2;

  return (
    <section id="careers" className="jobs-section">
      <style jsx>{`
        .jobs-section {
          padding: 80px 0;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          color: #0e224e;
        }
        .background-illustration-abs {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 40%;
          height: 70%;
          opacity: 0.06;
          z-index: -1;
          pointer-events: none;
          filter: blur(2px);
        }
        .container-linq {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }
        .jobs-header-linq {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 60px;
        }
        .header-text-linq h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 15px;
          color: #0e224e;
        }
        .header-text-linq p {
          max-width: 600px;
          color: #6b7280;
          line-height: 1.6;
          font-size: 1.1rem;
          margin: 0;
        }
        .carousel-controls-linq {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
        }
        .control-btn-linq {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid rgba(14, 34, 78, 0.1);
          background: #fff;
          color: #0e224e;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .control-btn-linq:hover:not(:disabled) {
          border-color: #0e224e;
          background: #0e224e;
          color: #fff;
        }
        .control-btn-linq:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .jobs-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .jobs-wrapper {
            grid-template-columns: 2fr 1fr;
          }
        }
        .jobs-left {
          overflow: hidden;
          width: 100%;
        }
        .jobs-right {
          position: relative;
          width: 100%;
        }
        .embla-linq {
          overflow: hidden;
          padding: 10px 0;
        }
        .embla__container-linq {
          display: flex;
          gap: 24px;
        }
        .embla__slide-linq {
          flex: 0 0 100%;
          min-width: 0;
        }
        @media (min-width: 768px) {
          .embla__slide-linq {
            flex: 0 0 calc(48% - 12px); /* Adjusted width as requested (48%) */
          }
        }
        .simple-grid-linq {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .simple-grid-linq {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }
        }
        .cta-container-linq {
          text-align: center;
          margin-top: 60px;
        }
        .btn-linq-alt {
          padding: 14px 40px;
          border: 2px solid #0e224e;
          color: #0e224e;
          background: transparent;
          border-radius: 50px;
          font-weight: 700;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        .btn-linq-alt:hover {
          background: #0e224e;
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(14, 34, 78, 0.1);
        }
      `}</style>

      {isWideLayout && (
        <div className="background-illustration-abs">
          <Image
            src={CAREERS_IMAGE}
            alt="Decoration"
            fill
            style={{ objectFit: "contain", objectPosition: "right center" }}
          />
        </div>
      )}

      <div className="container-linq">
        <div className="jobs-header-linq" data-aos="fade-up">
          <div className="header-text-linq">
            <h2>Careers</h2>
            <p>
              Join a culture of growth, ownership, and world-class operations.
            </p>
          </div>
          
          {isWideLayout && (
            <div className="carousel-controls-linq">
              <button 
                className="control-btn-linq" 
                onClick={scrollPrev}
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className="control-btn-linq" 
                onClick={scrollNext}
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="jobs-wrapper">
          <div className="jobs-left" data-aos="fade-right">
            {isWideLayout ? (
              <div className="embla-linq" ref={emblaRef}>
                <div className="embla__container-linq">
                  {jobs.map((job, idx) => (
                    <div className="embla__slide-linq" key={job.id || idx}>
                      <JobCard job={job} index={idx} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="simple-grid-linq">
                {jobs.map((job, idx) => (
                  <JobCard key={job.id || idx} job={job} index={idx} />
                ))}
              </div>
            )}
          </div>

          <div className="jobs-right" data-aos="fade-left">
            <CareersAnimatedList />
          </div>
        </div>

        <div className="cta-container-linq" data-aos="fade-up">
          <button
            className="btn-linq-alt"
            onClick={() => router.push("/view-our-team")}
          >
            Explore Life at LINQ
          </button>
        </div>
      </div>
    </section>
  );
}
