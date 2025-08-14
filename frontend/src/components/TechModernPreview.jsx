import React from 'react';
import './TechModernPreview.css';

const SkillBar = ({ skill, level = '90%' }) => (
  <div className="tech-skill-item">
    <p>{skill}</p>
    <div className="tech-skill-bar-container">
      <div className="tech-skill-bar" style={{ width: level }}></div>
    </div>
  </div>
);

function TechModernPreview({ resumeData }) {
  const {
    header = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  return (
    <div className="tech-modern-preview-page">
      <div className="tech-modern-sidebar">
        <h1 className="tech-modern-name">{header.name || 'Your Name'}</h1>
        <p className="tech-modern-title">
          {header.title || 'Software Engineer'}
        </p>
        <div className="tech-modern-sidebar-section">
          <h2 className="tech-modern-sidebar-title">Contact</h2>
          <p className="tech-modern-contact-item">
            {header.email || 'your.email@example.com'}
          </p>
          <p className="tech-modern-contact-item">
            {header.phone || '(123) 456-7890'}
          </p>
          <a href={header.website || '#'} className="tech-modern-link">
            {header.website || 'portfolio.com'}
          </a>
        </div>
        <div className="tech-modern-sidebar-section">
          <h2 className="tech-modern-sidebar-title">Skills</h2>
          {(Array.isArray(skills)
            ? skills
            : ['React', 'Node.js', 'TypeScript']
          ).map((skill, i) => (
            <SkillBar key={`skill-${i}`} skill={skill} />
          ))}
        </div>
      </div>
      <div className="tech-modern-main-content">
        <section className="tech-modern-section">
          <h2 className="tech-modern-section-title">Experience</h2>
          {(Array.isArray(experience) ? experience : [{}]).map((exp, i) => (
            <div key={`exp-${i}`} className="tech-modern-item">
              <h3 className="tech-modern-item-title">
                {exp.jobTitle || 'Senior Frontend Developer'}
              </h3>
              <p className="tech-modern-item-subheader">{`${exp.company || 'Tech Solutions Inc.'} | ${exp.startDate || 'Jan 2022'} - ${exp.endDate || 'Present'}`}</p>
              <p className="tech-modern-item-description">
                {exp.description ||
                  '• Led development of a new user-facing dashboard using React and Redux.\n• Improved API response time by 40% through query optimization.'}
              </p>
            </div>
          ))}
        </section>
        <section className="tech-modern-section">
          <h2 className="tech-modern-section-title">Projects</h2>
          {(Array.isArray(projects) ? projects : [{}]).map((proj, i) => (
            <div key={`proj-${i}`} className="tech-modern-item">
              <h3 className="tech-modern-item-title">
                {proj.name || 'Personal Portfolio Website'}
              </h3>
              <p className="tech-modern-item-subheader">
                {proj.technologies || 'Gatsby, GraphQL, Netlify'}
              </p>
              <p className="tech-modern-item-description">
                {proj.description ||
                  'A serverless portfolio site showcasing my work, deployed via CI/CD pipeline.'}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
export default TechModernPreview;
