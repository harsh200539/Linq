import React, { useState, useEffect, useRef } from 'react';

const CountUpAnimation = ({ end, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const element = countRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasPlayed) {
          setHasPlayed(true);
        }
      },
      { threshold: 0.5 } // Trigger when 50% visible // threshold 0.1 might be better for mobile
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasPlayed]);

  useEffect(() => {
    if (!hasPlayed) return;

    const endValue = parseInt(end, 10);
    let startTimestamp = null;
    const stepTime = Math.abs(Math.floor(duration / endValue));

    let timer = setInterval(() => {
      setCount((prevCount) => {
        const nextCount = prevCount + 1;
        if (nextCount >= endValue) {
          clearInterval(timer);
          return endValue;
        }
        return nextCount;
      });
    }, stepTime);    
    return () => clearInterval(timer);
  }, [hasPlayed, end, duration]);

  return (
    <span ref={countRef}>
      {count}{suffix}
    </span>
  );
};

export default CountUpAnimation;
