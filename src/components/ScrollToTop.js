"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
        AOS.refreshHard();
    }, 500); 
  }, [pathname]);

  return null;
};

export default ScrollToTop;