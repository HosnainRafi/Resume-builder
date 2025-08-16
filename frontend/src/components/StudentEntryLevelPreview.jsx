// src/components/StudentEntryLevelPreview.jsx

import React from 'react';
import './StudentEntryLevelPreview.css';

function StudentEntryLevelPreview({ resumeData }) {
  const {
    header = {},
    summary = '',
    education = [],
    skills = [],
    projects = [],
    experience = [],
  } = resumeData || {};

  return (
    <div className="student-page">
      {/* Header Section */}
      <div className="student-header">
        <h1 className="student-name">{header.name || 'Your Name'}</h1>
        <p className="student-contact">
          {[header.email, header.phone, header.website]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="student-columns">
        {/* Main Column */}
        <div className="student-main-col">
          {/* Summary/Objective */}
          {summary && (
            <div className="student-section">
              <h2 className="student-section-title">Objective</h2>
              <p className="student-item-description">{summary}</p>
            </div>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <div className="student-section">
              <h2 className="student-section-title">Education</h2>
              {education.map((edu, index) => (
                <div key={index} className="student-item">
                  <div className="student-item-header">
                    <h3 className="student-item-title">
                      {edu.institution || 'University Name'}
                    </h3>
                    <span className="student-item-date">
                      {edu.graduationDate || 'Expected May 2026'}
                    </span>
                  </div>
                  <div className="student-item-subheader">
                    {edu.degree || 'Bachelor of Science in Computer Science'}
                  </div>
                  {edu.gpa && (
                    <div className="student-item-subheader">GPA: {edu.gpa}</div>
                  )}
                  {edu.coursework && (
                    <div className="student-coursework">
                      <strong>Relevant Coursework:</strong> {edu.coursework}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <div className="student-section">
              <h2 className="student-section-title">Experience</h2>
              {experience.map((exp, index) => (
                <div key={index} className="student-item">
                  <div className="student-item-header">
                    <h3 className="student-item-title">
                      {exp.jobTitle || 'Job Title'}
                    </h3>
                    <span className="student-item-date">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="student-item-subheader">
                    {exp.company || 'Company Inc.'} |{' '}
                    {exp.location || 'City, State'}
                  </div>
                  <p className="student-item-description">
                    {exp.description ||
                      'Description of responsibilities and achievements.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Column */}
        <div className="student-side-col">
          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <div className="student-section">
              <h2 className="student-section-title">Projects</h2>
              {projects.map((proj, index) => (
                <div key={index} className="student-item">
                  <h3 className="student-item-title">
                    {proj.name || 'Project Name'}
                  </h3>
                  <div className="student-item-subheader">
                    Technologies: {proj.technologies || 'React, Node.js'}
                  </div>
                  <p className="student-item-description">
                    {proj.description || 'Project description goes here.'}
                  </p>
                  {proj.link && (
                    <p className="student-item-description">
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#4caf50',
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

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="student-section">
              <h2 className="student-section-title">Skills</h2>
              <div className="student-skills-list">
                {(Array.isArray(skills) ? skills : []).join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentEntryLevelPreview;
