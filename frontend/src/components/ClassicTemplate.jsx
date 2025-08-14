import React from 'react';
import './ClassicTemplatePreview.css';

const padArray = (arr, min) => {
  const copy = Array.isArray(arr) ? [...arr] : [];
  while (copy.length < min) copy.push({});
  return copy;
};

function ClassicTemplatePreview({ resumeData }) {
  const {
    header = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  return (
    <div className="classic-template-preview-page">
      <div className="classic-sidebar">
        <h1 className="classic-name">{header.name || 'Your Name'}</h1>
        <div className="classic-sidebar-section">
          <h2 className="classic-sidebar-title">Contact</h2>
          <p className="classic-contact-item">
            {header.email || 'your.email@example.com'}
          </p>
          <p className="classic-contact-item">
            {header.phone || '(123) 456-7890'}
          </p>
          <a href={header.website || '#'} className="classic-link">
            {header.website || 'your-website.com'}
          </a>
        </div>
        <div className="classic-sidebar-section">
          <h2 className="classic-sidebar-title">Skills</h2>
          <ul className="classic-skills-list">
            {padArray(skills, 3).map((skill, i) => (
              <li key={`skill-${i}`}>{skill || 'Sample Skill'}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="classic-main-content">
        <div className="classic-section">
          <h2 className="classic-section-title">Work Experience</h2>
          {padArray(experience, 1).map((exp, i) => (
            <div key={`exp-${i}`} className="classic-item">
              <div className="classic-item-header">
                <h3 className="classic-item-title">
                  {exp.jobTitle || 'Job Title'}
                </h3>
                <p className="classic-item-date">
                  {(exp.startDate || 'Start') +
                    (exp.endDate ? ` - ${exp.endDate}` : ' - Present')}
                </p>
              </div>
              <p className="classic-item-subheader">{`${exp.company || 'Company'} | ${exp.location || 'Location'}`}</p>
              <p className="classic-item-description">
                {exp.description ||
                  'Describe your responsibilities and achievements.'}
              </p>
            </div>
          ))}
        </div>
        <div className="classic-section">
          <h2 className="classic-section-title">Education</h2>
          {padArray(education, 1).map((edu, i) => (
            <div key={`edu-${i}`} className="classic-item">
              <div className="classic-item-header">
                <h3 className="classic-item-title">
                  {edu.degree || 'Degree or Certificate'}
                </h3>
                <p className="classic-item-date">
                  {edu.graduationDate || 'Year'}
                </p>
              </div>
              <p className="classic-item-subheader">{`${edu.institution || 'Institution'} | ${edu.location || 'Location'}`}</p>
            </div>
          ))}
        </div>
        <div className="classic-section">
          <h2 className="classic-section-title">Projects</h2>
          {padArray(projects, 1).map((proj, i) => (
            <div key={`proj-${i}`} className="classic-item">
              <h3 className="classic-item-title">
                {proj.name || 'Project Name'}
              </h3>
              <p className="classic-item-subheader">
                Technologies: {proj.technologies || 'React, Node.js'}
              </p>
              <p className="classic-item-description">
                {proj.description || 'Describe your project.'}
              </p>
              <a href={proj.link || '#'} className="classic-link">
                {proj.link ? 'View Project' : ''}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClassicTemplatePreview;
