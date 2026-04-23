"use client";
import React from 'react';
import { Sparkles } from 'lucide-react';

export default function CareerHero() {
  return (
    <section className="career-hero py-5 mb-5 bg-linq-dark text-white text-center position-relative overflow-hidden">
      <div className="container py-lg-5 position-relative z-1">
        <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 translate-middle-y">
          <Sparkles size={16} />
          <span className="fw-bold small text-uppercase letter-spacing-1">Join the Force</span>
        </div>
        <h1 className="display-3 fw-bolder mb-3 text-white">
          Build the Future of <br />
          <span className="text-primary italic">Global Operations</span>
        </h1>
        <p className="lead mx-auto mb-0 text-white-50" style={{ maxWidth: '700px' }}>
          At LINQ, we&apos;re not just hiring employees; we&apos;re building a fast-tracked 
          operational power-house. Join a culture of ownership, growth, and excellence.
        </p>
      </div>
      
      {/* Abstract Background Orbs */}
      <div className="position-absolute top-0 start-0 translate-middle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0) 70%)', zIndex: 0 }}></div>
      <div className="position-absolute bottom-0 end-0 translate-middle-x" style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(13, 110, 253, 0.05) 0%, rgba(13, 110, 253, 0) 70%)', zIndex: 0 }}></div>

      <style jsx>{`
        .career-hero {
          background-color: #0e224e !important;
          min-height: 450px;
          display: flex;
          align-items: center;
        }
        .letter-spacing-1 {
          letter-spacing: 0.1em;
        }
      `}</style>
    </section>
  );
}
