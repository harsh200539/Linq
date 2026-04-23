"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import AOS from "aos";

export default function ScrollHandler() {
  const pathname = usePathname();

  // Stable mapping of paths to section IDs
  const pathMap = {
    "/": "home",
    "/home": "home",
    "/about-us": "about",
    "/services": "services",
    "/careers": "careers",
    "/contact": "contact",
    "/career-growth": "career-growth",
    "/life-at-linq": "life-at-linq",
  };

  const performScroll = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 90; // Approximate height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Refresh AOS after scroll to ensure elements are triggered
      setTimeout(() => {
        AOS.refresh();
      }, 600);
    }
  };

  // 1. Initial/Route-Change Scroll
  useEffect(() => {
    // Normalize pathname (remove trailing slash)
    const normalizedPath = pathname.endsWith("/") && pathname !== "/" 
      ? pathname.slice(0, -1) 
      : pathname;

    const targetId = pathMap[normalizedPath];
    if (targetId) {
      const timer = setTimeout(() => performScroll(targetId), 200);
      return () => clearTimeout(timer);
    } else {
      AOS.refresh();
    }
  }, [pathname]);

  // 2. Permanent Listener for Manual Clicks (Fix for repeat clicks on same route)
  useEffect(() => {
    const handleManualEvent = (e) => {
      const manualId = pathMap[e.detail] || e.detail;
      if (manualId) performScroll(manualId);
    };

    window.addEventListener('linq-manual-scroll', handleManualEvent);
    return () => window.removeEventListener('linq-manual-scroll', handleManualEvent);
  }, []); // Run only once on mount

  return null;
}
