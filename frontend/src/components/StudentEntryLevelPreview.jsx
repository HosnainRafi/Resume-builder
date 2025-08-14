import React from 'react';
import './StudentEntryLevelPreview.css';

function StudentEntryLevelPreview({ resumeData }) {
  const {
    header = {},
    education = [],
    skills = [],
    projects = [],
    experience = [],
  } = resumeData || {};
  return (
    <div className="student-page">
      <header className="student-header">
        <h1 className="student-name">{header.name || 'Your Name'}</h1>
        <p className="student-contact">
          {header.email} | {header.phone} | {header.website}
        </p>
      </header>

      <div className="student-columns">
        <div className="student-main-col">
          <section className="student-section">
            <h2 className="student-section-title">Education</h2>
            {(Array.isArray(education) ? education : [{}]).map((edu, i) => (
              <div key={i} className="student-item">
                <div className="student-item-header">
                  <h3 className="student-item-title">
                    {edu.institution || 'University Name'}
                  </h3>
                  <p className="student-item-date">
                    {edu.graduationDate || 'Expected May 2026'}
                  </p>
                </div>
                <p className="student-item-subheader">
                  {edu.degree || 'Bachelor of Science in Computer Science'}
                </p>
                <p className="student-coursework">
                  <strong>Relevant Coursework:</strong>{' '}
                  {edu.coursework ||
                    'Data Structures, Algorithms, Web Development'}
                </p>
              </div>
            ))}
          </section>

          <section className="student-section">
            <h2 className="student-section-title">Projects</h2>
            {(Array.isArray(projects) ? projects : [{}]).map((proj, i) => (
              <div key={i} className="student-item">
                <h3 className="student-item-title">
                  {proj.name || 'Project Title'}
                </h3>
                <p className="student-item-description">
                  {proj.description || 'Project description goes here.'}
                </p>
              </div>
            ))}
          </section>
        </div>
        <div className="student-side-col">
          <section className="student-section">
            <h2 className="student-section-title">Skills</h2>
            <p className="student-skills-list">
              {(Array.isArray(skills) ? skills : []).join(', ')}
            </p>
          </section>

          <section className="student-section">
            <h2 className="student-section-title">Experience</h2>
            {(Array.isArray(experience) ? experience : []).map((exp, i) => (
              <div key={i} className="student-item">
                <h3 className="student-item-title">
                  {exp.jobTitle || 'Intern'}
                </h3>
                <p className="student-item-subheader">
                  {exp.company || 'Company Inc.'} | {exp.startDate} -{' '}
                  {exp.endDate}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

export default StudentEntryLevelPreview;
