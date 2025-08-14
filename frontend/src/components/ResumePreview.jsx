// frontend/src/components/ResumePreview.jsx

import React, { useContext } from 'react';
import { ResumeContext } from '../context/ResumeContext';
// Import your template CSS files here if you have them
// import './ModernTemplate.css';
// import './ClassicTemplate.css';

// Wrap your component in React.forwardRef
const ResumePreview = React.forwardRef((props, ref) => {
  const { resumeData } = useContext(ResumeContext);

  // The 'ref' is attached to the main div that you want to print
  return (
    <div
      ref={ref}
      className={`resume-preview ${resumeData.template || 'modern'}`} // Default to a template
    >
      <header>
        <h1>{resumeData.personalInfo.name || 'Your Name'}</h1>
        <p>
          {resumeData.personalInfo.email || 'your.email@example.com'} |{' '}
          {resumeData.personalInfo.phone || '123-456-7890'}
        </p>
      </header>

      <section>
        <h2>Experience</h2>
        {resumeData.experience.map((job, index) => (
          <div key={index}>
            <h3>{job.jobTitle || 'Job Title'}</h3>
            <p>
              {job.company || 'Company Name'} |{' '}
              {job.duration || '2020 - Present'}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index}>
            <h3>{edu.degree || 'Degree'}</h3>
            <p>
              {edu.school || 'University Name'} | {edu.year || '2020'}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
});

export default ResumePreview;
