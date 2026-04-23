"use client";
import {
  BarChart,
  Lightbulb,
  Database,
  Code,
  TrendingUp,
  HandHeart,
} from "lucide-react";
import { useEffect } from "react";
import AOS from 'aos';


export function WhatWeDo() {
  useEffect(() => {
        AOS.init({
          // Optional: You can pass configuration options here
          duration: 1000, // Animation duration
         once: false,   // Whether animation should happen only once - default
        });
      }, []);
  return (
    <section
      id="services"
      className="py-5 py-md-5 py-lg-5 bg-linq-Grey text-linq-white"
    >
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-down">
          <h2 className="display-6 fw-bold mb-3 text-linq-dark">What We Do</h2>
          <p
            className="lead  mx-auto text-linq-dark"
            style={{ maxWidth: "900px" }}
          >
            We specialize in delivering data-driven insights, strategic
            advisory, and global research services. Our core services include:
          </p>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mb-5 " data-aos="fade-up">
          <div className="col">
            <div className="card h-100 p-4 linq-card">
              <BarChart className="text-linq-dark mb-3" size={32} strokeWidth={1.25}/>
              <h3 className="h5 fw-bold mb-2">Market Research & Analytics</h3>
              <p className="card-text text-muted">
                In-depth data analysis to provide actionable market insights.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card">
              <Lightbulb className="text-linq-dark mb-3" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold mb-2">Strategic Advisory</h3>
              <p className="card-text text-muted">
                Expert guidance for future-focused strategies and smarter
                decisions.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card">
              <Database className="text-linq-dark mb-3" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold mb-2">Data Management & Reporting</h3>
              <p className="card-text text-muted">
                Comprehensive solutions for organizing and presenting your data.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card">
              <Code className="text-linq-dark mb-3" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold mb-2">
                Web Development & SEO Services
              </h3>
              <p className="card-text text-muted">
                Full-stack digital support to enhance your online presence.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card">
              <TrendingUp className="text-linq-dark mb-3" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold mb-2">
                Industry Reporting & Intelligence
              </h3>
              <p className="card-text text-muted">
                Tailored reports and intelligence for various sectors.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card">
              <HandHeart className="text-linq-dark mb-3" size={32} strokeWidth={1.25} />
             
              <h3 className="h5 fw-bold mb-2">
                Marketing & Operational Support
              </h3>
              <p className="card-text text-muted">
                Enhancing brand visibility while streamlining processes for
                efficient business operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
