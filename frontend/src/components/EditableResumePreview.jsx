// src/components/EditableResumePreview.jsx

import React, { useState, useCallback } from 'react';
import './EditableResumePreview.css';

const EditableResumePreview = ({ resumeData, templateId, onFieldChange }) => {
  const [editingField, setEditingField] = useState(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

  const handleStartEdit = (field, event) => {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    setToolbarPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 60,
    });
    setEditingField(field);
    setShowToolbar(true);

    // Focus the element
    setTimeout(() => {
      event.target.focus();
    }, 0);
  };

  const handleStopEdit = useCallback(() => {
    setEditingField(null);
    setShowToolbar(false);
  }, []);

  const handleContentChange = (field, content) => {
    // Parse the field path and update resume data
    const fieldParts = field.split('.');
    let updatedData = { ...resumeData };

    if (fieldParts.length === 2) {
      if (!updatedData[fieldParts[0]]) updatedData[fieldParts[0]] = {};
      updatedData[fieldParts[0]][fieldParts[1]] = content;
    } else if (fieldParts.length === 3) {
      const [section, index, subField] = fieldParts;
      if (updatedData[section] && updatedData[section][parseInt(index)]) {
        updatedData[section][parseInt(index)][subField] = content;
      }
    } else {
      updatedData[field] = content;
    }

    onFieldChange(field, updatedData);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const EditableField = ({
    field,
    content,
    className = '',
    placeholder = 'Click to edit',
    tag = 'div',
  }) => {
    const isEditing = editingField === field;
    const Tag = tag;

    return (
      <Tag
        className={`editable-field ${className} ${isEditing ? 'editing' : ''}`}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onDoubleClick={(e) => handleStartEdit(field, e)}
        onClick={(e) => handleStartEdit(field, e)}
        onBlur={(e) => {
          const content = e.target.innerHTML;
          handleContentChange(field, content);
          handleStopEdit();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && tag !== 'div') {
            e.preventDefault();
            e.target.blur();
          }
          if (e.key === 'Escape') {
            e.target.blur();
          }
        }}
        dangerouslySetInnerHTML={{
          __html: content || `<span class="placeholder">${placeholder}</span>`,
        }}
        data-placeholder={placeholder}
      />
    );
  };

  const renderEditableResume = () => {
    const {
      header = {},
      summary = '',
      experience = [],
      education = [],
      skills = [],
      projects = [],
    } = resumeData;

    return (
      <div className="editable-resume-container">
        {/* Header Section */}
        <div className="resume-header">
          <EditableField
            field="header.name"
            content={header.name}
            className="resume-name"
            placeholder="Your Full Name"
            tag="h1"
          />

          <div className="contact-info">
            <EditableField
              field="header.email"
              content={header.email}
              className="contact-item"
              placeholder="email@example.com"
            />
            <EditableField
              field="header.phone"
              content={header.phone}
              className="contact-item"
              placeholder="(123) 456-7890"
            />
            <EditableField
              field="header.location"
              content={header.location}
              className="contact-item"
              placeholder="City, State"
            />
            <EditableField
              field="header.website"
              content={header.website}
              className="contact-item"
              placeholder="website.com"
            />
          </div>
        </div>

        {/* Summary Section */}
        <div className="resume-section">
          <h2>Professional Summary</h2>
          <EditableField
            field="summary"
            content={summary}
            className="summary-content"
            placeholder="Write a compelling professional summary that highlights your key skills and experience..."
            tag="p"
          />
        </div>

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <div className="resume-section">
            <h2>Professional Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <EditableField
                  field={`experience.${index}.jobTitle`}
                  content={exp.jobTitle}
                  className="job-title"
                  placeholder="Job Title"
                  tag="h3"
                />
                <div className="job-meta">
                  <EditableField
                    field={`experience.${index}.company`}
                    content={exp.company}
                    className="company"
                    placeholder="Company Name"
                  />
                  <span className="date-range">
                    <EditableField
                      field={`experience.${index}.startDate`}
                      content={exp.startDate}
                      className="date"
                      placeholder="Start Date"
                    />
                    {' - '}
                    <EditableField
                      field={`experience.${index}.endDate`}
                      content={exp.endDate || 'Present'}
                      className="date"
                      placeholder="End Date"
                    />
                  </span>
                </div>
                <EditableField
                  field={`experience.${index}.description`}
                  content={exp.description}
                  className="job-description"
                  placeholder={`• Describe your key responsibilities and achievements
• Use bullet points for better readability
• Include specific metrics and results where possible`}
                  tag="div"
                />
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="resume-section">
            <h2>Skills</h2>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <EditableField
                  key={index}
                  field={`skills.${index}`}
                  content={skill}
                  className="skill-item"
                  placeholder="Skill"
                />
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="resume-section">
            <h2>Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <EditableField
                  field={`education.${index}.degree`}
                  content={edu.degree}
                  className="degree"
                  placeholder="Degree"
                  tag="h3"
                />
                <EditableField
                  field={`education.${index}.institution`}
                  content={edu.institution}
                  className="institution"
                  placeholder="Institution"
                />
                <EditableField
                  field={`education.${index}.graduationDate`}
                  content={edu.graduationDate}
                  className="graduation-date"
                  placeholder="Graduation Date"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="editable-resume-wrapper">
      {renderEditableResume()}

      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          className="floating-toolbar"
          style={{
            position: 'fixed',
            top: `${toolbarPosition.y}px`,
            left: `${toolbarPosition.x}px`,
            zIndex: 1000,
          }}
        >
          <div className="toolbar-buttons">
            <button
              onClick={() => execCommand('bold')}
              title="Bold"
              className="toolbar-btn"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => execCommand('italic')}
              title="Italic"
              className="toolbar-btn"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => execCommand('underline')}
              title="Underline"
              className="toolbar-btn"
            >
              <u>U</u>
            </button>
            <div className="toolbar-divider"></div>
            <button
              onClick={() => execCommand('insertUnorderedList')}
              title="Bullet List"
              className="toolbar-btn"
            >
              •
            </button>
            <button
              onClick={() => execCommand('insertOrderedList')}
              title="Numbered List"
              className="toolbar-btn"
            >
              1.
            </button>
            <div className="toolbar-divider"></div>
            <button
              onClick={handleStopEdit}
              className="toolbar-btn done-btn"
              title="Done"
            >
              ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableResumePreview;
