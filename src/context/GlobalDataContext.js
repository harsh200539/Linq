"use client";

import React, { createContext, useContext, useState } from 'react';

const GlobalDataContext = createContext(null);

export function GlobalDataProvider({ children, initialData }) {
  const [data, setData] = useState(initialData || {
    jobs: [],
    members: [],
    vision: null,
    visionImages: [],
    timeline: [],
    team: [],
    testimonials: [],
    gallery: []
  });

  return (
    <GlobalDataContext.Provider value={data}>
      {children}
    </GlobalDataContext.Provider>
  );
}

export function useGlobalData() {
  const context = useContext(GlobalDataContext);
  if (context === undefined) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  }
  return context;
}
