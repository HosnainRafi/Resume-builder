// src/components/ModernExecutivePreview.jsx

import React from 'react';
import './ModernExecutivePreview.css';

function ModernExecutivePreview({ resumeData }) {
  const {
    header = {},
    summary = '',
    experience = [],
    skills = [],
    education = [],
  } = resumeData || {};

  console.log('ModernExecutivePreview rendering with data:', resumeData);

  // Get job title from first experience entry or fallback to a default
  const getJobTitle = () => {
    if (experience && experience.length > 0 && experience[0].jobTitle) {
      return experience.jobTitle;
    }
    return ''; // Fallback title
  };

  return (
    <div className="exec-page">
      {/* Left Column - Dark Charcoal Sidebar */}
      <div className="exec-left-col">
        {/* Name and Title */}
        <h1 className="exec-name">{header.name || 'Your Name'}</h1>
        <h2 className="exec-title">
          {getJobTitle()} {/* Changed from header.title to getJobTitle() */}
        </h2>

        {/* Contact Section */}
        <div className="exec-left-section">
          <h3>Contact</h3>
          {header.phone && <div>{header.phone}</div>}
          {header.email && <div>{header.email}</div>}
          {header.website && <div>{header.website}</div>}
          {header.location && <div>{header.location}</div>}
        </div>

        {/* Expertise/Skills Section */}
        {skills && skills.length > 0 && (
          <div className="exec-left-section">
            <h3>Core Expertise</h3>
            <ul>
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Education Section (if applicable) */}
        {education && education.length > 0 && (
          <div className="exec-left-section">
            <h3>Education</h3>
            {education.map((edu, index) => (
              <div key={index}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                  {edu.degree}
                </div>
                <div style={{ fontSize: '10px', color: '#c5a572' }}>
                  {edu.institution}, {edu.graduationDate}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Main Content */}
      <div className="exec-right-col">
        {/* Executive Summary */}
        {summary && (
          <div className="exec-right-section">
            <h2 className="exec-right-title">Executive Summary</h2>
            <p
              style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#343a40',
                margin: 0,
              }}
            >
              {summary}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {experience && experience.length > 0 && (
          <div className="exec-right-section">
            <h2 className="exec-right-title">Professional Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h3 className="exec-item-title">{exp.jobTitle || ''}</h3>
                <div className="exec-item-subheader">
                  {exp.company || ''} | {exp.startDate} -{' '}
                  {exp.endDate || 'Present'}
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    lineHeight: '1.6',
                    color: '#343a40',
                    margin: '8px 0 0 0',
                  }}
                >
                  {exp.description ||
                    'Led strategic initiatives and drove organizational growth through innovative leadership and cross-functional collaboration.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModernExecutivePreview;
