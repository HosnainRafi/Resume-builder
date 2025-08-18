// src/components/StyleOnlyEditableField.jsx

import React, { useState, useRef, useEffect } from 'react';
import './StyleOnlyEditableField.css';

const StyleOnlyEditableField = ({
  children,
  className = '',
  tag: Tag = 'div',
  allowFormatting = true,
  field,
  onUpdate,
  ...props
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [savedSelection, setSavedSelection] = useState(null);
  const elementRef = useRef();

  // Save current selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSavedSelection(range.cloneRange());
      return range;
    }
    return null;
  };

  // Restore saved selection
  const restoreSelection = () => {
    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
      return true;
    }
    return false;
  };

  const checkActiveFormats = () => {
    const formats = new Set();

    try {
      if (document.queryCommandState('bold')) formats.add('bold');
      if (document.queryCommandState('italic')) formats.add('italic');
      if (document.queryCommandState('underline')) formats.add('underline');
    } catch (e) {
      // Ignore errors
    }

    setActiveFormats(formats);
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);

      // Check if selection is within our element
      if (
        elementRef.current &&
        elementRef.current.contains(range.commonAncestorContainer)
      ) {
        const rect = range.getBoundingClientRect();

        setToolbarPosition({
          x: rect.left + window.scrollX + rect.width / 2,
          y: rect.top + window.scrollY - 60,
        });

        setIsSelected(true);
        setShowToolbar(true);
        saveSelection();
        checkActiveFormats();
      }
    } else {
      setIsSelected(false);
      setShowToolbar(false);
      setSavedSelection(null);
      setActiveFormats(new Set());
    }
  };

  const handleMouseUp = () => {
    setTimeout(handleSelection, 10);
  };

  const handleKeyUp = () => {
    setTimeout(handleSelection, 10);
  };

  const applyStyle = (command, value = null) => {
    // Focus the element first
    if (elementRef.current) {
      elementRef.current.focus();
    }

    // Restore selection
    if (restoreSelection()) {
      try {
        // Execute the command
        document.execCommand(command, false, value);

        // Update active formats
        setTimeout(() => {
          checkActiveFormats();
          saveSelection();
        }, 10);
      } catch (e) {
        console.error('Command execution failed:', e);
      }
    }
  };

  const handleContentChange = () => {
    if (onUpdate && field && elementRef.current) {
      const newContent = elementRef.current.innerHTML;
      onUpdate(field, newContent);
    }
  };

  const handleBlur = (e) => {
    // Don't hide toolbar if clicking on toolbar buttons
    const toolbar = document.querySelector('.style-toolbar');
    if (toolbar && toolbar.contains(e.relatedTarget)) {
      return;
    }

    handleContentChange();
    setTimeout(() => {
      setShowToolbar(false);
      setIsSelected(false);
      setSavedSelection(null);
      setActiveFormats(new Set());
    }, 150);
  };

  const handleToolbarMouseDown = (e) => {
    // Prevent blur when clicking toolbar
    e.preventDefault();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const toolbar = document.querySelector('.style-toolbar');
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target) &&
        (!toolbar || !toolbar.contains(event.target))
      ) {
        setShowToolbar(false);
        setIsSelected(false);
        setSavedSelection(null);
        setActiveFormats(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!allowFormatting) {
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  }

  return (
    <>
      <Tag
        ref={elementRef}
        className={`style-editable-field ${className} ${isSelected ? 'selected' : ''}`}
        contentEditable={true}
        suppressContentEditableWarning={true}
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        onMouseUp={handleMouseUp}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        style={{ outline: 'none' }}
        {...props}
      >
        {children}
      </Tag>

      {/* Enhanced Toolbar with Proper Event Handling */}
      {showToolbar && (
        <div
          className="style-toolbar"
          onMouseDown={handleToolbarMouseDown}
          style={{
            position: 'fixed',
            top: `${toolbarPosition.y}px`,
            left: `${toolbarPosition.x}px`,
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          <div className="style-toolbar-buttons">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                applyStyle('bold');
              }}
              className={`style-btn ${activeFormats.has('bold') ? 'active' : ''}`}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                applyStyle('italic');
              }}
              className={`style-btn ${activeFormats.has('italic') ? 'active' : ''}`}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                applyStyle('underline');
              }}
              className={`style-btn ${activeFormats.has('underline') ? 'active' : ''}`}
              title="Underline (Ctrl+U)"
            >
              <u>U</u>
            </button>

            <div className="style-divider"></div>

            <button
              onMouseDown={(e) => {
                e.preventDefault();
                applyStyle('insertUnorderedList');
              }}
              className="style-btn"
              title="Bullet List"
            >
              •
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                applyStyle('insertOrderedList');
              }}
              className="style-btn"
              title="Numbered List"
            >
              1.
            </button>

            <div className="style-divider"></div>

            <select
              onMouseDown={(e) => e.preventDefault()}
              onChange={(e) => {
                if (e.target.value) {
                  applyStyle('fontName', e.target.value);
                  e.target.value = '';
                }
              }}
              className="font-select"
              title="Font Family"
              value=""
            >
              <option value="">Font</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Verdana">Verdana</option>
            </select>

            <select
              onMouseDown={(e) => e.preventDefault()}
              onChange={(e) => {
                if (e.target.value) {
                  applyStyle('fontSize', e.target.value);
                  e.target.value = '';
                }
              }}
              className="font-size-select"
              title="Font Size"
              value=""
            >
              <option value="">Size</option>
              <option value="1">Small</option>
              <option value="3">Normal</option>
              <option value="5">Large</option>
              <option value="7">Huge</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
};

export default StyleOnlyEditableField;
