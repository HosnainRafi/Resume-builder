import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HexColorPicker } from 'react-colorful';
import Select from 'react-select';
import './ReziStyleEditor.css';

// Sortable Section Component
function SortableSection({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-section ${isDragging ? 'dragging' : ''}`}
      {...attributes}
    >
      <div className="drag-handle" {...listeners}>
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path
            d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
            fill="currentColor"
          />
        </svg>
      </div>
      {children}
    </div>
  );
}

const ReziStyleEditor = ({ resumeData, onResumeDataChange }) => {
  // Font options matching Rezi.ai
  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Nunito', label: 'Nunito' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
  ];

  // Style settings state
  const [styleSettings, setStyleSettings] = useState({
    fontFamily: resumeData?.styleSettings?.fontFamily || 'Inter',
    fontSize: resumeData?.styleSettings?.fontSize || 14,
    lineHeight: resumeData?.styleSettings?.lineHeight || 1.5,
    primaryColor: resumeData?.styleSettings?.primaryColor || '#1f2937',
    secondaryColor: resumeData?.styleSettings?.secondaryColor || '#6b7280',
    accentColor: resumeData?.styleSettings?.accentColor || '#3b82f6',
    headerColor: resumeData?.styleSettings?.headerColor || '#111827',
    borderRadius: resumeData?.styleSettings?.borderRadius || 4,
    sectionSpacing: resumeData?.styleSettings?.sectionSpacing || 24,
  });

  // Section ordering state
  const defaultSections = [
    'header',
    'experience',
    'education',
    'skills',
    'projects',
  ];
  const [sectionOrder, setSectionOrder] = useState(
    resumeData?.sectionOrder || defaultSections
  );

  // Color picker states
  const [showColorPicker, setShowColorPicker] = useState(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (active.id !== over.id) {
        setSectionOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          const newOrder = arrayMove(items, oldIndex, newIndex);

          // Update resume data
          onResumeDataChange({
            ...resumeData,
            sectionOrder: newOrder,
          });

          return newOrder;
        });
      }
    },
    [resumeData, onResumeDataChange]
  );

  // Handle style changes
  const handleStyleChange = useCallback(
    (property, value) => {
      const newStyleSettings = { ...styleSettings, [property]: value };
      setStyleSettings(newStyleSettings);

      onResumeDataChange({
        ...resumeData,
        styleSettings: newStyleSettings,
      });
    },
    [styleSettings, resumeData, onResumeDataChange]
  );

  // Render section content
  const renderSectionContent = (sectionType) => {
    const {
      header = {},
      experience = [],
      education = [],
      skills = [],
      projects = [],
    } = resumeData || {};

    const sectionStyles = {
      fontFamily: styleSettings.fontFamily,
      fontSize: `${styleSettings.fontSize}px`,
      lineHeight: styleSettings.lineHeight,
      color: styleSettings.primaryColor,
      marginBottom: `${styleSettings.sectionSpacing}px`,
    };

    const titleStyles = {
      fontFamily: styleSettings.fontFamily,
      fontSize: `${styleSettings.fontSize * 1.4}px`,
      fontWeight: '600',
      color: styleSettings.accentColor,
      marginBottom: `${styleSettings.sectionSpacing * 0.5}px`,
      borderBottom: `2px solid ${styleSettings.accentColor}`,
      paddingBottom: '8px',
      textTransform: 'uppercase',
    };

    switch (sectionType) {
      case 'header':
        return (
          <div style={sectionStyles} className="resume-header">
            <h1
              style={{
                fontFamily: styleSettings.fontFamily,
                fontSize: `${styleSettings.fontSize * 2.5}px`,
                fontWeight: 'bold',
                color: styleSettings.headerColor,
                margin: '0 0 16px 0',
                textAlign: 'center',
              }}
            >
              {header.name || 'Your Name'}
            </h1>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                marginBottom: '20px',
                fontSize: `${styleSettings.fontSize * 0.9}px`,
                color: styleSettings.secondaryColor,
                flexWrap: 'wrap',
              }}
            >
              {header.email && <span>{header.email}</span>}
              {header.phone && <span>{header.phone}</span>}
              {header.website && <span>{header.website}</span>}
              {header.location && <span>{header.location}</span>}
            </div>

            {header.summary && (
              <div
                style={{
                  fontStyle: 'italic',
                  textAlign: 'center',
                  color: styleSettings.primaryColor,
                  fontSize: `${styleSettings.fontSize}px`,
                  lineHeight: styleSettings.lineHeight,
                  maxWidth: '80%',
                  margin: '0 auto',
                }}
              >
                {header.summary}
              </div>
            )}
          </div>
        );

      case 'experience':
        return (
          <div style={sectionStyles}>
            <h2 style={titleStyles}>Work Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: `${styleSettings.fontSize * 1.1}px`,
                      fontWeight: '600',
                      color: styleSettings.primaryColor,
                      margin: 0,
                    }}
                  >
                    {exp.jobTitle || 'Job Title'}
                  </h3>
                  <span
                    style={{
                      fontSize: `${styleSettings.fontSize * 0.85}px`,
                      color: styleSettings.secondaryColor,
                      fontWeight: '500',
                    }}
                  >
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>

                <div
                  style={{
                    color: styleSettings.secondaryColor,
                    fontSize: `${styleSettings.fontSize * 0.95}px`,
                    marginBottom: '8px',
                    fontWeight: '500',
                  }}
                >
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>

                <div
                  style={{
                    color: styleSettings.primaryColor,
                    fontSize: `${styleSettings.fontSize}px`,
                    lineHeight: styleSettings.lineHeight,
                    whiteSpace: 'pre-line',
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
          <div style={sectionStyles}>
            <h2 style={titleStyles}>Education</h2>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: `${styleSettings.fontSize * 1.1}px`,
                      fontWeight: '600',
                      color: styleSettings.primaryColor,
                      margin: 0,
                    }}
                  >
                    {edu.degree || 'Degree'}
                  </h3>
                  <span
                    style={{
                      fontSize: `${styleSettings.fontSize * 0.85}px`,
                      color: styleSettings.secondaryColor,
                    }}
                  >
                    {edu.graduationDate}
                  </span>
                </div>

                <div
                  style={{
                    color: styleSettings.secondaryColor,
                    fontSize: `${styleSettings.fontSize * 0.95}px`,
                  }}
                >
                  {edu.institution} {edu.location && `• ${edu.location}`}
                </div>

                {edu.gpa && (
                  <div
                    style={{
                      color: styleSettings.secondaryColor,
                      fontSize: `${styleSettings.fontSize * 0.9}px`,
                      marginTop: '4px',
                    }}
                  >
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div style={sectionStyles}>
            <h2 style={titleStyles}>Skills</h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: `${styleSettings.accentColor}20`,
                    color: styleSettings.accentColor,
                    padding: '4px 12px',
                    borderRadius: `${styleSettings.borderRadius}px`,
                    fontSize: `${styleSettings.fontSize * 0.9}px`,
                    fontWeight: '500',
                    border: `1px solid ${styleSettings.accentColor}40`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div style={sectionStyles}>
            <h2 style={titleStyles}>Projects</h2>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <h3
                  style={{
                    fontSize: `${styleSettings.fontSize * 1.1}px`,
                    fontWeight: '600',
                    color: styleSettings.primaryColor,
                    margin: '0 0 4px 0',
                  }}
                >
                  {proj.name || 'Project Name'}
                </h3>

                {proj.technologies && (
                  <div
                    style={{
                      color: styleSettings.secondaryColor,
                      fontSize: `${styleSettings.fontSize * 0.9}px`,
                      marginBottom: '8px',
                      fontStyle: 'italic',
                    }}
                  >
                    Technologies: {proj.technologies}
                  </div>
                )}

                <div
                  style={{
                    color: styleSettings.primaryColor,
                    fontSize: `${styleSettings.fontSize}px`,
                    lineHeight: styleSettings.lineHeight,
                  }}
                >
                  {proj.description}
                </div>

                {proj.link && (
                  <a
                    href={proj.link}
                    style={{
                      color: styleSettings.accentColor,
                      fontSize: `${styleSettings.fontSize * 0.9}px`,
                      textDecoration: 'none',
                      fontWeight: '500',
                    }}
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rezi-style-editor">
      {/* Customization Panel */}
      <div className="customization-sidebar">
        <div className="customization-header">
          <h3>🎨 Customize Resume</h3>
          <p>Make it uniquely yours</p>
        </div>

        <div className="customization-sections">
          {/* Font Settings */}
          <div className="customization-section">
            <h4>Typography</h4>

            <div className="control-group">
              <label>Font Family</label>
              <Select
                value={fontOptions.find(
                  (option) => option.value === styleSettings.fontFamily
                )}
                onChange={(option) =>
                  handleStyleChange('fontFamily', option.value)
                }
                options={fontOptions}
                className="font-select"
                isSearchable={false}
              />
            </div>

            <div className="control-group">
              <label>Font Size: {styleSettings.fontSize}px</label>
              <input
                type="range"
                min="10"
                max="20"
                value={styleSettings.fontSize}
                onChange={(e) =>
                  handleStyleChange('fontSize', parseInt(e.target.value))
                }
                className="range-slider"
              />
            </div>

            <div className="control-group">
              <label>Line Height: {styleSettings.lineHeight}</label>
              <input
                type="range"
                min="1.2"
                max="2.0"
                step="0.1"
                value={styleSettings.lineHeight}
                onChange={(e) =>
                  handleStyleChange('lineHeight', parseFloat(e.target.value))
                }
                className="range-slider"
              />
            </div>
          </div>

          {/* Color Settings */}
          <div className="customization-section">
            <h4>Colors</h4>

            {[
              { key: 'headerColor', label: 'Name Color' },
              { key: 'primaryColor', label: 'Primary Text' },
              { key: 'secondaryColor', label: 'Secondary Text' },
              { key: 'accentColor', label: 'Accent Color' },
            ].map(({ key, label }) => (
              <div key={key} className="control-group">
                <label>{label}</label>
                <div className="color-input-wrapper">
                  <div
                    className="color-preview"
                    style={{ backgroundColor: styleSettings[key] }}
                    onClick={() =>
                      setShowColorPicker(showColorPicker === key ? null : key)
                    }
                  />
                  <input
                    type="text"
                    value={styleSettings[key]}
                    onChange={(e) => handleStyleChange(key, e.target.value)}
                    className="color-input"
                  />
                </div>

                {showColorPicker === key && (
                  <div className="color-picker-popup">
                    <div
                      className="color-picker-overlay"
                      onClick={() => setShowColorPicker(null)}
                    />
                    <div className="color-picker-container">
                      <HexColorPicker
                        color={styleSettings[key]}
                        onChange={(color) => handleStyleChange(key, color)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Layout Settings */}
          <div className="customization-section">
            <h4>Layout</h4>

            <div className="control-group">
              <label>Border Radius: {styleSettings.borderRadius}px</label>
              <input
                type="range"
                min="0"
                max="12"
                value={styleSettings.borderRadius}
                onChange={(e) =>
                  handleStyleChange('borderRadius', parseInt(e.target.value))
                }
                className="range-slider"
              />
            </div>

            <div className="control-group">
              <label>Section Spacing: {styleSettings.sectionSpacing}px</label>
              <input
                type="range"
                min="16"
                max="40"
                value={styleSettings.sectionSpacing}
                onChange={(e) =>
                  handleStyleChange('sectionSpacing', parseInt(e.target.value))
                }
                className="range-slider"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            className="reset-button"
            onClick={() => {
              const defaultSettings = {
                fontFamily: 'Inter',
                fontSize: 14,
                lineHeight: 1.5,
                primaryColor: '#1f2937',
                secondaryColor: '#6b7280',
                accentColor: '#3b82f6',
                headerColor: '#111827',
                borderRadius: 4,
                sectionSpacing: 24,
              };
              setStyleSettings(defaultSettings);
              handleStyleChange('fontFamily', 'Inter');
            }}
          >
            🔄 Reset to Default
          </button>
        </div>
      </div>

      {/* Resume Preview with Drag & Drop */}
      <div className="resume-preview-area">
        <div className="preview-header">
          <h3>📄 Live Preview</h3>
          <p>Drag sections to reorder • Changes save automatically</p>
        </div>

        <div
          className="resume-document"
          style={{ fontFamily: styleSettings.fontFamily }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              {sectionOrder.map((sectionId) => (
                <SortableSection key={sectionId} id={sectionId}>
                  {renderSectionContent(sectionId)}
                </SortableSection>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default ReziStyleEditor;
