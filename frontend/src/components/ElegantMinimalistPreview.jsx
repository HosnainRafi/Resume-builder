// src/components/ElegantMinimalistPreview.jsx

import React from 'react';
import './ElegantMinimalistPreview.css';

function ElegantMinimalistPreview({ resumeData }) {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [], // Added projects
  } = resumeData || {};

  return (
    <div className="elegant-minimalist-page">
      {/* Header */}
      <div className="elegant-header">
        <h1 className="elegant-name">{header.name || 'Your Name'}</h1>
        <p className="elegant-contact">
          {[header.email, header.phone, header.website, header.location]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="elegant-section">
          <h2 className="elegant-section-title">Professional Summary</h2>
          <p className="elegant-summary">{summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div className="elegant-section">
          <h2 className="elegant-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="elegant-item">
              <div className="elegant-item-header">
                <h3 className="elegant-item-title">
                  {exp.jobTitle || 'Job Title'} at {exp.company || 'Company'}
                </h3>
                <span className="elegant-item-date">
                  {exp.location || 'Location'} | {exp.startDate || 'Date'} -{' '}
                  {exp.endDate || 'Present'}
                </span>
              </div>
              <p className="elegant-item-description">
                {exp.description ||
                  'Description of responsibilities and key achievements.'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <div className="elegant-section">
          <h2 className="elegant-section-title">Projects</h2>
          {projects.map((proj, index) => (
            <div key={index} className="elegant-item">
              <div className="elegant-item-header">
                <h3 className="elegant-item-title">
                  {proj.name || 'Project Name'}
                </h3>
                <span className="elegant-item-date">{proj.year || 'Year'}</span>
              </div>
              <div className="elegant-item-subheader">
                {proj.technologies || 'Technologies Used'}
              </div>
              <p className="elegant-item-description">
                {proj.description ||
                  'Project description and key achievements.'}
              </p>
              {proj.link && (
                <p className="elegant-item-description">
                  <a
                    href={proj.link}
                    className="elegant-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="elegant-section">
          <h2 className="elegant-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="elegant-item">
              <div className="elegant-item-header">
                <h3 className="elegant-item-title">{edu.degree || 'Degree'}</h3>
                <span className="elegant-item-date">
                  {edu.graduationDate || 'Year'}
                </span>
              </div>
              <div className="elegant-item-subheader">
                {edu.institution || 'University'}, {edu.location || 'Location'}
              </div>
              {edu.gpa && (
                <p className="elegant-item-description">GPA: {edu.gpa}</p>
              )}
              {edu.honors && (
                <p className="elegant-item-description">
                  <em>{edu.honors}</em>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="elegant-section">
          <h2 className="elegant-section-title">Core Competencies</h2>
          <p className="elegant-skills">
            {(Array.isArray(skills) ? skills : []).join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}

export default ElegantMinimalistPreview;
