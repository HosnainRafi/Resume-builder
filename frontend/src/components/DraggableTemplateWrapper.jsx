import React, { useState, useRef } from 'react';
import './DraggableTemplateWrapper.css';

const DraggableTemplateWrapper = ({
  resumeData,
  onResumeDataChange,
  templateName = 'Template',
}) => {
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

  // Create section data for each section type
  const createSectionData = (sectionType) => {
    const {
      header = {},
      experience = [],
      education = [],
      skills = [],
      projects = [],
    } = resumeData || {};

    switch (sectionType) {
      case 'header':
        return {
          header,
          experience: [],
          education: [],
          skills: [],
          projects: [],
        };
      case 'experience':
        return {
          header: {},
          experience,
          education: [],
          skills: [],
          projects: [],
        };
      case 'education':
        return {
          header: {},
          experience: [],
          education,
          skills: [],
          projects: [],
        };
      case 'skills':
        return {
          header: {},
          experience: [],
          education: [],
          skills,
          projects: [],
        };
      case 'projects':
        return {
          header: {},
          experience: [],
          education: [],
          skills: [],
          projects,
        };
      default:
        return {
          header: {},
          experience: [],
          education: [],
          skills: [],
          projects: [],
        };
    }
  };

  // Check if section has data to render
  const hasData = (sectionType) => {
    const {
      header = {},
      experience = [],
      education = [],
      skills = [],
      projects = [],
    } = resumeData || {};

    switch (sectionType) {
      case 'header':
        return header && (header.name || header.email);
      case 'experience':
        return Array.isArray(experience) && experience.length > 0;
      case 'education':
        return Array.isArray(education) && education.length > 0;
      case 'skills':
        return Array.isArray(skills) && skills.length > 0;
      case 'projects':
        return Array.isArray(projects) && projects.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="draggable-template-wrapper">
      <div className="drag-instructions">
        <h3>🔄 {templateName} Template - Drag & Drop Mode</h3>
        <p>📋 Drag sections to reorder them • Changes save automatically</p>
        <p className="template-note">
          ✨ Using {templateName} design with drag & drop functionality
        </p>
      </div>

      <div className="template-container">
        {sectionOrder.map((sectionType, index) => {
          // Skip sections with no data (except header)
          if (!hasData(sectionType) && sectionType !== 'header') {
            return null;
          }

          return (
            <div
              key={sectionType}
              className={`draggable-section ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <div
                className="drag-handle"
                title={`Drag to reorder ${sectionType}`}
              >
                <span className="drag-icon">⋮⋮</span>
                <span className="section-label">
                  {sectionType.toUpperCase()}
                </span>
              </div>

              {/* Render the specific section using the selected template */}
              <div className="section-content">
                <TemplateComponent
                  resumeData={createSectionData(sectionType)}
                  sectionOnly={sectionType}
                  viewMode="static"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DraggableTemplateWrapper;
