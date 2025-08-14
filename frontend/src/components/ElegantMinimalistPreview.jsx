import React from 'react';
import './ElegantMinimalistPreview.css';
function ElegantMinimalistPreview({ resumeData }) {
  const {
    header = {},
    experience = [],
    education = [],
    skills = [],
  } = resumeData || {};
  return (
    <div className="elegant-minimalist-page">
      <header className="elegant-header">
        <h1 className="elegant-name">{header.name || 'Your Name'}</h1>
        <p className="elegant-contact">{`${header.email || 'email@example.com'} | ${header.phone || '(123) 456-7890'} | ${header.website || 'portfolio.com'}`}</p>
      </header>
      <section className="elegant-section">
        <h2 className="elegant-section-title">Professional Summary</h2>
        <p className="elegant-summary">
          {header.summary ||
            'A brief, powerful summary of your career, skills, and goals.'}
        </p>
      </section>
      <section className="elegant-section">
        <h2 className="elegant-section-title">Experience</h2>
        {(Array.isArray(experience) ? experience : [{}]).map((exp, i) => (
          <div key={i} className="elegant-item">
            <div className="elegant-item-header">
              <h3 className="elegant-item-title">
                {exp.jobTitle || 'Job Title'} at {exp.company || 'Company'}
              </h3>
              <p className="elegant-item-date">
                {exp.location || 'Location'} | {exp.startDate || 'Date'} -{' '}
                {exp.endDate || 'Present'}
              </p>
            </div>
            <p className="elegant-item-description">
              {exp.description ||
                'Description of responsibilities and key achievements.'}
            </p>
          </div>
        ))}
      </section>
      <section className="elegant-section">
        <h2 className="elegant-section-title">Education</h2>
        {(Array.isArray(education) ? education : [{}]).map((edu, i) => (
          <div key={i} className="elegant-item">
            <h3 className="elegant-item-title">{edu.degree || 'Degree'}</h3>
            <p className="elegant-item-subheader">
              {edu.institution || 'University'}, {edu.graduationDate || 'Year'}
            </p>
          </div>
        ))}
      </section>
      <section className="elegant-section">
        <h2 className="elegant-section-title">Core Competencies</h2>
        <p className="elegant-skills">
          {(Array.isArray(skills) ? skills : []).join(' · ')}
        </p>
      </section>
    </div>
  );
}
export default ElegantMinimalistPreview;
