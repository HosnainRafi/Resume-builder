import React from 'react';
import './InfographicVisualPreview.css';

const ProficiencyDots = ({ level = 3 }) => (
  <div className="info-dots">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`info-dot ${i < level ? 'filled' : ''}`}></span>
    ))}
  </div>
);

function InfographicVisualPreview({ resumeData }) {
  const { header = {}, experience = [], skills = [] } = resumeData || {};
  return (
    <div className="info-page">
      <div className="info-left-col">
        <div className="info-photo-placeholder"></div>
        <h1 className="info-name">{header.name || 'Your Name'}</h1>
        <p className="info-title">{header.title || 'Product Manager'}</p>
        <section className="info-left-section">
          <h2 className="info-left-title">Contact</h2>
          <p>{header.email}</p>
          <p>{header.phone}</p>
        </section>
        <section className="info-left-section">
          <h2 className="info-left-title">Skills</h2>
          {(Array.isArray(skills) ? skills : []).map((s) => (
            <div key={s}>
              <p className="info-skill-name">{s}</p>
              <ProficiencyDots />
            </div>
          ))}
        </section>
      </div>
      <div className="info-right-col">
        <section className="info-right-section">
          <h2 className="info-right-title">Profile</h2>
          <p>{header.summary}</p>
        </section>
        <section className="info-right-section">
          <h2 className="info-right-title">Experience</h2>
          {(Array.isArray(experience) ? experience : [{}]).map((exp, i) => (
            <div key={i} className="info-item">
              <p className="info-item-date">
                {exp.startDate} - {exp.endDate}
              </p>
              <h3 className="info-item-title">{exp.jobTitle}</h3>
              <p className="info-item-company">{exp.company}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
export default InfographicVisualPreview;
