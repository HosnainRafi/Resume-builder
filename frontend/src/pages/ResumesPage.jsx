// src/pages/ResumesPage.jsx

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import apiClient from '../api/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './ResumesPage.css';

// Import your template preview components
import ClassicTemplatePreview from '../components/ClassicTemplatePreview';
import ModernTemplatePreview from '../components/ModernTemplatePreview';
import TechModernPreview from '../components/TechModernPreview';
import ElegantMinimalistPreview from '../components/ElegantMinimalistPreview';
import CreativeColorSplashPreview from '../components/CreativeColorSplashPreview';
import ProfessionalCorporatePreview from '../components/ProfessionalCorporatePreview';
import StudentEntryLevelPreview from '../components/StudentEntryLevelPreview';
import InfographicVisualPreview from '../components/InfographicVisualPreview';
import ModernExecutivePreview from '../components/ModernExecutivePreview';

// Template mapping for proper display names
const TEMPLATE_MAP = {
  classic: 'Classic',
  modern: 'Modern',
  'tech-modern': 'Tech Modern',
  'elegant-minimalist': 'Elegant Minimalist',
  'creative-colorsplash': 'Creative Color Splash',
  'professional-corporate': 'Professional Corporate',
  'student-entry-level': 'Student Entry Level',
  'infographic-visual': 'Infographic Visual',
  'modern-executive': 'Modern Executive',
};

// Template preview components mapping
const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplatePreview,
  modern: ModernTemplatePreview,
  'tech-modern': TechModernPreview,
  'elegant-minimalist': ElegantMinimalistPreview,
  'creative-colorsplash': CreativeColorSplashPreview,
  'professional-corporate': ProfessionalCorporatePreview,
  'student-entry-level': StudentEntryLevelPreview,
  'infographic-visual': InfographicVisualPreview,
  'modern-executive': ModernExecutivePreview,
};

// Fetcher function for SWR
const fetcher = (url) => apiClient.get(url).then((res) => res.data.data);

const ResumesPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('updated');

  const { data: resumes, error, isLoading } = useSWR('/api/resumes', fetcher);

  const handleDelete = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await apiClient.delete(`/api/resumes/${resumeId}`);
        mutate('/api/resumes');
      } catch (error) {
        alert(`Error deleting resume: ${error.message}`);
      }
    }
  };

  const handleDuplicate = async (resume) => {
    try {
      const duplicatedData = {
        ...resume,
        title: `${resume.title} (Copy)`,
      };
      delete duplicatedData._id;
      delete duplicatedData.createdAt;
      delete duplicatedData.updatedAt;

      await apiClient.post('/api/resumes', duplicatedData);
      mutate('/api/resumes');
    } catch (error) {
      alert(`Error duplicating resume: ${error.message}`);
    }
  };

  const getSortedResumes = () => {
    if (!resumes) return [];

    const sorted = [...resumes].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updated':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    return sorted;
  };

  const getResumeScore = (resume) => {
    const hasHeader =
      resume.header && resume.header.name && resume.header.email;
    const hasSummary = resume.summary && resume.summary.length > 50;
    const hasExperience = resume.experience && resume.experience.length > 0;
    const hasSkills = resume.skills && resume.skills.length >= 5;
    const hasEducation = resume.education && resume.education.length > 0;

    let score = 0;
    if (hasHeader) score += 20;
    if (hasSummary) score += 20;
    if (hasExperience) score += 30;
    if (hasSkills) score += 20;
    if (hasEducation) score += 10;

    return Math.min(score, 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getTemplateDisplayName = (templateId) => {
    return TEMPLATE_MAP[templateId] || templateId || 'Classic';
  };

  // NEW: Function to render live resume preview
  const renderResumePreview = (resume) => {
    const templateId = resume.template || 'classic';
    const PreviewComponent =
      TEMPLATE_COMPONENTS[templateId] || TEMPLATE_COMPONENTS['classic'];

    return (
      <div className="rezi-resume-live-preview">
        <div className="rezi-preview-scale-wrapper">
          <PreviewComponent resumeData={resume} />
        </div>
      </div>
    );
  };

  const handleDownloadPDF = async (resume) => {
    try {
      navigate(`/resumes/${resume._id}/edit`);
    } catch (error) {
      alert(`Error downloading PDF: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="rezi-page">
        <Navigation />
        <div className="rezi-page-content">
          <div className="rezi-loading-state">
            <div className="rezi-loading-spinner"></div>
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
          <div className="rezi-error-state">
            <div className="rezi-error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>Error loading resumes: {error.message}</p>
            <button
              className="rezi-btn rezi-btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedResumes = getSortedResumes();

  return (
    <div className="rezi-page">
      <Navigation />
      <div className="rezi-page-content">
        {/* Header Section */}
        <div className="rezi-dashboard-header">
          <div className="rezi-header-left">
            <h1 className="rezi-dashboard-title">My Resumes</h1>
            <p className="rezi-dashboard-subtitle">
              {sortedResumes.length} resume
              {sortedResumes.length === 1 ? '' : 's'} • Keep your resumes
              organized and optimized
            </p>
          </div>
          <div className="rezi-header-actions">
            <button
              onClick={() => navigate('/resumes/create/1')}
              className="rezi-btn rezi-btn-primary rezi-btn-lg"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              New Resume
            </button>
          </div>
        </div>

        {/* Controls Section */}
        <div className="rezi-dashboard-controls">
          <div className="rezi-controls-left">
            <div className="rezi-view-toggle">
              <button
                className={`rezi-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zm-10 10h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
              </button>
              <button
                className={`rezi-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                </svg>
              </button>
            </div>

            <div className="rezi-sort-dropdown">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rezi-select"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="rezi-controls-right">
            <div className="rezi-stats">
              <span className="rezi-stat-item">
                📊 Avg Score:{' '}
                {sortedResumes.length > 0
                  ? Math.round(
                      sortedResumes.reduce(
                        (sum, resume) => sum + getResumeScore(resume),
                        0
                      ) / sortedResumes.length
                    )
                  : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {!sortedResumes || sortedResumes.length === 0 ? (
          <div className="rezi-empty-state">
            <div className="rezi-empty-illustration">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <rect
                  x="30"
                  y="20"
                  width="60"
                  height="80"
                  rx="4"
                  fill="#f8f9fa"
                  stroke="#e9ecef"
                  strokeWidth="2"
                />
                <rect x="35" y="30" width="50" height="3" fill="#dee2e6" />
                <rect x="35" y="40" width="35" height="2" fill="#dee2e6" />
                <rect x="35" y="50" width="40" height="2" fill="#dee2e6" />
                <rect x="35" y="60" width="30" height="2" fill="#dee2e6" />
                <circle cx="60" cy="85" r="15" fill="#667eea" opacity="0.1" />
                <path d="M55 85h10m-5-5v10" stroke="#667eea" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="rezi-empty-title">No resumes yet</h3>
            <p className="rezi-empty-description">
              Create your first resume to get started with your job search. Our
              AI will help you build a professional, ATS-optimized resume in
              minutes.
            </p>
            <button
              onClick={() => navigate('/resumes/create/1')}
              className="rezi-btn rezi-btn-primary rezi-btn-lg"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className={`rezi-resumes-container ${viewMode}`}>
            {sortedResumes.map((resume) => {
              const score = getResumeScore(resume);

              return (
                <div
                  key={resume._id}
                  className={`rezi-resume-item ${viewMode}`}
                >
                  {/* UPDATED: Live Resume Preview */}
                  <div className="rezi-resume-preview">
                    {renderResumePreview(resume)}
                    <div className="rezi-preview-overlay">
                      <button
                        className="rezi-preview-overlay-btn"
                        onClick={() => navigate(`/resumes/${resume._id}/edit`)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        Preview
                      </button>
                    </div>
                  </div>

                  {/* Resume Content */}
                  <div className="rezi-resume-content">
                    <div className="rezi-resume-header">
                      <h3 className="rezi-resume-title">
                        {resume.header?.name ||
                          resume.title ||
                          'Untitled Resume'}
                      </h3>
                      <div className="rezi-resume-actions">
                        <button
                          onClick={() => handleDuplicate(resume)}
                          className="rezi-action-btn"
                          title="Duplicate"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(resume._id)}
                          className="rezi-action-btn rezi-action-btn-danger"
                          title="Delete"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="rezi-resume-meta">
                      <div className="rezi-meta-item">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                        Updated{' '}
                        {new Date(resume.updatedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </div>

                      <div className="rezi-meta-item">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {getTemplateDisplayName(resume.template)} Template
                      </div>

                      <div className="rezi-meta-item rezi-score-item">
                        <div
                          className="rezi-score-circle"
                          style={{
                            background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, #f0f0f0 0deg)`,
                          }}
                        >
                          <span style={{ color: getScoreColor(score) }}>
                            {score}
                          </span>
                        </div>
                        Rezi Score
                      </div>
                    </div>

                    <div className="rezi-resume-actions-main">
                      <Link
                        to={`/resumes/${resume._id}/edit`}
                        className="rezi-btn rezi-btn-primary"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Edit Resume
                      </Link>

                      <button
                        className="rezi-btn rezi-btn-secondary"
                        onClick={() => handleDownloadPDF(resume)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M14 9V3.5L20.5 10H14zM6 2h8l6 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm9 16v-2H9v2h6zm3-4v-2H6v2h12z" />
                        </svg>
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumesPage;
