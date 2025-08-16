// src/components/ModernTemplatePreview.jsx

import React from 'react';
import './ModernTemplatePreview.css';

const padArray = (arr, min) => {
  const copy = Array.isArray(arr) ? [...arr] : [];
  while (copy.length < min) copy.push({});
  return copy;
};

function ModernTemplatePreview({ resumeData }) {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  return (
    <div className="modern-template-preview-page">
      {/* Header */}
      <div className="modern-header">
        <h1 className="modern-name">{header.name || 'Your Name'}</h1>
        <p className="modern-contact">
          {[header.email, header.phone, header.location, header.website]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="modern-section">
          <h2 className="modern-section-title">Professional Summary</h2>
          <p className="modern-item-description">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="modern-section">
          <h2 className="modern-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="modern-item">
              <div className="modern-item-header">
                <h3 className="modern-item-title">
                  {exp.jobTitle || 'Job Title'}
                </h3>
                <span className="modern-item-date">
                  {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                </span>
              </div>
              <div className="modern-item-subheader">
                <span>{exp.company || 'Company Name'}</span>
                <span className="modern-item-location">
                  {exp.location || 'City, State'}
                </span>
              </div>
              <p className="modern-item-description">
                {exp.description ||
                  'Describe your responsibilities and achievements.'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="modern-section">
          <h2 className="modern-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="modern-item">
              <div className="modern-item-header">
                <h3 className="modern-item-title">
                  {edu.degree || 'Degree or Certificate'}
                </h3>
                <span className="modern-item-date">
                  {edu.graduationDate || 'Year'}
                </span>
              </div>
              <div className="modern-item-subheader">
                <span>{edu.institution || 'Institution'}</span>
                <span className="modern-item-location">
                  {edu.location || 'City, State'}
                </span>
              </div>
              {edu.gpa && (
                <p className="modern-item-description">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="modern-section">
          <h2 className="modern-section-title">Skills</h2>
          <p className="modern-skills-text">
            {(Array.isArray(skills) ? skills : []).join(', ')}
          </p>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="modern-section">
          <h2 className="modern-section-title">Projects</h2>
          {projects.map((proj, index) => (
            <div key={index} className="modern-item">
              <h3 className="modern-item-title">
                {proj.name || 'Project Name'}
              </h3>
              <p className="modern-item-description">
                <strong>Technologies:</strong>{' '}
                {proj.technologies || 'React, Node.js, MongoDB'}
              </p>
              <p className="modern-item-description">
                {proj.description ||
                  'Describe the project, its purpose, and your role.'}
              </p>
              {proj.link && (
                <p className="modern-item-description">
                  <a
                    href={proj.link}
                    className="modern-project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project →
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModernTemplatePreview;
