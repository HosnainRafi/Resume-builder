// src/components/InfographicVisualPreview.jsx

import React from 'react';
import './InfographicVisualPreview.css';

const ProficiencyDots = ({ level = 3 }) => (
  <div className="info-dots">
    {Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        className={`info-dot ${index < level ? 'filled' : ''}`}
      />
    ))}
  </div>
);

function InfographicVisualPreview({ resumeData }) {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  // Get job title from first experience entry
  const getJobTitle = () => {
    if (experience && experience.length > 0 && experience[0].jobTitle) {
      return experience.jobTitle;
    }
    return ''; // Fallback title
  };

  return (
    <div className="info-page">
      {/* Left Column - Teal Sidebar */}
      <div className="info-left-col">
        {/* Photo Placeholder */}
        <div className="info-photo-placeholder"></div>

        {/* Name and Title */}
        <h1 className="info-name">{header.name || ''}</h1>
        <h2 className="info-title">
          {getJobTitle()} {/* Changed from header.title to getJobTitle() */}
        </h2>

        {/* Contact Section */}
        <div className="info-left-section">
          <h3 className="info-left-title">Contact</h3>
          {header.email && <div>{header.email}</div>}
          {header.phone && <div>{header.phone}</div>}
          {header.website && <div>{header.website}</div>}
          {header.location && <div>{header.location}</div>}
        </div>

        {/* Skills Section with Proficiency Dots */}
        {skills && skills.length > 0 && (
          <div className="info-left-section">
            <h3 className="info-left-title">Skills</h3>
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="info-skill-name">{skill}</div>
                <ProficiencyDots level={Math.floor(Math.random() * 3) + 3} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Main Content */}
      <div className="info-right-col">
        {/* Profile/Summary Section */}
        {summary && (
          <div>
            <h2 className="info-right-title">Profile</h2>
            <p className="info-item-description">{summary}</p>
          </div>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <div>
            <h2 className="info-right-title">Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="info-item">
                <div className="info-item-date">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </div>
                <h3 className="info-item-title">
                  {exp.jobTitle || 'Job Title'}
                </h3>
                <div className="info-item-company">
                  {exp.company || 'Company Name'}
                </div>
                <p className="info-item-description">
                  {exp.description ||
                    'Description of responsibilities and achievements.'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <div>
            <h2 className="info-right-title">Projects</h2>
            {projects.map((proj, index) => (
              <div key={index} className="info-item">
                <h3 className="info-item-title">
                  {proj.name || 'Project Name'}
                </h3>
                <div className="info-item-company">
                  Technologies: {proj.technologies || 'React, Node.js'}
                </div>
                <p className="info-item-description">
                  {proj.description ||
                    'Project description and key achievements.'}
                </p>
                {proj.link && (
                  <p className="info-item-description">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#008080',
                        textDecoration: 'none',
                        fontWeight: '500',
                      }}
                    >
                      View Project →
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <div>
            <h2 className="info-right-title">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="info-item">
                <div className="info-item-date">
                  {edu.graduationDate || 'Year'}
                </div>
                <h3 className="info-item-title">{edu.degree || 'Degree'}</h3>
                <div className="info-item-company">
                  {edu.institution || 'University'} |{' '}
                  {edu.location || 'Location'}
                </div>
                {edu.gpa && (
                  <p className="info-item-description">GPA: {edu.gpa}</p>
                )}
                {edu.coursework && (
                  <p className="info-item-description">
                    <strong>Relevant Coursework:</strong> {edu.coursework}
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

export default InfographicVisualPreview;
