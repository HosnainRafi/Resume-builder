// src/components/ClassicTemplateEditablePreview.jsx

import React from 'react';
import StyleOnlyEditableField from './StyleOnlyEditableField';
import './ClassicTemplatePreview.css';

function ClassicTemplateEditablePreview({ resumeData, onFieldChange }) {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  const handleFieldUpdate = (field, newValue) => {
    // Parse field path and update the resume data
    const fieldParts = field.split('.');
    let updatedData = { ...resumeData };

    if (fieldParts.length === 2) {
      if (!updatedData[fieldParts[0]]) updatedData[fieldParts[0]] = {};
      updatedData[fieldParts][fieldParts[1]] = newValue;
    } else if (fieldParts.length === 3) {
      const [section, index, subField] = fieldParts;
      if (updatedData[section] && updatedData[section][parseInt(index)]) {
        updatedData[section][parseInt(index)][subField] = newValue;
      }
    } else {
      updatedData[field] = newValue;
    }

    onFieldChange(field, updatedData);
  };

  return (
    <div className="classic-template-preview-page adjustment-mode">
      {/* Add visual indicator for adjustment mode */}
      <div className="adjustment-mode-indicator">
        <span>🎨 Adjustment Mode - Format your text styling</span>
      </div>

      {/* Sidebar */}
      <div className="classic-sidebar">
        <StyleOnlyEditableField
          tag="h1"
          className="classic-name"
          allowFormatting={true}
          field="header.name"
          onUpdate={handleFieldUpdate}
        >
          {header.name || 'Your Name'}
        </StyleOnlyEditableField>

        {/* Contact Section */}
        <div className="classic-sidebar-section">
          <h3 className="classic-sidebar-title">Contact</h3>
          {header.email && (
            <StyleOnlyEditableField
              className="classic-contact-item"
              field="header.email"
              onUpdate={handleFieldUpdate}
            >
              {header.email}
            </StyleOnlyEditableField>
          )}
          {header.phone && (
            <StyleOnlyEditableField
              className="classic-contact-item"
              field="header.phone"
              onUpdate={handleFieldUpdate}
            >
              {header.phone}
            </StyleOnlyEditableField>
          )}
          {header.website && (
            <StyleOnlyEditableField
              className="classic-contact-item"
              field="header.website"
              onUpdate={handleFieldUpdate}
            >
              {header.website}
            </StyleOnlyEditableField>
          )}
          {header.location && (
            <StyleOnlyEditableField
              className="classic-contact-item"
              field="header.location"
              onUpdate={handleFieldUpdate}
            >
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
                <StyleOnlyEditableField
                  key={index}
                  tag="li"
                  field={`skills.${index}`}
                  onUpdate={handleFieldUpdate}
                >
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
              field="summary"
              onUpdate={handleFieldUpdate}
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
                    field={`experience.${index}.jobTitle`}
                    onUpdate={handleFieldUpdate}
                  >
                    {exp.jobTitle || 'Job Title'}
                  </StyleOnlyEditableField>
                  <span className="classic-item-date">
                    {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="classic-item-subheader">
                  <StyleOnlyEditableField
                    tag="span"
                    field={`experience.${index}.company`}
                    onUpdate={handleFieldUpdate}
                  >
                    {exp.company || 'Company'}
                  </StyleOnlyEditableField>
                  {' | '}
                  <StyleOnlyEditableField
                    tag="span"
                    field={`experience.${index}.location`}
                    onUpdate={handleFieldUpdate}
                  >
                    {exp.location || 'Location'}
                  </StyleOnlyEditableField>
                </div>
                <StyleOnlyEditableField
                  tag="p"
                  className="classic-item-description"
                  allowFormatting={true}
                  field={`experience.${index}.description`}
                  onUpdate={handleFieldUpdate}
                >
                  {exp.description ||
                    'Describe your responsibilities and achievements.'}
                </StyleOnlyEditableField>
              </div>
            ))}
          </div>
        )}

        {/* Education and Projects sections similar to above */}
      </div>
    </div>
  );
}

export default ClassicTemplateEditablePreview;
