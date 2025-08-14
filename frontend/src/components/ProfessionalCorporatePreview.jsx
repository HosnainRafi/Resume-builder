import React from 'react';
import './ProfessionalCorporatePreview.css';

function ProfessionalCorporatePreview({ resumeData }) {
  const { header = {}, experience = [], education = [] } = resumeData || {};
  return (
    <div className="corp-page">
      <header className="corp-header">
        <h1 className="corp-name">{header.name || 'Your Name'}</h1>
        <p className="corp-contact-info">
          {header.address || '123 Main Street, Anytown, USA'} |{' '}
          {header.phone || '(123) 456-7890'} |{' '}
          {header.email || 'email@domain.com'}
        </p>
      </header>
      <section className="corp-section">
        <h2 className="corp-section-title">Objective</h2>
        <p className="corp-body-text">
          {header.summary ||
            'A highly motivated professional seeking to leverage extensive experience in [Your Field] to fill the [Job Title] role.'}
        </p>
      </section>
      <section className="corp-section">
        <h2 className="corp-section-title">Experience</h2>
        {(Array.isArray(experience) ? experience : [{}]).map((exp, i) => (
          <div key={i} className="corp-item">
            <div className="corp-item-header">
              <h3 className="corp-item-title">
                {exp.jobTitle || 'Job Title'}, {exp.company || 'Company Name'}
              </h3>
              <p className="corp-item-date">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            <ul className="corp-description-list">
              {(exp.description || '• Key achievement 1.\n• Key achievement 2.')
                .split('\n')
                .map((item, j) => (
                  <li key={j}>{item.replace('• ', '')}</li>
                ))}
            </ul>
          </div>
        ))}
      </section>
      <section className="corp-section">
        <h2 className="corp-section-title">Education</h2>
        {(Array.isArray(education) ? education : [{}]).map((edu, i) => (
          <div key={i} className="corp-item">
            <h3 className="corp-item-title">
              {edu.degree}, {edu.institution}
            </h3>
            <p className="corp-item-date">{edu.graduationDate}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
export default ProfessionalCorporatePreview;
