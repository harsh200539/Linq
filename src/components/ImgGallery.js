"use client";

import { Navbar } from "./navbar"
import Footer from "./footer";
import React, { useEffect, useState } from "react";
import { fetchGallery } from "../lib/api";
import { DEFAULT_GALLERY } from "../lib/default-data";

export default function ImgGallery() {
  const [galleryImages, setGalleryImages] = useState(DEFAULT_GALLERY);

  useEffect(() => {
    fetchGallery().then(data => {
      if (data && data.length > 0) {
        setGalleryImages(data);
      }
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="imgcontainer">
        {galleryImages.map((image, index) => (
          <div key={image.id || index} className={`box ${image.image_type || 'c'}`}>
            <img src={image.image} alt={image.alt_text || `Gallery image ${index}`} loading="lazy" />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}