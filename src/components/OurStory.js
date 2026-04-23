"use client";
import { useState, useRef, useEffect, useCallback } from "react";

import { DEFAULT_TIMELINE } from "../lib/default-data";

function OurStory({ initialTimeline = [] }) {
  const [timelineData, setTimelineData] = useState(initialTimeline.length > 0 ? initialTimeline : DEFAULT_TIMELINE);
  const [loading, setLoading] = useState(initialTimeline.length === 0);
  const [activeYear, setActiveYear] = useState(0);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (initialTimeline && initialTimeline.length > 0) {
      setTimelineData(initialTimeline);
      setLoading(false);
    }
  }, [initialTimeline]);

  const handleYearClick = useCallback((index) => {
    setActiveYear(index);
  }, []);

  useEffect(() => {
    if (timelineData.length === 0) return;

    const interval = setInterval(() => {
      setActiveYear((prev) => (prev + 1) % timelineData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [timelineData.length]);

  if (loading) return <div className="text-center py-5">Loading our story...</div>;
  if (timelineData.length === 0) return null;

  return (
    <div>
      <div className="App ">
        <div className="our-story-section  ">
          <div className="content-wrapper">
            <div className="left-column">
              <div className="section-label">
                <span className="label-text">OUR STORY</span>
                <div className="label-line"></div>
              </div>

              <h1 className="main-headline" data-testid="main-headline">
                {timelineData[activeYear].headline.split('<highlight>').map((part, index) => {
                  if (index === 0) return part;
                  const [highlighted, rest] = part.split('</highlight>');
                  return (
                    <span key={index}>
                      <span className="highlight">{highlighted}</span>
                      {rest}
                    </span>
                  );
                })}
              </h1>

              <p className="description" data-testid="description">
                {timelineData[activeYear].description}
              </p>
            </div>

            <div className="right-column">
              <div className="image-container">
                <img
                  src={timelineData[activeYear].thumbnail}
                  alt={timelineData[activeYear].title}
                  className="main-image"
                />
              </div>
            </div>
          </div>

          <div className="timeline-section">
            <div className="timeline-container" ref={timelineRef}>
              {timelineData.map((item, index) => (
                <div
                  key={item.id || index}
                  className={`timeline-item ${activeYear === index ? 'active' : ''}`}
                  onClick={() => handleYearClick(index)}
                  data-testid={`timeline-year-${item.year}`}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-year">{item.year}</div>
                </div>
              ))}
              <div className="timeline-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurStory;