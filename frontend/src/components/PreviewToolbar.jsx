// src/components/PreviewToolbar.jsx

import React from 'react';
import './PreviewToolbar.css';

function PreviewToolbar({
  scale,
  onScaleChange,
  isFullscreen,
  onToggleFullscreen,
  template,
  onTemplateChange,
}) {
  const scaleOptions = [0.5, 0.75, 1, 1.25, 1.5];

  return (
    <div className="preview-toolbar">
      <div className="toolbar-left">
        <div className="scale-controls">
          <button
            className="scale-btn"
            onClick={() => onScaleChange(Math.max(0.25, scale - 0.25))}
            disabled={scale <= 0.25}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>

          <select
            value={scale}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            className="scale-select"
          >
            {scaleOptions.map((option) => (
              <option key={option} value={option}>
                {Math.round(option * 100)}%
              </option>
            ))}
          </select>

          <button
            className="scale-btn"
            onClick={() => onScaleChange(Math.min(2, scale + 0.25))}
            disabled={scale >= 2}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <line x1="8" y1="11" x2="14" y2="11" />
              <line x1="11" y1="8" x2="11" y2="14" />
            </svg>
          </button>
        </div>
      </div>

      <div className="toolbar-center">
        <span className="template-name">{template.name} Template</span>
      </div>

      <div className="toolbar-right">
        <button
          className="toolbar-btn"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isFullscreen ? (
              <>
                <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
              </>
            ) : (
              <>
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PreviewToolbar;
