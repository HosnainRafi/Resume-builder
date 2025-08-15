import React from 'react';
import './CreativeColorSplashPreview.css';

const padArray = (arr, min) => {
  const copy = Array.isArray(arr) ? [...arr] : [];
  while (copy.length < min) copy.push({});
  return copy;
};

function CreativeColorSplashPreview({ resumeData, sectionOnly = null }) {
  const {
    header = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  // Render individual sections
  const renderSection = (sectionType) => {
    switch (sectionType) {
      case 'header':
        return (
          <div className="creative-header">
            <div className="creative-header-text">
              <h1 className="creative-name">{header.name || 'Your Name'}</h1>
              <p className="creative-title">
                {header.title || 'Professional Title'}
              </p>
            </div>
            <div className="creative-photo-placeholder"></div>
          </div>
        );

      case 'experience':
        return (
          <div className="creative-main">
            <h2 className="creative-main-title">Experience</h2>
            {padArray(experience, 1).map((exp, i) => (
              <div key={`exp-${i}`} className="creative-item">
                <div className="creative-item-date">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </div>
                <h3 className="creative-item-title">
                  {exp.jobTitle || 'Job Title'}
                </h3>
                <div className="creative-item-company">
                  {exp.company || 'Company'}
                </div>
                <p className="creative-item-description">
                  {exp.description || 'Description of work and achievements.'}
                </p>
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="creative-main">
            <h2 className="creative-main-title">Education</h2>
            {padArray(education, 1).map((edu, i) => (
              <div key={`edu-${i}`} className="creative-item">
                <div className="creative-item-date">
                  {edu.graduationDate || 'Year'}
                </div>
                <h3 className="creative-item-title">
                  {edu.degree || 'Degree'}
                </h3>
                <div className="creative-item-company">
                  {edu.institution || 'Institution'}{' '}
                  {edu.location && `| ${edu.location}`}
                </div>
                {edu.gpa && (
                  <p className="creative-item-description">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div className="creative-sidebar">
            <h2 className="creative-sidebar-title">Expertise</h2>
            <div className="creative-tags">
              {padArray(skills, 3).map((skill, i) => (
                <span key={`skill-${i}`} className="creative-tag">
                  {skill || 'Sample Skill'}
                </span>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="creative-main">
            <h2 className="creative-main-title">Projects</h2>
            {padArray(projects, 1).map((proj, i) => (
              <div key={`proj-${i}`} className="creative-item">
                <h3 className="creative-item-title">
                  {proj.name || 'Project Name'}
                </h3>
                <div className="creative-item-company">
                  Technologies: {proj.technologies || 'React, Node.js'}
                </div>
                <p className="creative-item-description">
                  {proj.description || 'Describe your project.'}
                </p>
                {proj.link && (
                  <a href={proj.link} className="creative-link">
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // If rendering only one section for drag-and-drop
  if (sectionOnly) {
    return renderSection(sectionOnly);
  }

  // Original full template rendering
  return (
    <div className="creative-page">
      {renderSection('header')}

      <div className="creative-body">
        <div className="creative-sidebar">
          <div className="creative-sidebar-section">
            <h2 className="creative-sidebar-title">About Me</h2>
            <p>
              {header.summary ||
                'A brief summary about your professional self.'}
            </p>
          </div>

          <div className="creative-sidebar-section">
            <h2 className="creative-sidebar-title">Contact</h2>
            <p>{header.email || 'email@example.com'}</p>
            <p>{header.phone || '(123) 456-7890'}</p>
            <p>{header.website || 'portfolio.com'}</p>
          </div>

          <div className="creative-sidebar-section">
            {renderSection('skills')}
          </div>
        </div>

        <div className="creative-main">
          {renderSection('experience')}
          {renderSection('education')}
          {renderSection('projects')}
        </div>
      </div>
    </div>
  );
}

export default CreativeColorSplashPreview;
