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
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  return (
    <div className="modern-template-preview-page">
      <header className="modern-header">
        <h1 className="modern-name">{header.name || 'Your Name'}</h1>
        <p className="modern-contact">
          {header.email || 'your.email@example.com'}
          {header.phone ? ` | ${header.phone}` : ''}
          {header.website ? ` | ${header.website}` : ''}
        </p>
      </header>

      <section className="modern-section">
        <h2 className="modern-section-title">Work Experience</h2>
        {padArray(experience, 1).map((exp, i) => (
          <div key={`exp-${i}`} className="modern-item">
            <div className="modern-item-header">
              <h3 className="modern-item-title">
                {exp.jobTitle || 'Job Title'}
              </h3>
              <p className="modern-item-date">
                {(exp.startDate || 'Start') +
                  (exp.endDate ? ` - ${exp.endDate}` : ' - Present')}
              </p>
            </div>
            <div className="modern-item-subheader">
              <p>{exp.company || 'Company Name'}</p>
              <p className="modern-item-location">
                {exp.location || 'City, State'}
              </p>
            </div>
            <p className="modern-item-description">
              {exp.description ||
                'Describe your responsibilities and achievements.'}
            </p>
          </div>
        ))}
      </section>

      <section className="modern-section">
        <h2 className="modern-section-title">Education</h2>
        {padArray(education, 1).map((edu, i) => (
          <div key={`edu-${i}`} className="modern-item">
            <div className="modern-item-header">
              <h3 className="modern-item-title">
                {edu.institution || 'University Name'}
              </h3>
              <p className="modern-item-date">{edu.graduationDate || 'Year'}</p>
            </div>
            <div className="modern-item-subheader">
              <p>{edu.degree || 'Degree or Certificate'}</p>
              <p className="modern-item-location">
                {edu.location || 'City, State'}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="modern-section">
        <h2 className="modern-section-title">Skills</h2>
        <p className="modern-skills-text">
          {(Array.isArray(skills) ? skills : []).join(', ')}
        </p>
      </section>

      <section className="modern-section">
        <h2 className="modern-section-title">Projects</h2>
        {padArray(projects, 1).map((proj, i) => (
          <div key={`proj-${i}`} className="modern-item">
            <div className="modern-item-header">
              <h3 className="modern-item-title">
                {proj.name || 'Project Name'}
              </h3>
              <a href={proj.link || '#'} className="modern-project-link">
                {proj.link || 'project-link.com'}
              </a>
            </div>
            <p className="modern-item-description">
              <strong>Technologies:</strong>{' '}
              {proj.technologies || 'React, Node.js, MongoDB'}
            </p>
            <p className="modern-item-description">
              {proj.description ||
                'Describe the project, its purpose, and your role.'}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default ModernTemplatePreview;
