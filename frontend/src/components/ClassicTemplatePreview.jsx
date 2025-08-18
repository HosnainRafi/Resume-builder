// src/components/ClassicTemplatePreview.jsx

import React from 'react';
import StyleOnlyEditableField from './StyleOnlyEditableField';
import './ClassicTemplatePreview.css';

function ClassicTemplatePreview({ resumeData }) {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  return (
    <div className="classic-template-preview-page">
      {/* Sidebar */}
      <div className="classic-sidebar">
        <StyleOnlyEditableField
          tag="h1"
          className="classic-name"
          allowFormatting={true}
        >
          {header.name || 'Your Name'}
        </StyleOnlyEditableField>

        {/* Contact Section */}
        <div className="classic-sidebar-section">
          <h3 className="classic-sidebar-title">Contact</h3>
          {header.email && (
            <StyleOnlyEditableField className="classic-contact-item">
              {header.email}
            </StyleOnlyEditableField>
          )}
          {header.phone && (
            <StyleOnlyEditableField className="classic-contact-item">
              {header.phone}
            </StyleOnlyEditableField>
          )}
          {header.website && (
            <StyleOnlyEditableField className="classic-contact-item">
              {header.website}
            </StyleOnlyEditableField>
          )}
          {header.location && (
            <StyleOnlyEditableField className="classic-contact-item">
              {header.location}
            </StyleOnlyEditableField>
          )}
        </div>

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="classic-sidebar-section">
            <h3 className="classic-sidebar-title">Skills</h3>
            <ul className="classic-skills-list">
              {skills.map((skill, index) => (
                <StyleOnlyEditableField key={index} tag="li">
                  {skill}
                </StyleOnlyEditableField>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="classic-main-content">
        {/* Professional Summary */}
        {summary && (
          <div className="classic-section">
            <h2 className="classic-section-title">Professional Summary</h2>
            <StyleOnlyEditableField
              tag="p"
              className="classic-item-description"
              allowFormatting={true}
            >
              {summary}
            </StyleOnlyEditableField>
          </div>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <div className="classic-section">
            <h2 className="classic-section-title">Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="classic-item">
                <div className="classic-item-header">
                  <StyleOnlyEditableField
                    tag="h4"
                    className="classic-item-title"
                  >
                    {exp.jobTitle || 'Job Title'}
                  </StyleOnlyEditableField>
                  <span className="classic-item-date">
                    {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="classic-item-subheader">
                  <StyleOnlyEditableField tag="span">
                    {exp.company || 'Company'}
                  </StyleOnlyEditableField>
                  {' | '}
                  <StyleOnlyEditableField tag="span">
                    {exp.location || 'Location'}
                  </StyleOnlyEditableField>
                </div>
                <StyleOnlyEditableField
                  tag="p"
                  className="classic-item-description"
                  allowFormatting={true}
                >
                  {exp.description ||
                    'Describe your responsibilities and achievements.'}
                </StyleOnlyEditableField>
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="classic-section">
            <h2 className="classic-section-title">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="classic-item">
                <div className="classic-item-header">
                  <StyleOnlyEditableField
                    tag="h4"
                    className="classic-item-title"
                  >
                    {edu.degree || 'Degree'}
                  </StyleOnlyEditableField>
                  <span className="classic-item-date">
                    {edu.graduationDate || 'Year'}
                  </span>
                </div>
                <div className="classic-item-subheader">
                  <StyleOnlyEditableField tag="span">
                    {edu.institution || 'Institution'}
                  </StyleOnlyEditableField>
                  {' | '}
                  <StyleOnlyEditableField tag="span">
                    {edu.location || 'Location'}
                  </StyleOnlyEditableField>
                </div>
                {edu.gpa && (
                  <StyleOnlyEditableField
                    tag="p"
                    className="classic-item-description"
                  >
                    GPA: {edu.gpa}
                  </StyleOnlyEditableField>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <div className="classic-section">
            <h2 className="classic-section-title">Projects</h2>
            {projects.map((proj, index) => (
              <div key={index} className="classic-item">
                <div className="classic-item-header">
                  <StyleOnlyEditableField
                    tag="h4"
                    className="classic-item-title"
                  >
                    {proj.name || 'Project Name'}
                  </StyleOnlyEditableField>
                </div>
                <div className="classic-item-subheader">
                  Technologies:{' '}
                  <StyleOnlyEditableField tag="span">
                    {proj.technologies || 'React, Node.js'}
                  </StyleOnlyEditableField>
                </div>
                <StyleOnlyEditableField
                  tag="p"
                  className="classic-item-description"
                  allowFormatting={true}
                >
                  {proj.description || 'Describe your project.'}
                </StyleOnlyEditableField>
                {proj.link && (
                  <p className="classic-item-description">
                    <a
                      href={proj.link}
                      className="classic-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project →
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassicTemplatePreview;
