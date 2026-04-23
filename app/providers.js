"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollHandler from "../src/components/ScrollHandler";
import { GlobalDataProvider } from "../src/context/GlobalDataContext";

export default function Providers({ children, initialData }) {
  const { imageUrls } = initialData || {};

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
      easing: 'ease-in-out',
    });

    // Cache Warmer: Programmatically pre-fetch all images into browser cache
    if (imageUrls && imageUrls.length > 0) {
      if (typeof window !== 'undefined') {
        imageUrls.forEach(url => {
          const img = new Image();
          img.src = url;
        });
      }
    }
  }, [imageUrls]);

  return (
    <GlobalDataProvider initialData={initialData}>
      <ScrollHandler />
      {children}
    </GlobalDataProvider>
  );
}
