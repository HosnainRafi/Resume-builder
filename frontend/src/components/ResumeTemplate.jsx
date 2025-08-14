import React from 'react';
import './ResumeTemplate.css'; // We will create this CSS file next

// Use a forwardRef to allow the parent component to get a ref to this DOM node
const ResumeTemplate = React.forwardRef(({ resumeData }, ref) => {
  if (!resumeData) {
    return null;
  }

  const { header, experience, education, skills, projects } = resumeData;

  return (
    <div ref={ref} className="resume-container">
      <header className="resume-header">
        <h1>{header.name}</h1>
        <p>
          {header.email}
          {header.phone && ` | ${header.phone}`}
          {header.website && ` | ${header.website}`}
        </p>
      </header>

      <section className="resume-section">
        <h2>Work Experience</h2>
        {experience.map((exp, index) => (
          <div key={index} className="resume-item">
            <div className="item-header">
              <h3>{exp.jobTitle}</h3>
              <span>
                {exp.startDate} - {exp.endDate}
              </span>
            </div>
            <div className="item-subheader">
              <h4>{exp.company}</h4>
              <span>{exp.location}</span>
            </div>
            <p className="item-description">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2>Education</h2>
        {education.map((edu, index) => (
          <div key={index} className="resume-item">
            <div className="item-header">
              <h3>{edu.institution}</h3>
              <span>{edu.graduationDate}</span>
            </div>
            <div className="item-subheader">
              <h4>{edu.degree}</h4>
              <span>{edu.location}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2>Skills</h2>
        <p>{skills.join(', ')}</p>
      </section>

      <section className="resume-section">
        <h2>Projects</h2>
        {projects.map((proj, index) => (
          <div key={index} className="resume-item">
            <div className="item-header">
              <h3>{proj.name}</h3>
              <a href={proj.link} target="_blank" rel="noopener noreferrer">
                {proj.link}
              </a>
            </div>
            <p className="item-description">
              <strong>Technologies:</strong> {proj.technologies}
            </p>
            <p className="item-description">{proj.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
});

export default ResumeTemplate;
