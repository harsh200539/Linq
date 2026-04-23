"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock4, ExternalLink, Inbox } from 'lucide-react';

const JobCard = ({ job, index }) => {
  const router = useRouter();
  
  return (
    <div className="job-card-list-item h-100 shadow-sm rounded-4 p-4 border bg-white d-flex flex-column justify-content-between transition-all">
      <div>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="badge bg-primary bg-opacity-10 text-primary border-primary border-opacity-10 py-2 px-3 rounded-pill fw-bold">
            {job.title}
          </span>
          <span className="text-muted small fw-medium">{job.jobType || 'Full-Time'}</span>
        </div>
        
        <p className="text-muted mb-4 line-clamp-3" style={{ fontSize: '0.95rem' }}>
          {job.short_description || job.description || "No description provided."}
        </p>

        <div className="d-flex flex-column gap-2 mb-4">
          {job.location && (
            <div className="d-flex align-items-center gap-2 text-muted small">
              <MapPin size={14} className="text-primary" />
              <span>{job.location}</span>
            </div>
          )}
          {(job.employment_type || job.jobType) && (
            <div className="d-flex align-items-center gap-2 text-muted small">
              <Clock4 size={14} className="text-primary" />
              <span>{job.employment_type || job.jobType}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          if (job.slug) {
            router.push(`/careers/${job.slug}`);
          } else {
            router.push(`/careers/${job.id}`);
          }
        }}
        className="btn btn-primary w-100 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
        disabled={!(job.slug || job.id)}
      >
        View Details <ExternalLink size={14} />
      </button>

      <style jsx>{`
        .job-card-list-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
          border-color: rgba(13, 110, 253, 0.2) !important;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default function JobList({ jobs = [] }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-5 bg-light rounded-4 border border-dashed border-2">
        <Inbox size={48} className="text-muted mb-3 opacity-50" />
        <h3 className="h5 fw-bold text-dark mb-2">No roles found</h3>
        <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>
          We couldn&apos;t find any open positions matching your search. Try 
          broadening your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="job-list-grid row g-4" data-aos="fade-up">
      {jobs.map((job, idx) => (
        <div key={job.id || idx} className="col-md-6 col-lg-4">
          <JobCard job={job} index={idx} />
        </div>
      ))}
    </div>
  );
}
