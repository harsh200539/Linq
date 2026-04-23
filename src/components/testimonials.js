"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { fetchTestimonials } from '../lib/api';

const DEFAULT_TESTIMONIALS = [
    { id: 'd1', name: 'Alex Rivera', role: 'Full Stack Developer', quote: 'LINQ has provided me with the perfect environment to grow my technical skills while working on impactful global projects.', category: 'MIDDLE', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: 'd2', name: 'Sarah Chen', role: 'UI/UX Designer', quote: 'The collaborative culture here is unmatched. Every idea is valued, and the focus on innovation is truly inspiring.', category: 'MIDDLE', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 'd3', name: 'James Wilson', role: 'Data Analyst', quote: 'Working at LINQ means being part of a team that actually cares about your professional evolution.', category: 'RIGHT', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    { id: 'd4', name: 'Priya Sharma', role: 'QA Lead', quote: 'Excellence is not just a goal here; it is the standard we live by every single day.', category: 'RIGHT', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { id: 'd5', name: 'Michael Beck', role: 'Project Manager', quote: 'The diversity of projects keeps us on our toes and ensures we are always at the cutting edge.', category: 'RIGHT', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', is_avatar_only: true }
];

export default function Testimonials({ initialTestimonials = [] }) {
    const [testimonials, setTestimonials] = useState(initialTestimonials.length > 0 ? initialTestimonials : DEFAULT_TESTIMONIALS);

    useEffect(() => {
        if (initialTestimonials.length > 0) {
            setTestimonials(initialTestimonials);
        } else {
            // Client-side fallback/refresh
            const loadData = async () => {
                const data = await fetchTestimonials();
                if (data && data.length > 0) {
                    setTestimonials(data);
                }
            };
            loadData();
        }
    }, [initialTestimonials]);

    const middleCards = testimonials.filter(t => t.category === 'MIDDLE').map(t => ({
        id: t.id,
        text: t.quote,
        name: t.name,
        title: t.role,
        img: t.image
    }));

    const rightCards = testimonials.filter(t => t.category === 'RIGHT').map(t => ({
        id: t.id,
        variant: t.is_avatar_only ? "avatar-only" : "",
        text: t.quote,
        name: t.name,
        title: t.role,
        img: t.image
    }));

    const allCards = [...middleCards, ...rightCards];

    const renderCard = (card, index, isRightCol = false) => {
        const isAvatarOnly = card.variant === "avatar-only";
        return (
            <div
                key={`${isRightCol ? 'right' : 'mid'}-${card.id}-${index}`}
                className={`testimonial-card ${isAvatarOnly ? 'avatar-only' : ''}`}
            >
                {!isAvatarOnly && card.text && (
                    <p className="testimonial-card-text">
                        {card.text}
                    </p>
                )}
                {(card.img || card.name) && (
                    <div className="testimonial-author-wrapper">
                        {card.img && (
                            <Image 
                                src={card.img} 
                                alt={card.name} 
                                width={48} 
                                height={48} 
                                className="testimonial-author-img" 
                            />
                        )}
                        <div>
                            <div className="testimonial-author-name">{card.name}</div>
                            <div className="testimonial-author-title">{card.title}</div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const midColRef = useRef(null);
    const rightColRef = useRef(null);
    const combinedColRef = useRef(null);

    useEffect(() => {
        // Recalculate animation speed once testimonials are loaded
        if (testimonials.length === 0) return;

        setTimeout(() => {
            const speedInPxPerSec = 40;
            if (midColRef.current) {
                const height = midColRef.current.offsetHeight;
                if (height > 0) midColRef.current.style.animationDuration = `${(height / 2) / speedInPxPerSec}s`;
            }
            if (rightColRef.current) {
                const height = rightColRef.current.offsetHeight;
                if (height > 0) rightColRef.current.style.animationDuration = `${(height / 2) / speedInPxPerSec}s`;
            }
            if (combinedColRef.current) {
                const height = combinedColRef.current.offsetHeight;
                if (height > 0) combinedColRef.current.style.animationDuration = `${(height / 2) / speedInPxPerSec}s`;
            }
        }, 100);
    }, [testimonials]);

    return (
        <div className="testimonials-section">
            <section className="testimonials-container">
                <div className="testimonials-grid">

                    {/* Left heading block */}
                    <div className="testimonials-heading-block">
                        <div className="testimonials-subtitle-wrapper">
                        </div>
                        <h2 className="display-6 fw-bold mb-3 text-linq-dark">
                            Thoughts of the Linqsters
                        </h2>
                        <p className="lead text-muted text-center">
                            At LINQ, our passionate team of innovators drives technological excellence and collaboration to create lasting value as a leader in the IT industry.
                        </p>
                    </div>

                    {/* Combined column (Mobile/Tablet Only) */}
                    <div className="testimonials-scroll-wrapper combined-wrapper">
                        <div className="testimonials-scroll-col-up" ref={combinedColRef}>
                            {allCards.map((c, i) => renderCard(c, i, false))}
                            {allCards.map((c, i) => renderCard(c, i + allCards.length, false))}
                            {allCards.map((c, i) => renderCard(c, i + allCards.length * 2, false))}
                            {allCards.map((c, i) => renderCard(c, i + allCards.length * 3, false))}
                        </div>
                    </div>

                    {/* Middle column (Scrolling Up - Desktop Only) */}
                    <div className="testimonials-scroll-wrapper desktop-wrapper">
                        <div className="testimonials-scroll-col-up" ref={midColRef}>
                            {/* Render the cards list multiple times to ensure enough height for infinite scroll */}
                            {middleCards.map((c) => renderCard(c, 0, false))}
                            {middleCards.map((c) => renderCard(c, 1, false))}
                            {middleCards.map((c) => renderCard(c, 2, false))}
                            {middleCards.map((c) => renderCard(c, 3, false))}
                        </div>
                    </div>

                    {/* Right column (Scrolling Down - Desktop Only) */}
                    <div className="testimonials-scroll-wrapper desktop-wrapper">
                        <div className="testimonials-scroll-col-down" ref={rightColRef}>
                            {/* Render the cards list multiple times to ensure enough height for infinite scroll */}
                            {rightCards.map((c, i) => renderCard(c, i, true))}
                            {rightCards.map((c, i) => renderCard(c, i + rightCards.length, true))}
                            {rightCards.map((c, i) => renderCard(c, i + rightCards.length * 2, true))}
                            {rightCards.map((c, i) => renderCard(c, i + rightCards.length * 3, true))}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}