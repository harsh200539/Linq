"use client";
import React, { useEffect, useState } from 'react';
import {
  CodeXml,
  TrendingUp,
  SquarePen,
  Users,
  Pickaxe,

  Headset
} from 'lucide-react'; <SquarePen />

// Career events/notifications data
const careerEvents = [
  {
    id: 1,
    icon: CodeXml,
    title: "Web-Developer",
  },
  {
    id: 2,
    icon: TrendingUp,
    title: "Market Research Analyst",
  },
  {
    id: 3,
    icon: SquarePen,
    title: "Content Writer",

  },
  {
    id: 4,
    icon: Users,
    title: "Sales Team",

  },
  {
    id: 5,
    icon: Pickaxe,
    title: "Data Miner",

  },
  {
    id: 6,
    icon: Headset,
    title: "Calling Team",

  }
];

const CareersAnimatedList = ({ animationDelay = 600 }) => {
  const [visibleItems, setVisibleItems] = useState([]); // No cards visible initially
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger animation when component is in view and hasn't animated yet
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Animate all items in sequence starting from card 1
            careerEvents.forEach((item, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, item.id]);
              }, index * animationDelay);
            });
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the component is visible
        rootMargin: '0px'
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    // Cleanup function
    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [animationDelay, hasAnimated]);

  return (
    <div className="careers-animated-list-container" ref={containerRef}>
      <h4 className='mb-4'>Opportunity</h4>
      <div className="careers-animated-list">
        {careerEvents.map((item, index) => {
          const Icon = item.icon;
          const isVisible = visibleItems.includes(item.id);

          return (
            <div
              key={item.id}
              className={`careers-list-item ${isVisible ? 'visible' : ''}`}
            >
              <div className="careers-list-card">
                <div className="careers-card-content">
                  <div className="careers-icon-wrapper">
                    <Icon className="careers-icon" size={28} strokeWidth={2} color='#091E42' />
                  </div>
                  <div className="careers-text-content">
                    <h4 className="careers-item-title">{item.title}</h4>
                    <p className="careers-item-description">{item.description}</p>
                    {item.timestamp && (
                      <span className="careers-item-timestamp">{item.timestamp}</span>
                    )}
                  </div>
                </div>
                <div className="careers-card-glow"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareersAnimatedList;
