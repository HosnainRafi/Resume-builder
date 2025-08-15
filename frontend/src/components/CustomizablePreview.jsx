import React, { useState, useRef } from 'react';
import './CustomizablePreview.css';

const CustomizablePreview = ({
  resumeData,
  onResumeDataChange,
  selectedTemplate,
}) => {
  const [fontSettings, setFontSettings] = useState({
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.4,
    primaryColor: '#333333',
    secondaryColor: '#666666',
    accentColor: '#007bff',
    headerColor: '#000000',
  });

  // Default section order
  const defaultSectionOrder = [
    'header',
    'experience',
    'education',
    'skills',
    'projects',
  ];
  const [sectionOrder, setSectionOrder] = useState(
    resumeData?.sectionOrder || defaultSectionOrder
  );

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Custom drag and drop handlers
  const handleDragStart = (index) => {
    dragItem.current = index;
    setDraggedIndex(index);
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      const newOrder = [...sectionOrder];
      const draggedItem = newOrder[dragItem.current];

      // Remove dragged item and insert at new position
      newOrder.splice(dragItem.current, 1);
      newOrder.splice(dragOverItem.current, 0, draggedItem);

      setSectionOrder(newOrder);
      onResumeDataChange({ ...resumeData, sectionOrder: newOrder });
    }

    // Reset drag state
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle font setting changes
  const handleFontChange = (setting, value) => {
    const newFontSettings = { ...fontSettings, [setting]: value };
    setFontSettings(newFontSettings);
    onResumeDataChange({ ...resumeData, fontSettings: newFontSettings });
  };

  // Generate section content
  const renderSectionContent = (sectionType, index) => {
    const {
      header = {},
      experience = [],
      education = [],
      skills = [],
      projects = [],
    } = resumeData || {};
    const sectionStyle = {
      fontFamily: fontSettings.fontFamily,
      fontSize: `${fontSettings.fontSize}px`,
      lineHeight: fontSettings.lineHeight,
      color: fontSettings.primaryColor,
    };

    switch (sectionType) {
      case 'header':
        return (
          <div className="resume-section header-section" style={sectionStyle}>
            <h1
              style={{
                fontFamily: fontSettings.fontFamily,
                color: fontSettings.headerColor,
                fontSize: `${fontSettings.fontSize * 2.2}px`,
                marginBottom: '10px',
                fontWeight: 'bold',
              }}
            >
              {header.name || 'Your Name'}
            </h1>
            <div
              className="contact-info"
              style={{
                fontFamily: fontSettings.fontFamily,
                color: fontSettings.secondaryColor,
                fontSize: `${fontSettings.fontSize * 0.9}px`,
                marginBottom: '20px',
              }}
            >
              {header.email && (
                <span className="contact-item">{header.email}</span>
              )}
              {header.phone && (
                <span className="contact-item">{header.phone}</span>
              )}
              {header.website && (
                <span className="contact-item">{header.website}</span>
              )}
            </div>
            {header.summary && (
              <div
                className="summary"
                style={{
                  fontStyle: 'italic',
                  color: fontSettings.primaryColor,
                  marginTop: '15px',
                  textAlign: 'center',
                  fontSize: `${fontSettings.fontSize}px`,
                }}
              >
                {header.summary}
              </div>
            )}
          </div>
        );

      case 'experience':
        return (
          <div className="resume-section" style={sectionStyle}>
            <h2
              className="section-title"
              style={{
                fontFamily: fontSettings.fontFamily,
                color: fontSettings.accentColor,
                fontSize: `${fontSettings.fontSize * 1.4}px`,
                borderBottom: `2px solid ${fontSettings.accentColor}`,
                paddingBottom: '5px',
                marginBottom: '15px',
                fontWeight: 'bold',
              }}
            >
              WORK EXPERIENCE
            </h2>
            {experience.map((exp, i) => (
              <div
                key={i}
                className="experience-item"
                style={{ marginBottom: '20px' }}
              >
                <div
                  className="item-header"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '5px',
                  }}
                >
                  <h3
                    style={{
                      color: fontSettings.primaryColor,
                      fontSize: `${fontSettings.fontSize * 1.1}px`,
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {exp.jobTitle || 'Job Title'}
                  </h3>
                  <span
                    style={{
                      color: fontSettings.secondaryColor,
                      fontSize: `${fontSettings.fontSize * 0.9}px`,
                      fontStyle: 'italic',
                    }}
                  >
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <p
                  style={{
                    color: fontSettings.secondaryColor,
                    fontSize: `${fontSettings.fontSize * 0.95}px`,
                    margin: '2px 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  {exp.company} {exp.location && `| ${exp.location}`}
                </p>
                <div
                  style={{
                    color: fontSettings.primaryColor,
                    fontSize: `${fontSettings.fontSize}px`,
                    lineHeight: fontSettings.lineHeight,
                  }}
                >
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="resume-section" style={sectionStyle}>
            <h2
              className="section-title"
              style={{
                fontFamily: fontSettings.fontFamily,
                color: fontSettings.accentColor,
                fontSize: `${fontSettings.fontSize * 1.4}px`,
                borderBottom: `2px solid ${fontSettings.accentColor}`,
                paddingBottom: '5px',
                marginBottom: '15px',
                fontWeight: 'bold',
              }}
            >
              EDUCATION
            </h2>
            {education.map((edu, i) => (
              <div
                key={i}
                className="education-item"
                style={{ marginBottom: '15px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <h3
                    style={{
                      color: fontSettings.primaryColor,
                      fontSize: `${fontSettings.fontSize * 1.1}px`,
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {edu.degree || 'Degree'}
                  </h3>
                  <span
                    style={{
                      color: fontSettings.secondaryColor,
                      fontSize: `${fontSettings.fontSize * 0.9}px`,
                      fontStyle: 'italic',
                    }}
                  >
                    {edu.graduationDate}
                  </span>
                </div>
                <p
                  style={{
                    color: fontSettings.secondaryColor,
                    fontSize: `${fontSettings.fontSize * 0.95}px`,
                    margin: '2px 0 0 0',
                  }}
                >
                  {edu.institution} {edu.location && `| ${edu.location}`}
                </p>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div className="resume-section" style={sectionStyle}>
            <h2
              className="section-title"
              style={{
                fontFamily: fontSettings.fontFamily,
                color: fontSettings.accentColor,
                fontSize: `${fontSettings.fontSize * 1.4}px`,
                borderBottom: `2px solid ${fontSettings.accentColor}`,
                paddingBottom: '5px',
                marginBottom: '15px',
                fontWeight: 'bold',
              }}
            >
              SKILLS
            </h2>
            <div
              className="skills-list"
              style={{
                color: fontSettings.primaryColor,
                fontSize: `${fontSettings.fontSize}px`,
                lineHeight: fontSettings.lineHeight,
              }}
            >
              {skills.length > 0 ? skills.join(' • ') : 'Add your skills'}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="resume-section" style={sectionStyle}>
            <h2
              className="section-title"
              style={{
                fontFamily: fontSettings.fontFamily,
                color: fontSettings.accentColor,
                fontSize: `${fontSettings.fontSize * 1.4}px`,
                borderBottom: `2px solid ${fontSettings.accentColor}`,
                paddingBottom: '5px',
                marginBottom: '15px',
                fontWeight: 'bold',
              }}
            >
              PROJECTS
            </h2>
            {projects.map((proj, i) => (
              <div
                key={i}
                className="project-item"
                style={{ marginBottom: '15px' }}
              >
                <h3
                  style={{
                    color: fontSettings.primaryColor,
                    fontSize: `${fontSettings.fontSize * 1.1}px`,
                    fontWeight: 'bold',
                    margin: '0 0 3px 0',
                  }}
                >
                  {proj.name || 'Project Name'}
                </h3>
                {proj.technologies && (
                  <p
                    style={{
                      color: fontSettings.secondaryColor,
                      fontSize: `${fontSettings.fontSize * 0.9}px`,
                      margin: '0 0 5px 0',
                      fontStyle: 'italic',
                    }}
                  >
                    Technologies: {proj.technologies}
                  </p>
                )}
                <div
                  style={{
                    color: fontSettings.primaryColor,
                    fontSize: `${fontSettings.fontSize}px`,
                    lineHeight: fontSettings.lineHeight,
                  }}
                >
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="customizable-preview-container">
      {/* Font Customization Panel */}
      <div className="customization-panel">
        <h3>🎨 Customize Appearance</h3>

        <div className="control-group">
          <label>Font Family:</label>
          <select
            value={fontSettings.fontFamily}
            onChange={(e) => handleFontChange('fontFamily', e.target.value)}
            className="font-control"
          >
            <option value="Helvetica">Helvetica</option>
            <option value="Arial">Arial</option>
            <option value="'Times New Roman'">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Calibri">Calibri</option>
            <option value="'Open Sans'">Open Sans</option>
            <option value="Roboto">Roboto</option>
            <option value="'Source Sans Pro'">Source Sans Pro</option>
          </select>
        </div>

        <div className="control-group">
          <label>Font Size: {fontSettings.fontSize}px</label>
          <input
            type="range"
            min="10"
            max="18"
            value={fontSettings.fontSize}
            onChange={(e) =>
              handleFontChange('fontSize', parseInt(e.target.value))
            }
            className="font-slider"
          />
        </div>

        <div className="control-group">
          <label>Line Height: {fontSettings.lineHeight}</label>
          <input
            type="range"
            min="1.2"
            max="2.0"
            step="0.1"
            value={fontSettings.lineHeight}
            onChange={(e) =>
              handleFontChange('lineHeight', parseFloat(e.target.value))
            }
            className="font-slider"
          />
        </div>

        <div className="control-group">
          <label>Primary Text:</label>
          <input
            type="color"
            value={fontSettings.primaryColor}
            onChange={(e) => handleFontChange('primaryColor', e.target.value)}
            className="color-input"
          />
        </div>

        <div className="control-group">
          <label>Secondary Text:</label>
          <input
            type="color"
            value={fontSettings.secondaryColor}
            onChange={(e) => handleFontChange('secondaryColor', e.target.value)}
            className="color-input"
          />
        </div>

        <div className="control-group">
          <label>Section Headers:</label>
          <input
            type="color"
            value={fontSettings.accentColor}
            onChange={(e) => handleFontChange('accentColor', e.target.value)}
            className="color-input"
          />
        </div>

        <div className="control-group">
          <label>Name Color:</label>
          <input
            type="color"
            value={fontSettings.headerColor}
            onChange={(e) => handleFontChange('headerColor', e.target.value)}
            className="color-input"
          />
        </div>

        <button
          className="reset-button"
          onClick={() => {
            const defaultSettings = {
              fontFamily: 'Helvetica',
              fontSize: 12,
              lineHeight: 1.4,
              primaryColor: '#333333',
              secondaryColor: '#666666',
              accentColor: '#007bff',
              headerColor: '#000000',
            };
            setFontSettings(defaultSettings);
            onResumeDataChange({
              ...resumeData,
              fontSettings: defaultSettings,
            });
          }}
        >
          🔄 Reset to Default
        </button>
      </div>

      {/* Draggable Resume Preview */}
      <div className="resume-preview-area">
        <div className="preview-header">
          <h3>📄 Live Preview</h3>
          <p>Drag sections to reorder</p>
        </div>

        <div className="resume-document">
          {sectionOrder.map((sectionType, index) => (
            <div
              key={sectionType}
              className={`draggable-section ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="drag-handle" title="Drag to reorder">
                ⋮⋮
              </div>
              {renderSectionContent(sectionType, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomizablePreview;
