"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from './navbar';
import Footer from './footer.js';
import { fetchTeamMembers } from '../lib/api';

const ViewOurTeam = () => {
    const [teamData, setTeamData] = useState([]);
    const [opacity, setOpacity] = useState(1);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);

    useEffect(() => {
        fetchTeamMembers()
            .then(data => {
                setTeamData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching team members:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const offsetTop = sectionRef.current.offsetTop;
                const scrollY = window.scrollY;
                const distance = scrollY - offsetTop + 100;

                if (distance > 0) {
                    const newOpacity = 1 - (distance / 500);
                    setOpacity(Math.max(0, newOpacity));
                } else {
                    setOpacity(1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Navbar />
            <section className="services-section container" ref={sectionRef} style={{ position: 'relative' }}>
                <div
                    className="services-header"
                    style={{
                        position: 'sticky',
                        top: '100px',
                        zIndex: 0,
                        opacity: opacity,
                        transition: 'opacity 0.1s ease-out'
                    }}
                >
                    <div className="text-center mb-5">
                        <h2 className="display-6 fw-bold mb-3 text-linq-dark" style={{ fontSize: "3rem" }}>Our Teams</h2>
                        <p className="lead text-muted mx-auto" style={{ maxWidth: "900px" }}>
                            Meet the passionate individuals behind LINQ, each bringing unique expertise and dedication to every project.
                        </p>
                    </div>


                </div>

                <div className="services-container" style={{ position: 'relative', zIndex: 10, marginTop: '50px' }}>
                    {teamData.map((service, index) => (
                        <div
                            key={index}
                            className="service-card"
                            style={{
                                position: 'sticky',
                                top: '150px',
                                marginBottom: '4rem',
                                zIndex: index + 1,
                                overflow: 'hidden'
                            }}
                            data-aos="fade-up"
                            data-aos-delay={10}
                        >
                            <img
                                src={service.image}
                                alt={service.title}
                            />
                            <div className="service-overlay"></div>
                            <div className="service-content">
                                <h3 className="service-title">{service.title}</h3>
                                <p className="service-desc">{service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ViewOurTeam;
