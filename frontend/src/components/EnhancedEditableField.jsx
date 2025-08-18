// src/components/EnhancedEditableField.jsx

import React, { useState, useCallback, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './EnhancedEditableField.css';

const EnhancedEditableField = ({
  field,
  content,
  className = '',
  placeholder = 'Click to edit',
  tag: Tag = 'div',
  onFieldChange,
  multiline = false,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content || '');
  const quillRef = useRef();

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'link',
  ];

  const handleStartEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditContent(content || '');
  };

  const handleSave = useCallback(() => {
    onFieldChange(field, editContent);
    setIsEditing(false);
  }, [field, editContent, onFieldChange]);

  const handleCancel = () => {
    setEditContent(content || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
    // Prevent bubbling to avoid conflicts
    e.stopPropagation();
  };

  if (isEditing) {
    return (
      <div className="enhanced-editing-container">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={editContent}
          onChange={setEditContent}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="enhanced-quill-editor"
          onKeyDown={handleKeyDown}
        />
        <div className="edit-actions">
          <button onClick={handleSave} className="save-btn">
            ✓ Save
          </button>
          <button onClick={handleCancel} className="cancel-btn">
            ✗ Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      className={`enhanced-editable-field ${className}`}
      onClick={handleStartEdit}
      onDoubleClick={handleStartEdit}
      dangerouslySetInnerHTML={{
        __html: content || `<span class="placeholder">${placeholder}</span>`,
      }}
      title="Click to edit with rich text editor"
      {...props}
    />
  );
};

export default EnhancedEditableField;
