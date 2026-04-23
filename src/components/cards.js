import React from "react";
import { MapPin, Clock4, Mail } from "lucide-react";

// Individual Card Component
const ProjectCard = ({ data, isOpen, onToggle }) => {
  return (
    <div className={`card-container ${isOpen ? "open" : ""}`} onClick={onToggle}>
      <div className="card-header">
        <div className="title-pill">
          <span>{data.title}</span>
        </div>
      </div>

      <div className="card-content">
        <div className="detail-label">Job Description</div>
        <div className="detail-text" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
          {data.description ? (data.description.length > 150 ? data.description.substring(0, 150) + '...' : data.description) : "No description provided."}
        </div>

        {data.qualification && (
          <>
            <div className="detail-label" style={{ marginTop: '10px' }}>Qualification</div>
            <div className="detail-text" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
              {data.qualification.length > 40 ? data.qualification.substring(0, 40) + '...' : data.qualification}
            </div>
          </>
        )}

        {data.location && (
          <div className="detail-text"><MapPin size={20} color="#000000ff" strokeWidth={1} className="mx-1" />{data.location}</div>
        )}
        {data.jobType && (
          <div className="detail-text"><Clock4 size={20} color="#000000ff" strokeWidth={1} className="mx-1" />{data.jobType}</div>
        )}

        {data.emails && data.emails.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.emails.map((emailStr, idx) => {
              const parts = emailStr.split(':');
              const label = parts.length > 1 ? parts[0].trim() : '';
              const email = parts.length > 1 ? parts[1].trim() : emailStr.trim();
              return (
                <div key={idx} className="detail-text" style={{ display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} color="#000000ff" strokeWidth={1} className="mx-1" />
                  <span style={{ fontSize: '13px', color: '#374151' }}>
                    {label && `${label}: `}
                    <a
                      href={`mailto:${email}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: '#0e224e', textDecoration: 'none' }}
                    >
                      [{email}]
                    </a>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="status-group">
          <span style={{ color: data.statusColor }}>{data.status}</span>
        </div>

        <div className="avatar-group">
          {(data.avatars || []).map((avatar, idx) => (
            <img key={idx} className="avatar" src={avatar} alt="User avatar" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
