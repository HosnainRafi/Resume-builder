import React from 'react';
import './ModernExecutivePreview.css';

function ModernExecutivePreview({ resumeData }) {
  const { header = {}, experience = [], skills = [] } = resumeData || {};
  return (
    <div className="exec-page">
      <div className="exec-left-col">
        <h1 className="exec-name">{header.name || 'Your Name'}</h1>
        <h2 className="exec-title">
          {header.title || 'Chief Operating Officer'}
        </h2>
        <section className="exec-left-section">
          <h3>Contact</h3>
          <p>{header.phone}</p>
          <p>{header.email}</p>
          <p>{header.website}</p>
        </section>
        <section className="exec-left-section">
          <h3>Expertise</h3>
          <ul>
            {(Array.isArray(skills) ? skills : []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      </div>
      <div className="exec-right-col">
        <section className="exec-right-section">
          <h2 className="exec-right-title">Executive Summary</h2>
          <p>{header.summary}</p>
        </section>
        <section className="exec-right-section">
          <h2 className="exec-right-title">Professional Experience</h2>
          {(Array.isArray(experience) ? experience : [{}]).map((exp, i) => (
            <div key={i} className="exec-item">
              <h3 className="exec-item-title">{exp.jobTitle}</h3>
              <p className="exec-item-subheader">
                {exp.company} | {exp.startDate} - {exp.endDate}
              </p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
        <section className="exec-right-section">
          <h2 className="exec-right-title">Education</h2>
          {/* Education items here */}
        </section>
      </div>
    </div>
  );
}

export default ModernExecutivePreview;
