'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGlobalData } from '../../../src/context/GlobalDataContext';
import { fetchJobBySlug } from '../../../src/lib/api';
import { Navbar } from '../../../src/components/navbar';
import Footer from '../../../src/components/footer';
import {
  MapPin,
  Clock4,
  Mail,
  ArrowLeft,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  CircleUser,
  Users,
  Send,
  Building2
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const context = useGlobalData();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      setError(null);

      const contextJobs = context?.jobs || [];
      const cachedJob = contextJobs.find(j =>
        String(j.slug) === String(slug) || String(j.id) === String(slug)
      );

      // Only skip fetch if we have the FULL job details in cache
      if (cachedJob && (cachedJob.full_description || cachedJob.qualifications)) {
        setJob(cachedJob);
        setLoading(false);
        if (String(cachedJob.id) === String(slug) && cachedJob.slug) {
          router.replace(`/careers/${cachedJob.slug}`);
        }
        return;
      }

      try {
        const directJob = await fetchJobBySlug(slug);
        if (directJob) {
          setJob(directJob);
        } else {
          // If fetch fails but we have a cached summary, use that as last resort
          if (cachedJob) {
            setJob(cachedJob);
          } else {
            setError("Job not found");
          }
        }
      } catch (err) {
        if (cachedJob) {
          setJob(cachedJob);
        } else {
          setError("Failed to load job details");
        }
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadJob();
    }
  }, [slug, context, router]);

  if (loading) {
    return (
      <div className="min-vh-100 bg-white flex-column d-flex">
        <Navbar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <Loader2 className="animate-spin text-primary mb-3" size={48} />
            <p className="text-muted fw-bold small text-uppercase tracking-wider">Gathering Role Details</p>
          </div>
        </div>
        <Footer />
        <style jsx>{`
          .animate-spin { animation: spin 0.8s linear infinite; }
          .tracking-wider { letter-spacing: 0.1em; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-vh-100 bg-light flex-column d-flex">
        <Navbar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center flex-column text-center p-5">
          <div className="bg-white p-5 rounded-4 shadow-lg border" style={{ maxWidth: '500px' }}>
            <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle d-inline-block mb-4">
              <Briefcase size={32} />
            </div>
            <h2 className="fw-bold text-dark mb-3">Position Unavailable</h2>
            <p className="text-muted mb-4 opacity-75">
              The role you are looking for may have been filled or is no longer accepting applications.
            </p>
            <button
              onClick={() => router.push('/careers')}
              className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-sm"
            >
              Back to Career Hub
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const qualificationsList = Array.isArray(job.qualifications)
    ? job.qualifications
    : (job.qualifications ? [job.qualifications] : []);

  return (
    <div className="bg-white min-vh-100 d-flex flex-column" style={{ color: '#0f172a' }}>
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="bg-light pt-5 pb-5 mt-5 border-bottom border-opacity-10">
        <div className="container pt-lg-5 pb-lg-4">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <button
                onClick={() => router.back()}
                className="btn btn-link text-decoration-none text-muted d-flex align-items-center gap-2 mb-4 p-0 fw-medium hover-primary"
              >
                <ArrowLeft size={18} />
                <span className="small text-uppercase tracking-wider">Back to Listings</span>
              </button>

              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small fw-bold">
                  {job.status || 'Active'}
                </span>
                <span className="text-muted small fw-medium opacity-50">/</span>
                <span className="text-muted small fw-medium">{job.location || 'Remote Opt'}</span>
              </div>

              <h1 className="display-4 fw-bold mb-4 tracking-tight" style={{ color: '#0e224e' }}>
                {job.title}
              </h1>

              <div className="d-flex flex-wrap gap-4">
                <div className="d-flex align-items-center gap-2 text-muted fw-medium">
                  <div className="bg-white p-2 rounded-3 shadow-sm border">
                    <Building2 size={18} className="text-primary" />
                  </div>
                  <span>Vadodara, India</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted fw-medium">
                  <div className="bg-white p-2 rounded-3 shadow-sm border">
                    <Clock4 size={18} className="text-primary" />
                  </div>
                  <span>{job.employment_type || job.jobType || 'Full-Time'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT (70/30 Split) ── */}
      <main className="flex-grow-1 py-5">
        <div className="container py-lg-4">
          <div className="row g-5 justify-content-center">
            {/* ── LEFT: ROLE CONTENT (70%) ── */}
            <div className="col-lg-8">
              <div className="content-card mb-5">
                <h3 className="fw-bold mb-4 d-flex align-items-center gap-3">
                  <div className="bg-primary p-1 rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                  About the Role
                </h3>
                <div className="body-text">
                  {job.full_description || job.description || "No detailed description provided."}
                </div>
              </div>

              {job.context && (
                <div className="content-card mb-5">
                  <h3 className="fw-bold mb-4 d-flex align-items-center gap-3">
                    <div className="bg-primary p-1 rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                    Role Context
                  </h3>
                  <div className="body-text bg-light p-4 rounded-4 border-start border-primary border-4 shadow-sm">
                    {job.context}
                  </div>
                </div>
              )}

              {qualificationsList.length > 0 && (
                <div className="content-card mb-5">
                  <h3 className="fw-bold mb-4 d-flex align-items-center gap-3">
                    <div className="bg-primary p-1 rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                    Qualifications & Requirements
                  </h3>
                  <ul className="list-unstyled d-flex flex-column gap-3">
                    {qualificationsList.map((item, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-3 p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border">
                        <div className="bg-white shadow-sm p-2 rounded-3 mt-1">
                          <CheckCircle2 size={16} className="text-primary" />
                        </div>
                        <span className="body-text m-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ── RIGHT: SIDEBAR (30%) ── */}
            <div className="col-lg-3">
              <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
                {/* Application Details Card */}
                <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
                  <h5 className="fw-bold mb-4 small text-uppercase tracking-wider opacity-50">Role Overview</h5>

                  <div className="mb-4">
                    <p className="small fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.65rem' }}>Reporting To</p>
                    <div className="d-flex align-items-center gap-2">
                      <CircleUser size={18} className="text-primary opacity-75" />
                      <span className="fw-bold small">{job.reporting_to || 'Hiring Manager'}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="small fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.65rem' }}>Team Strength</p>
                    <div className="d-flex align-items-center gap-2">
                      <Users size={18} className="text-primary opacity-75" />
                      <span className="fw-bold small">Vadodara Ops Core</span>
                    </div>
                  </div>

                  <hr className="opacity-10 my-4" />

                  <div className="mb-4">
                    <p className="small fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.65rem' }}>Employment Type</p>
                    <div className="d-flex align-items-center gap-2">
                      <ShieldCheck size={18} className="text-success opacity-75" />
                      <span className="fw-bold small">{job.employment_type || 'Permanent Role'}</span>
                    </div>
                  </div>

                  <div className="mb-0">
                    <p className="small fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.65rem' }}>Primary Location</p>
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={18} className="text-primary opacity-75" />
                      <span className="fw-bold small">{job.location || 'Office Based'}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-dark rounded-4 p-4 p-lg-5 text-white shadow-lg overflow-hidden position-relative border border-secondary border-opacity-10">


                  <div className="position-relative z-1">
                    <h4 className="fw-bold mb-3">Ready to Apply?</h4>
                    <p className="small opacity-75 mb-4 pr-lg-4">
                      Join our team of high-performers. Reach out to our HR team today to start your journey.
                    </p>

                    {(job.application_email || job.emails) ? (
                      <a
                        href={`mailto:${job.application_email || job.emails}`}
                        className="btn btn-primary w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow hover-lift"
                      >
                        <Mail size={18} /> Apply via Email
                      </a>
                    ) : (
                      <button className="btn btn-outline-light w-100 py-3 rounded-pill fw-bold disabled opacity-25">
                        No Contact listed
                      </button>
                    )}

                    <div className="text-center mt-4 pt-1">
                      <span className="xsmall opacity-40 font-monospace tracking-wide">REF CODE: {job.slug?.toUpperCase() || job.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .content-card h3 {
          color: #0e224e;
          font-size: 1.5rem;
        }
        .body-text {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #475569;
          white-space: pre-line;
        }
        .hover-primary:hover {
          color: #0d6efd !important;
        }
        .hover-border:hover {
          background: #f8fafc !important;
          border-color: rgba(13, 110, 253, 0.1) !important;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3) !important;
        }
        .tracking-tight { letter-spacing: -0.02em; }
        .tracking-wider { letter-spacing: 0.1em; }
        .xsmall { font-size: 0.7rem; }
        .z-1 { z-index: 1; }
        
        @media (max-width: 991px) {
          .display-4 { font-size: 2.5rem; }
          .sticky-top { position: static !important; }
        }
      `}</style>
    </div>
  );
}
