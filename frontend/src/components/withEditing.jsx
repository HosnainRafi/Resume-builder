// src/components/withEditing.jsx

import React, { useState, useCallback } from 'react';
import './EditingOverlay.css';

const withEditing = (WrappedComponent) => {
  return function EditableComponent(props) {
    const { resumeData, onFieldChange, isEditable, ...otherProps } = props;
    const [editingField, setEditingField] = useState(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

    const handleStartEdit = useCallback(
      (field, event) => {
        if (!isEditable) return;

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
      },
      [isEditable]
    );

    const handleStopEdit = useCallback(() => {
      setEditingField(null);
      setShowToolbar(false);
    }, []);

    const handleContentChange = useCallback(
      (field, content) => {
        // Parse the field path and update resume data
        const fieldParts = field.split('.');
        let updatedData = { ...resumeData };

        if (fieldParts.length === 2) {
          if (!updatedData[fieldParts[0]]) updatedData[fieldParts] = {};
          updatedData[fieldParts][fieldParts[4]] = content;
        } else if (fieldParts.length === 3) {
          const [section, index, subField] = fieldParts;
          if (updatedData[section] && updatedData[section][parseInt(index)]) {
            updatedData[section][parseInt(index)][subField] = content;
          }
        } else {
          updatedData[field] = content;
        }

        onFieldChange(field, updatedData);
      },
      [resumeData, onFieldChange]
    );

    const execCommand = (command, value = null) => {
      document.execCommand(command, false, value);
    };

    const EditableField = useCallback(
      ({
        field,
        content,
        className = '',
        placeholder = 'Click to edit',
        tag: Tag = 'div',
        children,
        ...fieldProps
      }) => {
        const isEditing = editingField === field;

        if (!isEditable) {
          return (
            <Tag className={className} {...fieldProps}>
              {children || content}
            </Tag>
          );
        }

        return (
          <Tag
            className={`editable-field ${className} ${isEditing ? 'editing' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onDoubleClick={(e) => handleStartEdit(field, e)}
            onClick={(e) => handleStartEdit(field, e)}
            onBlur={(e) => {
              const newContent = e.target.innerHTML;
              handleContentChange(field, newContent);
              handleStopEdit();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && Tag !== 'div') {
                e.preventDefault();
                e.target.blur();
              }
              if (e.key === 'Escape') {
                e.target.blur();
              }
            }}
            dangerouslySetInnerHTML={{
              __html:
                content || `<span class="placeholder">${placeholder}</span>`,
            }}
            data-placeholder={placeholder}
            {...fieldProps}
          />
        );
      },
      [
        isEditable,
        editingField,
        handleStartEdit,
        handleContentChange,
        handleStopEdit,
      ]
    );

    return (
      <div className="editable-wrapper">
        <WrappedComponent
          {...otherProps}
          resumeData={resumeData}
          EditableField={EditableField}
          isEditable={isEditable}
        />

        {/* Floating Toolbar */}
        {showToolbar && isEditable && (
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
};

export default withEditing;
