// src/pages/ResumesPage.jsx

import React from 'react';
import useSWR, { mutate } from 'swr';
import apiClient from '../api/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

// Fetcher function for SWR
const fetcher = (url) => apiClient.get(url).then((res) => res.data.data);

const ResumesPage = () => {
  const navigate = useNavigate();

  const { data: resumes, error, isLoading } = useSWR('/api/resumes', fetcher);

  const handleDelete = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await apiClient.delete(`/api/resumes/${resumeId}`);
        // Revalidate the cache after deletion
        mutate('/api/resumes');
      } catch (error) {
        alert(`Error deleting resume: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="rezi-page">
        <Navigation />
        <div className="rezi-page-content">
          <div className="rezi-loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your resumes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rezi-page">
        <Navigation />
        <div className="rezi-page-content">
          <div className="alert alert-danger">
            Error loading resumes: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rezi-page">
      <Navigation />
      <div className="rezi-page-content">
        <div className="rezi-page-header">
          <div>
            <h1 className="rezi-page-title">My Resumes</h1>
            <p className="rezi-page-subtitle">
              {resumes?.length || 0} resume{resumes?.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            onClick={() => navigate('/resumes/create/1')}
            className="btn btn-primary btn-lg"
          >
            <span>+</span>
            New Resume
          </button>
        </div>

        {!resumes || resumes.length === 0 ? (
          <div className="rezi-empty-state">
            <div className="rezi-empty-icon">📄</div>
            <h3>No resumes yet</h3>
            <p>Create your first resume to get started with your job search.</p>
            <button
              onClick={() => navigate('/resumes/create/1')}
              className="btn btn-primary btn-lg"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="rezi-resume-grid">
            {resumes.map((resume) => (
              <div key={resume._id} className="rezi-resume-card">
                <div className="rezi-resume-card-header">
                  <h3 className="rezi-resume-card-title">{resume.title}</h3>
                  <div className="rezi-resume-card-actions">
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="rezi-action-btn rezi-action-btn-danger"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="rezi-resume-card-meta">
                  <span className="rezi-meta-item">
                    📅 {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="rezi-meta-item">
                    📝 {resume.template || 'Default'} template
                  </span>
                </div>
                <div className="rezi-resume-card-actions-main">
                  <Link
                    to={`/resumes/${resume._id}/edit`}
                    className="btn btn-primary"
                  >
                    Edit Resume
                  </Link>
                  <button className="btn btn-secondary">Download PDF</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumesPage;
