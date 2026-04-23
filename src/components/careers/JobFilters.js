"use client";
import React from 'react';
import { Search } from 'lucide-react';

export default function JobFilters({ search, setSearch }) {
  return (
    <div className="job-filters-container mb-5" data-aos="fade-up">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="search-wrapper position-relative">
            <Search 
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
              size={20} 
            />
            <input
              type="text"
              className="form-control form-control-lg ps-5 py-3 shadow-sm border-0 rounded-4"
              placeholder="Search by job title, department, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '1.1rem' }}
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .search-wrapper input:focus {
          box-shadow: 0 0 0 0.25rem rgba(14, 34, 78, 0.1) !important;
          border: 1px solid rgba(14, 34, 78, 0.2) !important;
        }
        .job-filters-container {
          margin-top: -30px;
          position: relative;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
