import React from 'react';
import NextImage from 'next/image';

export const ArrowIcon = () => (
    <svg className="header-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export const BriefcaseIcon = () => (
    <svg className="timeline-marker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

export const ExperienceTimeline = ({ experiences }) => {
    return (
        <div className="timeline-container">
            {experiences.map((exp, index) => (
                <div key={`${exp.id}-${index}`} className="timeline-item">
                    <div className={`timeline-marker ${exp.type}`}></div>
                    <div className="experience-card">
                        <div className="experience-card-header">
                            <h3 className="experience-title">{exp.title}</h3>
                            <ArrowIcon />
                        </div>
                        <div className="experience-meta">
                            <span>{exp.year}</span>
                            <div className="meta-dot"></div>
                            <span>{exp.duration}</span>
                        </div>
                        <p className="experience-description">{exp.description}</p>
                    </div>
                </div>
            ))}
            <footer className="timeline-footer">
                <div className="timeline-end-icon">
                    <BriefcaseIcon />
                </div>
            </footer>
        </div>
    );
};

export const TeamCard = ({ member }) => {
    return (
        <div className="team-card-container">
            <div className={`absolute-cg inset-0-cg ${member.memberBgClass}`} />
            <div className="team-card-content">
                <div className="team-card-name-group">
                    <div className="team-card-name-line">{member.name}</div>
                </div>
                <div className="team-card-role">{member.role}</div>
                <div className="team-card-description">{member.description}</div>
                <div className="glow" />
                <div className="img">
                    <NextImage 
                        src={member.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${member.name}`} 
                        alt={member.name} 
                        fill 
                        sizes="200px"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    );
};
