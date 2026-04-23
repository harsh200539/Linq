"use client";

import Link from "next/link";
import { Navbar } from "../../src/components/navbar";
import Footer from "../../src/components/footer";
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ backgroundColor: "#05243c", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <main className="error-main flex-grow-1 d-flex flex-column align-items-center p-3 text-center">
        {/* Responsive Back Button Container */}
        <div className="w-100 d-flex justify-content-start px-2 px-md-5 mb-4 mb-md-5 mt-md-0 mt-5" style={{ 
          maxWidth: '1200px',
          position: 'relative',
          zIndex: 100
        }}>
          <Link 
            href="/" 
            className="btn btn-lg return-btn d-flex align-items-center gap-2"
            style={{ color: '#ffffff' }}
          >
            <ChevronLeft size={20} />
            <span style={{ fontWeight: 600 }}>Return to Homepage</span>
          </Link>
        </div>

        <div className="container py-4 my-auto">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <h1 
                className="error-code fw-bold mb-3" 
                style={{ 
                  color: "#ffffff", 
                  fontSize: "clamp(5rem, 25vw, 12rem)",
                  textShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  letterSpacing: "-5px",
                  lineHeight: 1
                }}
              >
                404
              </h1>
              <h2 
                className="subtitle fw-bold mb-4" 
                style={{ 
                   color: "#2ea1ff",
                   fontSize: "clamp(1.5rem, 5vw, 2.5rem)"
                }}
              >
                Page Not Found
              </h2>
              <p 
                className="description mb-5 mx-auto" 
                style={{ 
                  color: "rgba(255, 255, 255, 0.7)", 
                  fontSize: "clamp(1rem, 3vw, 1.25rem)",
                  maxWidth: "500px"
                }}
              >
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
              {/* Main CTA button removed from center as per user request to move it to top-left */}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .error-main {
          background: radial-gradient(circle at center, #0a3356 0%, #05243c 100%);
          min-height: calc(100vh - 200px);
          padding-top: 150px;
        }
        @media (max-width: 768px) {
          .error-main {
            padding-top: 100px;
          }
        }
        .back-btn {
          color: #ffffff !important; 
          background-color: rgba(255, 255, 255, 0.1) !important; 
          padding: 10px 25px; 
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
        }
        .back-btn:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
          transform: translateX(-5px);
          color: #ffffff !important;
        }
        .return-btn {
          background-color: #2ea1ff !important; 
          color: #ffffff !important; 
          border-radius: 12px !important; 
          font-weight: 700 !important;
          padding: 15px 40px !important;
          box-shadow: 0 10px 20px rgba(46, 161, 255, 0.4) !important;
          transition: all 0.3s ease !important;
          text-decoration: none !important;
          display: inline-block;
        }
        .return-btn:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 15px 30px rgba(46, 161, 255, 0.6) !important;
          background-color: #55b7ff !important;
          color: #ffffff !important;
        }
        @media (max-width: 768px) {
          .d-flex.justify-content-start {
             justify-content: center !important;
             padding: 0 !important;
             margin-top: 20px !important;
          }
          .error-code {
             margin-top: 10px !important;
          }
          .description {
             padding: 0 15px;
          }
        }
      `}</style>
    </div>
  );
}
