// src/components/TechModernPreview.jsx

import React from 'react';
import './TechModernPreview.css';

const SkillBar = ({ skill, level = '90%' }) => (
  <div className="tech-skill-item">
    <div className="tech-skill-name">{skill}</div>
    <div className="tech-skill-bar-container">
      <div className="tech-skill-bar" style={{ width: level }}></div>
    </div>
  </div>
);

function TechModernPreview({ resumeData }) {
  const {
    header = {},
    summary = '',
    experience = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  console.log('TechModernPreview rendering with data:', resumeData);

  return (
    <div className="tech-modern-page">
      {/* Dark Sidebar */}
      <div className="tech-sidebar">
        <h1 className="tech-name">{header.name || 'Your Name'}</h1>
        <h2 className="tech-title">{header.title || 'Software Engineer'}</h2>

        {/* Contact Section */}
        <div className="tech-sidebar-section">
          <h3 className="tech-sidebar-title">Contact</h3>
          {header.email && (
            <div className="tech-contact-item">{header.email}</div>
          )}
          {header.phone && (
            <div className="tech-contact-item">{header.phone}</div>
          )}
          {header.website && (
            <div className="tech-contact-item">
              <a
                href={header.website}
                className="tech-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {header.website}
              </a>
            </div>
          )}
          {header.location && (
            <div className="tech-contact-item">{header.location}</div>
          )}
        </div>

        {/* Skills Section with Progress Bars */}
        {skills && skills.length > 0 && (
          <div className="tech-sidebar-section">
            <h3 className="tech-sidebar-title">Skills</h3>
            {skills.map((skill, index) => (
              <SkillBar
                key={index}
                skill={skill}
                level={`${Math.floor(Math.random() * 30) + 70}%`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="tech-main-content">
        {/* Professional Summary */}
        {summary && (
          <div className="tech-section">
            <h2 className="tech-section-title">Professional Summary</h2>
            <p className="tech-item-description">{summary}</p>
          </div>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <div className="tech-section">
            <h2 className="tech-section-title">Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="tech-item">
                <h3 className="tech-item-title">
                  {exp.jobTitle || 'Job Title'}
                </h3>
                <div className="tech-item-subheader">
                  {exp.company || 'Tech Solutions Inc.'} |{' '}
                  {exp.startDate || 'Jan 2022'} - {exp.endDate || 'Present'}
                </div>
                <p className="tech-item-description">
                  {exp.description ||
                    '• Led development of a new user-facing dashboard using React and Redux.\n• Improved API response time by 40% through query optimization.'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <div className="tech-section">
            <h2 className="tech-section-title">Projects</h2>
            {projects.map((proj, index) => (
              <div key={index} className="tech-item">
                <h3 className="tech-item-title">
                  {proj.name || 'Project Name'}
                </h3>
                <div className="tech-tech-stack">
                  <strong>Technologies:</strong>{' '}
                  {proj.technologies || 'Gatsby, GraphQL, Netlify'}
                </div>
                <p className="tech-item-description">
                  {proj.description ||
                    'A serverless portfolio site showcasing my work, deployed via CI/CD pipeline.'}
                </p>
                {proj.link && (
                  <p className="tech-item-description">
                    <a
                      href={proj.link}
                      className="tech-link"
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

export default TechModernPreview;
