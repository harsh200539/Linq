"use client";
import { FlaskConical, Leaf, Car, Ship, Heart, Plane, Droplet , Tractor, Shield, Bubbles, ShieldCheck } from "lucide-react"
// Removed unused icons
import React, { useEffect } from 'react';
import AOS from 'aos';
export function IndustriesWeServe() {

 useEffect(() => {
        AOS.init({
          // Optional: You can pass configuration options here
          duration: 1000, // Animation duration
          once: false,    // Whether animation should happen only once - default
        });
      }, []);


  return (
    <section id="industries" className="py-5 py-md-5 py-lg-5 bg-linq-white text-linq-black">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold mb-3 text-linq-dark">Industries We Serve</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "900px" }}>
            From energy to life sciences, our cross-functional teams bring clarity and expertise to a variety of
            sectors.
          </p>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5" data-aos="zoom-in">
          <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <Droplet className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold">Oil & Gas</h3>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <FlaskConical className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold">Biotechnology</h3>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <Leaf className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold">Sustainability</h3>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <Tractor className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold">Agriculture</h3>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <FlaskConical className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold">Pharmaceuticals</h3>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <Car className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold">Automotive</h3>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <Ship className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold">Deep Sea Mining</h3>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <Heart className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold">Healthcare</h3>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <Plane className="text-linq-dark mb-3 mx-auto" size={32}  strokeWidth={1.25}/>
              <h3 className="h5 fw-bold">Aviation</h3>
            </div>
          </div>
           <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <Shield className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25} />
              <h3 className="h5 fw-bold">Defence</h3>
            </div>
          </div>
           <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <Bubbles className="text-linq-dark mb-3 mx-auto" size={32} strokeWidth={1.25}/>
              <h3 className="h5 fw-bold">Water Management</h3>
            </div>
          </div>
           <div className="col">
            <div className="card h-100 p-4 linq-card text-center">
              <ShieldCheck className="text-linq-dark mb-3 mx-auto" size={36}  strokeWidth={1.25} />
             
              <h3 className="h5 fw-bold">Cybersecurity</h3>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}



