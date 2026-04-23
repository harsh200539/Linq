"use client";
import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Container, Row, Col } from 'react-bootstrap';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { TeamCard, ExperienceTimeline, ArrowIcon, BriefcaseIcon } from './career-growth-components';

/* --- Main View Components --- */

export const CareerGrowthHome = ({ members }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'center', skipSnaps: true, dragFree: true },
        [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false, stopOnMouseEnter: false })]
    );

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const mobileSliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 3000
    };

    const play = useCallback(() => {
        const autoScroll = emblaApi?.plugins()?.autoScroll;
        if (autoScroll) autoScroll.play();
    }, [emblaApi]);

    const stop = useCallback(() => {
        const autoScroll = emblaApi?.plugins()?.autoScroll;
        if (autoScroll) autoScroll.stop();
    }, [emblaApi]);

    return (
        <div className="cg-scroll-section home-section-bg">
            <h2 className="display-6 fw-bold mb-3 text-linq-dark text-center">Career Growth of Linqsters</h2>
            <p className="section-description-text">
                Explore how our team members have evolved and contributed to the success of LINQ.
            </p>
            <div className="embla-wrapper">
                <div className="career-growth-sliders-wrapper">
                    {/* Desktop/Tablet Slider: Your original Embla Auto-scroll */}
                    <div className="desktop-career-slider">
                        <div
                            className="embla"
                            ref={emblaRef}
                            onMouseEnter={stop}
                            onMouseLeave={play}
                        >
                            <div className="embla__container">
                                {[...members, ...members].map((member, index) => {
                                    const slug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                    return (
                                        <div key={`${member.id}-${index}`} className="embla__slide">
                                            <Link href={`/career-growth/member/${slug}`} className="cursor-pointer-cg text-decoration-none">
                                                <TeamCard member={member} />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Slider: React-Slick snapping 1 card */}
                    <div className="mobile-career-slider">
                        <Slider {...mobileSliderSettings}>
                            {members.map((member, index) => {
                                const slug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                return (
                                    <div key={`mobile-${member.id}-${index}`} className="mobile-slick-slide px-2 pb-4">
                                        <Link href={`/career-growth/member/${slug}`} className="cursor-pointer-cg text-decoration-none">
                                            <TeamCard member={member} />
                                        </Link>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MemberDetail = ({ member }) => {
    const router = useRouter();
    if (!member) {
        return <div className="min-h-screen-cg d-flex align-items-center justify-content-center">Member not found</div>;
    }

    return (
        <div className={`details-page-container ${member.memberBgClass}`}>
            <button 
                onClick={() => {
                    const isHome = window.location.pathname === '/' || window.location.pathname === '/home';
                    if (isHome) {
                        window.dispatchEvent(new CustomEvent('linq-manual-scroll', { detail: 'career-growth' }));
                    } else {
                        router.push('/');
                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('linq-manual-scroll', { detail: 'career-growth' }));
                        }, 500);
                    }
                }} 
                className="details-back-button text-decoration-none border-0 bg-transparent"
                style={{ cursor: 'pointer' }}
            >
                <ChevronLeft size={24} /> Back to Home
            </button>

            <Container className="py-5">
                <Row className="align-items-start mb-0">
                    {/* Left Column: Image, Title, and About */}
                    <Col xl={8} lg={12} md={12} className="mb-5 mb-xl-0">
                        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start justify-content-center justify-content-md-start text-center text-md-start mb-5 gap-4">
                            <div className="detail-image-wrapper">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="img-fluid rounded shadow-lg"
                                    style={{ width: '100%', maxWidth: '300px' }}
                                />
                            </div>
                            <div className="detail-title-group-nested">
                                <h1 className="detail-name mb-3">{member.name}</h1>
                                <div className="detail-role text-accent">{member.role}</div>
                            </div>
                        </div>
                        <div className="detail-about-wrapper">
                            <h2 className="detailed-description-title mb-4">About {member.name.split(' ')[0]}</h2>
                            <p className="detailed-description-text">{member.detailedDescription}</p>
                        </div>
                    </Col>

                    {/* Right Column: Experience */}
                    <Col xl={4} lg={12} md={12}>
                        <h2 className="detailed-description-title mb-4">Experience</h2>
                        <ExperienceTimeline experiences={member.experiences || []} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

import { DEFAULT_MEMBERS } from "../lib/default-data";
import { fetchMembers as fetchMembersAPI } from "../lib/api";

const CareerGrowth = ({ members = [], activeMemberSlug = null }) => {
    // Stage data: start with SSR members or fallbacks
    const [displayMembers, setDisplayMembers] = useState(members.length > 0 ? members : DEFAULT_MEMBERS);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
        // Background refresh to ensure absolute freshness (handles 24h cache vs instant update)
        const refreshData = async () => {
            try {
                const freshMembers = await fetchMembersAPI();
                if (freshMembers && freshMembers.length > 0) {
                    // Safety check: ensure we don't downgrade data richness
                    // If we already have members with experiences, and the fresh data has fewer, something is wrong
                    const currentTotalExperiences = displayMembers.reduce((sum, m) => sum + (m.experiences?.length || 0), 0);
                    const freshTotalExperiences = freshMembers.reduce((sum, m) => sum + (m.experiences?.length || 0), 0);
                    
                    if (freshTotalExperiences >= currentTotalExperiences) {
                        setDisplayMembers(freshMembers);
                    } else {
                        console.warn("Fresh data has fewer experiences than current data, skipping update to prevent flickering/data loss.");
                    }
                }
            } catch (err) {
                console.warn("Background refresh failed, using cached/fallback data", err);
            }
        };
        
        refreshData();
    }, []);

    // If a slug is provided, we show only that member's detail view
    if (activeMemberSlug) {
        const member = displayMembers.find(m => {
            const slug = m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            return slug === activeMemberSlug;
        });
        
        return (
            <div className="career-growth-wrapper">
                 {member ? <MemberDetail member={member} /> : <div className="p-5 text-center">Member not found.</div>}
            </div>
        );
    }

    // Default: Show the Linqster Slider
    // We only show Embla on client to avoid hydration issues with autoplay plugins
    if (!isClient) {
        return (
            <div className="career-growth-wrapper">
                <div className="cg-scroll-section home-section-bg" style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="career-growth-wrapper">
            <CareerGrowthHome members={displayMembers} />
        </div>
    );
};

export default CareerGrowth;


