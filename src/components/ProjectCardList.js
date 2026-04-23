"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "./cards.js";
import { DEFAULT_JOBS } from "../lib/default-data";

const CARDS_PER_PAGE = 3;

const ProjectCardList = ({ initialJobs = [] }) => {
  const jobs = initialJobs.length > 0 ? initialJobs : DEFAULT_JOBS;
  const [openIndex, setOpenIndex] = useState(jobs.length > 0 ? 0 : null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const useCarousel = jobs.length > CARDS_PER_PAGE;
  const totalSlides = useCarousel ? Math.ceil(jobs.length / CARDS_PER_PAGE) : 1;

  const visibleJobs = useCarousel
    ? jobs.slice(currentSlide * CARDS_PER_PAGE, currentSlide * CARDS_PER_PAGE + CARDS_PER_PAGE)
    : jobs;

  // Reset openIndex when slide changes
  useEffect(() => {
    if (useCarousel) {
      setOpenIndex(currentSlide * CARDS_PER_PAGE);
    }
  }, [currentSlide, useCarousel]);

  const toggleCard = (absoluteIndex) => {
    setOpenIndex(openIndex === absoluteIndex ? null : absoluteIndex);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  if (jobs.length === 0) {
    return (
      <div className="text-muted">No job openings are available at the moment.</div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Cards */}
      <div>
        {visibleJobs.map((job, localIdx) => {
          const absoluteIndex = currentSlide * CARDS_PER_PAGE + localIdx;
          return (
            <div key={job.id || absoluteIndex} style={{ position: "relative" }}>
              <ProjectCard
                data={job}
                isOpen={openIndex === absoluteIndex}
                onToggle={() => toggleCard(absoluteIndex)}
              />
              {/* "View Details" link — only visible when card is open */}
              {openIndex === absoluteIndex && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "-8px",
                    marginBottom: "8px",
                    paddingRight: "4px",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/careers/${job.id || absoluteIndex}`);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0e224e",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: "0",
                    }}
                  >
                    View full details →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Carousel Controls — only shown when > 3 jobs */}
      {useCarousel && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
            gap: "12px",
          }}
        >
          {/* Prev */}
          <button
            onClick={goToPrev}
            aria-label="Previous jobs"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1.5px solid #0e224e",
              background: "transparent",
              color: "#0e224e",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              flexShrink: 0,
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0e224e";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#0e224e";
            }}
          >
            &#8592;
          </button>

          {/* Dot indicators */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === currentSlide ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === currentSlide ? "#0e224e" : "#c4cad4",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.25s ease, background 0.2s",
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={goToNext}
            aria-label="Next jobs"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1.5px solid #0e224e",
              background: "transparent",
              color: "#0e224e",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              flexShrink: 0,
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0e224e";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#0e224e";
            }}
          >
            &#8594;
          </button>
        </div>
      )}

      {/* Page counter */}
      {useCarousel && (
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "8px",
          }}
        >
          {currentSlide * CARDS_PER_PAGE + 1}–
          {Math.min(currentSlide * CARDS_PER_PAGE + CARDS_PER_PAGE, jobs.length)} of{" "}
          {jobs.length} openings
        </p>
      )}
    </div>
  );
};

export default ProjectCardList;