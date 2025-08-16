// src/components/SummaryEditor.jsx

import React from 'react';
import { Card, Form } from 'react-bootstrap';
import AIResumeSummaryGenerator from './AIResumeSummaryGenerator';

function SummaryEditor({ summary, setSummary }) {
  const handleSummaryGenerated = (generatedSummary) => {
    setSummary(generatedSummary);
  };

  // Style for scrollable textarea
  const textareaStyle = {
    minHeight: '120px',
    maxHeight: '200px',
    overflowY: 'auto',
    resize: 'vertical',
    lineHeight: '1.6',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  };

  const textareaFocusStyle = {
    ...textareaStyle,
    borderColor: '#86b7fe',
    boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
    outline: 'none',
  };

  return (
    <div>
      {/* AI Resume Summary Generator */}
      <AIResumeSummaryGenerator
        currentSummary={summary}
        onSummaryGenerated={handleSummaryGenerated}
      />

      {/* Manual Summary Editor */}
      <Card className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Card.Header
          as="h5"
          style={{
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6',
            color: '#495057',
            fontWeight: '600',
            padding: '16px 20px',
          }}
        >
          📝 Professional Summary
        </Card.Header>
        <Card.Body style={{ padding: '20px' }}>
          <Form.Group>
            <Form.Label
              style={{
                fontWeight: '500',
                marginBottom: '12px',
                color: '#495057',
              }}
            >
              Write Your Summary
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Write a brief summary of your professional background and key qualifications...

Example: Experienced software engineer with 5+ years developing scalable web applications. Proficient in React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-impact solutions that drive business growth."
              value={summary || ''}
              onChange={(e) => setSummary(e.target.value)}
              className="summary-textarea-manual"
              style={textareaStyle}
              onFocus={(e) => {
                Object.assign(e.target.style, textareaFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.target.style, textareaStyle);
              }}
            />
            <div className="d-flex justify-content-between align-items-center mt-2">
              <Form.Text className="text-muted">
                💡 <strong>Tip:</strong> Write 2-4 sentences highlighting your
                experience, key skills, and career objectives. Keep it concise
                but impactful.
              </Form.Text>
              <small
                className="text-muted"
                style={{
                  fontSize: '11px',
                  fontStyle: 'italic',
                }}
              >
                {summary ? `${summary.length} characters` : '0 characters'}
              </small>
            </div>

            {/* Quick Tips */}
            <div
              className="mt-3 p-3"
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '13px',
              }}
            >
              <div
                style={{
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#495057',
                }}
              >
                ✨ Summary Writing Tips:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#6c757d' }}>
                <li>
                  Start with your professional title and years of experience
                </li>
                <li>
                  Mention your key technical skills and areas of expertise
                </li>
                <li>Highlight your most significant achievements or impact</li>
                <li>
                  End with your career goals or what you bring to employers
                </li>
              </ul>
            </div>

            {/* Word count and length indicator */}
            {summary && (
              <div className="mt-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {summary.length < 100 && (
                      <small className="text-warning">
                        ⚠️ Consider adding more detail (aim for 100-300
                        characters)
                      </small>
                    )}
                    {summary.length >= 100 && summary.length <= 300 && (
                      <small className="text-success">
                        ✅ Good length for a professional summary
                      </small>
                    )}
                    {summary.length > 300 && (
                      <small className="text-info">
                        💡 Consider making it more concise for better impact
                      </small>
                    )}
                  </div>
                  <div>
                    <small className="text-muted">
                      Words:{' '}
                      {
                        summary.split(/\s+/).filter((word) => word.length > 0)
                          .length
                      }
                    </small>
                  </div>
                </div>

                {/* Progress bar for length */}
                <div className="mt-2">
                  <div
                    className="progress"
                    style={{ height: '4px', backgroundColor: '#e9ecef' }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.min((summary.length / 300) * 100, 100)}%`,
                        backgroundColor:
                          summary.length <= 300 ? '#28a745' : '#ffc107',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SummaryEditor;
