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
import './ClassicTemplatePreview.css';

// Sortable Section Component for main content sections only
function SortableMainSection({ id, children }) {
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
      className={`sortable-main-section ${isDragging ? 'dragging' : ''}`}
      {...attributes}
    >
      <div className="drag-handle-main" {...listeners}>
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

const padArray = (arr, min) => {
  const copy = Array.isArray(arr) ? [...arr] : [];
  while (copy.length < min) copy.push({});
  return copy;
};

function ClassicTemplatePreview({
  resumeData,
  onResumeDataChange,
  sectionOnly = null,
  viewMode = 'static', // 'static', 'draggable', 'customize'
  showCustomizationPanel = false,
}) {
  const {
    header = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  // Font options
  const fontOptions = [
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
  ];

  // Style settings state (hidden by default, but still functional)
  const [styleSettings, setStyleSettings] = useState({
    fontFamily: resumeData?.styleSettings?.fontFamily || 'Helvetica',
    fontSize: resumeData?.styleSettings?.fontSize || 10,
    lineHeight: resumeData?.styleSettings?.lineHeight || 1.4,
    primaryColor: resumeData?.styleSettings?.primaryColor || '#333333',
    secondaryColor: resumeData?.styleSettings?.secondaryColor || '#666666',
    accentColor: resumeData?.styleSettings?.accentColor || '#000000',
    headerColor: resumeData?.styleSettings?.headerColor || '#000000',
    sidebarBg: resumeData?.styleSettings?.sidebarBg || '#f2f2f2',
    sectionSpacing: resumeData?.styleSettings?.sectionSpacing || 15,
  });

  // Section ordering state - only main content sections can be reordered
  const defaultMainSections = ['experience', 'education', 'projects'];
  const [mainSectionOrder, setMainSectionOrder] = useState(
    resumeData?.mainSectionOrder || defaultMainSections
  );

  // Color picker states
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [showCustomizationMenu, setShowCustomizationMenu] = useState(
    showCustomizationPanel
  );

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
        setMainSectionOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          const newOrder = arrayMove(items, oldIndex, newIndex);

          // Update resume data if callback provided
          if (onResumeDataChange) {
            onResumeDataChange({
              ...resumeData,
              mainSectionOrder: newOrder,
            });
          }

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

      if (onResumeDataChange) {
        onResumeDataChange({
          ...resumeData,
          styleSettings: newStyleSettings,
        });
      }
    },
    [styleSettings, resumeData, onResumeDataChange]
  );

  // Render individual sections with dynamic styling
  const renderSection = (sectionType) => {
    const baseStyles = {
      fontFamily: styleSettings.fontFamily,
      fontSize: `${styleSettings.fontSize}px`,
      lineHeight: styleSettings.lineHeight,
      color: styleSettings.primaryColor,
    };

    switch (sectionType) {
      case 'header':
        return (
          <div
            className="classic-sidebar"
            style={{ backgroundColor: styleSettings.sidebarBg }}
          >
            <h1
              className="classic-name"
              style={{
                ...baseStyles,
                fontSize: `${styleSettings.fontSize * 2.4}px`,
                fontWeight: 'bold',
                color: styleSettings.headerColor,
                marginBottom: '15px',
              }}
            >
              {header.name || 'Your Name'}
            </h1>

            <div className="classic-sidebar-section">
              <h2
                className="classic-sidebar-title"
                style={{
                  ...baseStyles,
                  fontSize: `${styleSettings.fontSize * 1.2}px`,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${styleSettings.accentColor}`,
                  paddingBottom: '3px',
                  marginBottom: '8px',
                  color: styleSettings.accentColor,
                }}
              >
                Contact
              </h2>
              <p
                className="classic-contact-item"
                style={{
                  ...baseStyles,
                  marginBottom: '4px',
                }}
              >
                {header.email || 'your.email@example.com'}
              </p>
              <p
                className="classic-contact-item"
                style={{
                  ...baseStyles,
                  marginBottom: '4px',
                }}
              >
                {header.phone || '(123) 456-7890'}
              </p>
              <a
                href={header.website || '#'}
                className="classic-link"
                style={{
                  ...baseStyles,
                  color: styleSettings.accentColor,
                  textDecoration: 'none',
                }}
              >
                {header.website || 'your-website.com'}
              </a>
            </div>

            <div className="classic-sidebar-section">
              <h2
                className="classic-sidebar-title"
                style={{
                  ...baseStyles,
                  fontSize: `${styleSettings.fontSize * 1.2}px`,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${styleSettings.accentColor}`,
                  paddingBottom: '3px',
                  marginBottom: '8px',
                  color: styleSettings.accentColor,
                }}
              >
                Skills
              </h2>
              <ul
                className="classic-skills-list"
                style={{ paddingLeft: '1.2em', margin: 0 }}
              >
                {padArray(skills, 3).map((skill, i) => (
                  <li
                    key={`skill-${i}`}
                    style={{
                      ...baseStyles,
                      marginBottom: '3px',
                    }}
                  >
                    {skill || 'Sample Skill'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div
            className="classic-section"
            style={{
              ...baseStyles,
              marginBottom: `${styleSettings.sectionSpacing}px`,
            }}
          >
            <h2
              className="classic-section-title"
              style={{
                ...baseStyles,
                fontSize: `${styleSettings.fontSize * 1.4}px`,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${styleSettings.accentColor}`,
                paddingBottom: '5px',
                marginBottom: '10px',
                color: styleSettings.accentColor,
              }}
            >
              Work Experience
            </h2>
            {padArray(experience, 1).map((exp, i) => (
              <div
                key={`exp-${i}`}
                className="classic-item"
                style={{ marginBottom: '12px' }}
              >
                <div
                  className="classic-item-header"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2px',
                  }}
                >
                  <h3
                    className="classic-item-title"
                    style={{
                      ...baseStyles,
                      fontSize: `${styleSettings.fontSize * 1.1}px`,
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {exp.jobTitle || 'Job Title'}
                  </h3>
                  <p
                    className="classic-item-date"
                    style={{
                      ...baseStyles,
                      fontSize: `${styleSettings.fontSize * 0.9}px`,
                      color: styleSettings.secondaryColor,
                      margin: 0,
                    }}
                  >
                    {(exp.startDate || 'Start') +
                      (exp.endDate ? ` - ${exp.endDate}` : ' - Present')}
                  </p>
                </div>
                <p
                  className="classic-item-subheader"
                  style={{
                    ...baseStyles,
                    fontSize: `${styleSettings.fontSize * 0.95}px`,
                    color: styleSettings.secondaryColor,
                    fontStyle: 'italic',
                    margin: '2px 0 3px 0',
                  }}
                >
                  {`${exp.company || 'Company'} | ${exp.location || 'Location'}`}
                </p>
                <p
                  className="classic-item-description"
                  style={{
                    ...baseStyles,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}
                >
                  {exp.description ||
                    'Describe your responsibilities and achievements.'}
                </p>
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div
            className="classic-section"
            style={{
              ...baseStyles,
              marginBottom: `${styleSettings.sectionSpacing}px`,
            }}
          >
            <h2
              className="classic-section-title"
              style={{
                ...baseStyles,
                fontSize: `${styleSettings.fontSize * 1.4}px`,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${styleSettings.accentColor}`,
                paddingBottom: '5px',
                marginBottom: '10px',
                color: styleSettings.accentColor,
              }}
            >
              Education
            </h2>
            {padArray(education, 1).map((edu, i) => (
              <div
                key={`edu-${i}`}
                className="classic-item"
                style={{ marginBottom: '12px' }}
              >
                <div
                  className="classic-item-header"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2px',
                  }}
                >
                  <h3
                    className="classic-item-title"
                    style={{
                      ...baseStyles,
                      fontSize: `${styleSettings.fontSize * 1.1}px`,
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {edu.degree || 'Degree or Certificate'}
                  </h3>
                  <p
                    className="classic-item-date"
                    style={{
                      ...baseStyles,
                      fontSize: `${styleSettings.fontSize * 0.9}px`,
                      color: styleSettings.secondaryColor,
                      margin: 0,
                    }}
                  >
                    {edu.graduationDate || 'Year'}
                  </p>
                </div>
                <p
                  className="classic-item-subheader"
                  style={{
                    ...baseStyles,
                    fontSize: `${styleSettings.fontSize * 0.95}px`,
                    color: styleSettings.secondaryColor,
                    fontStyle: 'italic',
                    margin: '2px 0 0 0',
                  }}
                >
                  {`${edu.institution || 'Institution'} | ${edu.location || 'Location'}`}
                </p>
              </div>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div
            className="classic-section"
            style={{
              ...baseStyles,
              marginBottom: `${styleSettings.sectionSpacing}px`,
            }}
          >
            <h2
              className="classic-section-title"
              style={{
                ...baseStyles,
                fontSize: `${styleSettings.fontSize * 1.4}px`,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${styleSettings.accentColor}`,
                paddingBottom: '5px',
                marginBottom: '10px',
                color: styleSettings.accentColor,
              }}
            >
              Projects
            </h2>
            {padArray(projects, 1).map((proj, i) => (
              <div
                key={`proj-${i}`}
                className="classic-item"
                style={{ marginBottom: '12px' }}
              >
                <h3
                  className="classic-item-title"
                  style={{
                    ...baseStyles,
                    fontSize: `${styleSettings.fontSize * 1.1}px`,
                    fontWeight: 'bold',
                    margin: '0 0 3px 0',
                  }}
                >
                  {proj.name || 'Project Name'}
                </h3>
                <p
                  className="classic-item-subheader"
                  style={{
                    ...baseStyles,
                    fontSize: `${styleSettings.fontSize * 0.95}px`,
                    color: styleSettings.secondaryColor,
                    fontStyle: 'italic',
                    margin: '0 0 3px 0',
                  }}
                >
                  Technologies: {proj.technologies || 'React, Node.js'}
                </p>
                <p
                  className="classic-item-description"
                  style={{
                    ...baseStyles,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}
                >
                  {proj.description || 'Describe your project.'}
                </p>
                <a
                  href={proj.link || '#'}
                  className="classic-link"
                  style={{
                    ...baseStyles,
                    fontSize: `${styleSettings.fontSize * 0.9}px`,
                    color: styleSettings.accentColor,
                    textDecoration: 'none',
                    display: proj.link ? 'block' : 'none',
                    marginTop: '5px',
                  }}
                >
                  {proj.link ? 'View Project →' : ''}
                </a>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // If rendering only one section for DraggableTemplateWrapper
  if (sectionOnly) {
    return renderSection(sectionOnly);
  }

  // Draggable mode with optional customization panel
  if (viewMode === 'draggable' || viewMode === 'customize') {
    return (
      <div className="classic-draggable-layout">
        {/* Hidden/Toggleable Customization Panel */}
        {showCustomizationMenu && (
          <div className="classic-customization-sidebar">
            <div className="customization-header">
              <h3>🎨 Customize Classic</h3>
              <p>Professional template with advanced controls</p>
              <button
                className="close-customization-btn"
                onClick={() => setShowCustomizationMenu(false)}
              >
                ✕
              </button>
            </div>

            <div className="customization-sections">
              {/* Typography Section */}
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
                    min="9"
                    max="16"
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
                      handleStyleChange(
                        'lineHeight',
                        parseFloat(e.target.value)
                      )
                    }
                    className="range-slider"
                  />
                </div>
              </div>

              {/* Colors Section */}
              <div className="customization-section">
                <h4>Colors</h4>

                {[
                  { key: 'headerColor', label: 'Name Color' },
                  { key: 'primaryColor', label: 'Primary Text' },
                  { key: 'secondaryColor', label: 'Secondary Text' },
                  { key: 'accentColor', label: 'Section Headers' },
                  { key: 'sidebarBg', label: 'Sidebar Background' },
                ].map(({ key, label }) => (
                  <div key={key} className="control-group">
                    <label>{label}</label>
                    <div className="color-input-wrapper">
                      <div
                        className="color-preview"
                        style={{ backgroundColor: styleSettings[key] }}
                        onClick={() =>
                          setShowColorPicker(
                            showColorPicker === key ? null : key
                          )
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

              {/* Layout Section */}
              <div className="customization-section">
                <h4>Layout</h4>
                <div className="control-group">
                  <label>
                    Section Spacing: {styleSettings.sectionSpacing}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    value={styleSettings.sectionSpacing}
                    onChange={(e) =>
                      handleStyleChange(
                        'sectionSpacing',
                        parseInt(e.target.value)
                      )
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
                    fontFamily: 'Helvetica',
                    fontSize: 10,
                    lineHeight: 1.4,
                    primaryColor: '#333333',
                    secondaryColor: '#666666',
                    accentColor: '#000000',
                    headerColor: '#000000',
                    sidebarBg: '#f2f2f2',
                    sectionSpacing: 15,
                  };
                  setStyleSettings(defaultSettings);
                  if (onResumeDataChange) {
                    onResumeDataChange({
                      ...resumeData,
                      styleSettings: defaultSettings,
                    });
                  }
                }}
              >
                🔄 Reset to Default
              </button>
            </div>
          </div>
        )}

        {/* Main Resume with Drag & Drop */}
        <div className="classic-draggable-preview">
          <div className="draggable-header">
            <h3>📄 Classic Template - Drag & Drop</h3>
            <div className="draggable-controls">
              <p>Drag main sections to reorder • Sidebar stays fixed</p>
              {!showCustomizationMenu && (
                <button
                  className="show-customization-btn"
                  onClick={() => setShowCustomizationMenu(true)}
                >
                  🎨 Customize
                </button>
              )}
            </div>
          </div>

          <div className="classic-resume-document-draggable">
            <div className="classic-template-preview-page">
              {/* Left Sidebar - Fixed */}
              {renderSection('header')}

              {/* Right Main Content - Draggable */}
              <div className="classic-main-content">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={mainSectionOrder}
                    strategy={verticalListSortingStrategy}
                  >
                    {mainSectionOrder.map((sectionId) => (
                      <SortableMainSection key={sectionId} id={sectionId}>
                        {renderSection(sectionId)}
                      </SortableMainSection>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Static mode - original Classic template
  return (
    <div className="classic-template-preview-page">
      {renderSection('header')}
      <div className="classic-main-content">
        {renderSection('experience')}
        {renderSection('education')}
        {renderSection('projects')}
      </div>
    </div>
  );
}

export default ClassicTemplatePreview;
