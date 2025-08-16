// src/components/ClassicTemplatePreview.jsx

import React from 'react';
import './ClassicTemplatePreview.css';

function ClassicTemplatePreview({ resumeData }) {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  return (
    <div className="classic-template-preview-page">
      {/* Sidebar */}
      <div className="classic-sidebar">
        <h1 className="classic-name">{header.name || 'Your Name'}</h1>

        {/* Contact Section */}
        <div className="classic-sidebar-section">
          <h3 className="classic-sidebar-title">Contact</h3>
          {header.email && (
            <div className="classic-contact-item">{header.email}</div>
          )}
          {header.phone && (
            <div className="classic-contact-item">{header.phone}</div>
          )}
          {header.website && (
            <div className="classic-contact-item">{header.website}</div>
          )}
          {header.location && (
            <div className="classic-contact-item">{header.location}</div>
          )}
        </div>

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="classic-sidebar-section">
            <h3 className="classic-sidebar-title">Skills</h3>
            <ul className="classic-skills-list">
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="classic-main-content">
        {/* Professional Summary */}
        {summary && (
          <div className="classic-section">
            <h2 className="classic-section-title">Professional Summary</h2>
            <p className="classic-item-description">{summary}</p>
          </div>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <div className="classic-section">
            <h2 className="classic-section-title">Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="classic-item">
                <div className="classic-item-header">
                  <h4 className="classic-item-title">
                    {exp.jobTitle || 'Job Title'}
                  </h4>
                  <span className="classic-item-date">
                    {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="classic-item-subheader">
                  {exp.company || 'Company'} | {exp.location || 'Location'}
                </div>
                <p className="classic-item-description">
                  {exp.description ||
                    'Describe your responsibilities and achievements.'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="classic-section">
            <h2 className="classic-section-title">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="classic-item">
                <div className="classic-item-header">
                  <h4 className="classic-item-title">
                    {edu.degree || 'Degree'}
                  </h4>
                  <span className="classic-item-date">
                    {edu.graduationDate || 'Year'}
                  </span>
                </div>
                <div className="classic-item-subheader">
                  {edu.institution || 'Institution'} |{' '}
                  {edu.location || 'Location'}
                </div>
                {edu.gpa && (
                  <p className="classic-item-description">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <div className="classic-section">
            <h2 className="classic-section-title">Projects</h2>
            {projects.map((proj, index) => (
              <div key={index} className="classic-item">
                <div className="classic-item-header">
                  <h4 className="classic-item-title">
                    {proj.name || 'Project Name'}
                  </h4>
                </div>
                <div className="classic-item-subheader">
                  Technologies: {proj.technologies || 'React, Node.js'}
                </div>
                <p className="classic-item-description">
                  {proj.description || 'Describe your project.'}
                </p>
                {proj.link && (
                  <p className="classic-item-description">
                    <a
                      href={proj.link}
                      className="classic-link"
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
}

export default ClassicTemplatePreview;
