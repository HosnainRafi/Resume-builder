import React from 'react';
import './CreativeColorSplashPreview.css';
function CreativeColorSplashPreview({ resumeData }) {
  const { header = {}, experience = [], skills = [] } = resumeData || {};
  return (
    <div className="creative-page">
      <header className="creative-header">
        <div className="creative-header-text">
          <h1 className="creative-name">{header.name || 'Your Name'}</h1>
          <p className="creative-title">
            {header.title || 'Marketing Manager'}
          </p>
        </div>
        <div className="creative-photo-placeholder"></div>
      </header>
      <div className="creative-body">
        <div className="creative-sidebar">
          <section className="creative-sidebar-section">
            <h2 className="creative-sidebar-title">About Me</h2>
            <p>
              {header.summary ||
                'A brief summary about your professional self.'}
            </p>
          </section>
          <section className="creative-sidebar-section">
            <h2 className="creative-sidebar-title">Contact</h2>
            <p>{header.email || 'email@example.com'}</p>
            <p>{header.phone || '(123) 456-7890'}</p>
            <p>{header.website || 'portfolio.com'}</p>
          </section>
          <section className="creative-sidebar-section">
            <h2 className="creative-sidebar-title">Expertise</h2>
            <div className="creative-tags">
              {(Array.isArray(skills) ? skills : ['Digital Marketing']).map(
                (skill, i) => (
                  <span key={i} className="creative-tag">
                    {skill}
                  </span>
                )
              )}
            </div>
          </section>
        </div>
        <div className="creative-main">
          <section className="creative-main-section">
            <h2 className="creative-main-title">Experience</h2>
            {(Array.isArray(experience) ? experience : [{}]).map((exp, i) => (
              <div key={i} className="creative-item">
                <p className="creative-item-date">
                  {exp.startDate} - {exp.endDate}
                </p>
                <h3 className="creative-item-title">
                  {exp.jobTitle || 'Job Title'}
                </h3>
                <p className="creative-item-company">
                  {exp.company || 'Company'}
                </p>
                <p>
                  {exp.description || 'Description of work and achievements.'}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
export default CreativeColorSplashPreview;
