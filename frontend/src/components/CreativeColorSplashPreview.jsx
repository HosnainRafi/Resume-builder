// src/components/CreativeColorSplashPreview.jsx

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
    summary = '',
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
              <h2 className="creative-title">
                {header.title || 'Professional Title'}
              </h2>
            </div>
            <div className="creative-photo-placeholder"></div>
          </div>
        );

      case 'body':
        return (
          <div className="creative-body">
            {/* Sidebar */}
            <div className="creative-sidebar">
              {/* About Me Section */}
              {summary && (
                <div className="creative-sidebar-section">
                  <h3 className="creative-sidebar-title">About Me</h3>
                  <p>{summary}</p>
                </div>
              )}

              {/* Contact Section */}
              <div className="creative-sidebar-section">
                <h3 className="creative-sidebar-title">Contact</h3>
                {header.email && <div>{header.email}</div>}
                {header.phone && <div>{header.phone}</div>}
                {header.website && <div>{header.website}</div>}
                {header.location && <div>{header.location}</div>}
              </div>

              {/* Skills Section */}
              {skills && skills.length > 0 && (
                <div className="creative-sidebar-section">
                  <h3 className="creative-sidebar-title">Expertise</h3>
                  <div className="creative-tags">
                    {skills.map((skill, index) => (
                      <span key={index} className="creative-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="creative-main">
              {/* Experience */}
              {experience && experience.length > 0 && (
                <div>
                  <h2 className="creative-main-title">Experience</h2>
                  {experience.map((exp, index) => (
                    <div key={index} className="creative-item">
                      <div className="creative-item-date">
                        {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                      </div>
                      <h3 className="creative-item-title">
                        {exp.jobTitle || 'Job Title'}
                      </h3>
                      <div className="creative-item-company">
                        {exp.company || 'Company Name'}
                      </div>
                      <p className="creative-item-description">
                        {exp.description ||
                          'Description of work and achievements.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <div>
                  <h2 className="creative-main-title">Education</h2>
                  {education.map((edu, index) => (
                    <div key={index} className="creative-item">
                      <div className="creative-item-date">
                        {edu.graduationDate || 'Year'}
                      </div>
                      <h3 className="creative-item-title">
                        {edu.degree || 'Degree'}
                      </h3>
                      <div className="creative-item-company">
                        {edu.institution || 'Institution'} |{' '}
                        {edu.location || 'Location'}
                      </div>
                      {edu.gpa && (
                        <p className="creative-item-description">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {projects && projects.length > 0 && (
                <div>
                  <h2 className="creative-main-title">Projects</h2>
                  {projects.map((proj, index) => (
                    <div key={index} className="creative-item">
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
                        <p className="creative-item-description">
                          <a
                            href={proj.link}
                            className="creative-link"
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
          </div>
        );

      default:
        return null;
    }
  };

  // If rendering only one section
  if (sectionOnly) {
    return renderSection(sectionOnly);
  }

  // Full page render
  return (
    <div className="creative-page">
      {renderSection('header')}
      {renderSection('body')}
    </div>
  );
}

export default CreativeColorSplashPreview;
