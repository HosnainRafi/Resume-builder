// src/components/ProfessionalCorporatePreview.jsx

import React from 'react';
import './ProfessionalCorporatePreview.css';

function ProfessionalCorporatePreview({ resumeData }) {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
  } = resumeData || {};

  return (
    <div className="corp-page">
      {/* Header Section */}
      <div className="corp-header">
        <h1 className="corp-name">{header.name || 'Your Name'}</h1>
        <p className="corp-contact-info">
          {[
            header.address || '123 Main Street, City',
            header.phone || '(123) 456-7890',
            header.email || 'email@domain.com',
          ]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Objective Section */}
      {summary && (
        <div className="corp-section">
          <h2 className="corp-section-title">Objective</h2>
          <p className="corp-body-text">
            {summary ||
              'A results-driven professional seeking a challenging role in the finance industry.'}
          </p>
        </div>
      )}

      {/* Professional Experience Section */}
      {experience && experience.length > 0 && (
        <div className="corp-section">
          <h2 className="corp-section-title">Professional Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="corp-item">
              <div className="corp-item-header">
                <h3 className="corp-item-title">
                  {exp.jobTitle || 'Financial Analyst'}
                </h3>
                <span className="corp-item-date">
                  {exp.startDate || 'Month, Year'} – {exp.endDate || 'Present'}
                </span>
              </div>
              <div className="corp-item-company">
                {exp.company || 'Global Finance Corp.'},{' '}
                {exp.location || 'New York, NY'}
              </div>
              <div className="corp-body-text">
                {exp.description ? (
                  <ul className="corp-description-list">
                    {exp.description.split('\n').map((point, i) => (
                      <li key={i}>{point.replace(/^•\s*/, '')}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="corp-description-list">
                    <li>
                      Analyzed financial data and created comprehensive reports
                    </li>
                    <li>
                      Collaborated with cross-functional teams to improve
                      processes
                    </li>
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="corp-section">
          <h2 className="corp-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="corp-item">
              <div className="corp-item-header">
                <h3 className="corp-item-title">
                  {edu.degree || 'Master of Business Administration (MBA)'}
                </h3>
                <span className="corp-item-date">
                  {edu.graduationDate || 'Year'}
                </span>
              </div>
              <div className="corp-item-company">
                {edu.institution || 'University of Business'},{' '}
                {edu.location || 'City, State'}
              </div>
              {edu.gpa && <div className="corp-body-text">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="corp-section">
          <h2 className="corp-section-title">Skills</h2>
          <p className="corp-body-text">
            {(Array.isArray(skills)
              ? skills
              : ['Financial Modeling', 'Data Analysis', 'Microsoft Excel']
            ).join(' | ')}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfessionalCorporatePreview;
