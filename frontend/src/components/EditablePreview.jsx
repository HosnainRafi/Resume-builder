// src/components/EditablePreview.jsx

import React, { useState, useRef } from 'react';
import './EditablePreview.css';

// Import your template previews
import ClassicTemplatePreview from './ClassicTemplatePreview';
import ModernTemplatePreview from './ModernTemplatePreview';
// ... import other templates

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplatePreview,
  modern: ModernTemplatePreview,
  // ... add other templates
};

function EditablePreview({
  resumeData,
  templateId,
  onEdit,
  onElementSelect,
  showAdjustmentToolbar,
}) {
  const [editingElement, setEditingElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);

  const handleElementClick = (element, field, path) => {
    setEditingElement({ element, field, path });
    onElementSelect(element);
  };

  const handleTextChange = (value, field, path) => {
    onEdit(field, value);
    setEditingElement(null);
  };

  const TemplateComponent =
    TEMPLATE_COMPONENTS[templateId] || TEMPLATE_COMPONENTS['classic'];

  return (
    <div
      className={`editable-preview ${showAdjustmentToolbar ? 'adjustment-mode' : ''}`}
    >
      {/* Render template with editable wrapper */}
      <div className="template-wrapper">
        <TemplateComponent
          resumeData={resumeData}
          isEditable={true}
          onElementClick={handleElementClick}
          onTextChange={handleTextChange}
          editingElement={editingElement}
          hoveredElement={hoveredElement}
          onHover={setHoveredElement}
        />
      </div>

      {/* Edit tooltip */}
      {hoveredElement && (
        <div className="edit-tooltip">
          <span>Click to edit</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default EditablePreview;
