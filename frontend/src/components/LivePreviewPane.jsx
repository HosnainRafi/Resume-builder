// src/components/LivePreviewPane.jsx

import React, { useState } from 'react';
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
import './LivePreviewPane.css';

// Sortable Section Wrapper
function SortableSection({ id, children, isEditable }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-resume-section ${isDragging ? 'dragging' : ''} ${isEditable ? 'editable' : ''}`}
      {...attributes}
    >
      {isEditable && (
        <div className="section-drag-handle" {...listeners}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </div>
      )}
      {children}
    </div>
  );
}

function LivePreviewPane({
  resumeData,
  template,
  scale = 1,
  onSectionReorder,
  isEditable = false,
}) {
  const [sectionOrder, setSectionOrder] = useState(
    resumeData?.sectionOrder || [
      'header',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
    ]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        onSectionReorder && onSectionReorder(newOrder);
        return newOrder;
      });
    }
  };

  const TemplateComponent = template.component;

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'header':
        return TemplateComponent ? (
          <TemplateComponent resumeData={resumeData} sectionOnly="header" />
        ) : null;
      case 'summary':
        return TemplateComponent ? (
          <TemplateComponent resumeData={resumeData} sectionOnly="summary" />
        ) : null;
      case 'experience':
        return TemplateComponent ? (
          <TemplateComponent resumeData={resumeData} sectionOnly="experience" />
        ) : null;
      case 'education':
        return TemplateComponent ? (
          <TemplateComponent resumeData={resumeData} sectionOnly="education" />
        ) : null;
      case 'skills':
        return TemplateComponent ? (
          <TemplateComponent resumeData={resumeData} sectionOnly="skills" />
        ) : null;
      case 'projects':
        return TemplateComponent ? (
          <TemplateComponent resumeData={resumeData} sectionOnly="projects" />
        ) : null;
      default:
        return null;
    }
  };

  if (!TemplateComponent) {
    return (
      <div className="live-preview-error">
        <p>Template not found</p>
      </div>
    );
  }

  return (
    <div className="live-preview-container">
      <div
        className="live-preview-page"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {isEditable ? (
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
                <SortableSection
                  key={sectionId}
                  id={sectionId}
                  isEditable={isEditable}
                >
                  {renderSectionContent(sectionId)}
                </SortableSection>
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <TemplateComponent resumeData={resumeData} />
        )}
      </div>
    </div>
  );
}

export default LivePreviewPane;
