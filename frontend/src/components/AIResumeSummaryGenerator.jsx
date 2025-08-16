// src/components/AIResumeSummaryGenerator.jsx

import React, { useState } from 'react';
import { Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { auth } from '../library/firebase';

// API function for generating summary
const generateSummaryAPI = async (url, { arg }) => {
  const {
    jobTitle,
    yearsExperience,
    keySkills,
    experienceLevel,
    careerHighlights,
  } = arg;

  // Get Firebase auth token
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken();

  const apiClient = axios.create({
    baseURL: '',
    //withCredentials: true, // TEMPORARILY COMMENT THIS OUT
  });

  // Add Authorization header
  const { data } = await apiClient.post(
    '/api/ai/generate-summary',
    {
      jobTitle,
      yearsExperience,
      keySkills,
      experienceLevel,
      careerHighlights,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return data.data.summary;
};

function AIResumeSummaryGenerator({ currentSummary = '', onSummaryGenerated }) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    yearsExperience: '',
    keySkills: '',
    experienceLevel: 'mid-level',
    careerHighlights: '',
  });

  const [generatedSummary, setGeneratedSummary] = useState(currentSummary);
  const [showForm, setShowForm] = useState(false);

  const {
    trigger: generateSummary,
    isMutating: isGenerating,
    error,
  } = useSWRMutation('/api/ai/generate-summary', generateSummaryAPI, {
    onSuccess: (summary) => {
      setGeneratedSummary(summary);
      if (onSummaryGenerated) {
        onSummaryGenerated(summary);
      }
      setShowForm(false);
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!formData.jobTitle || !formData.yearsExperience) {
      alert('Please fill in job title and years of experience');
      return;
    }
    generateSummary(formData);
  };

  const handleUseSummary = () => {
    if (onSummaryGenerated) {
      onSummaryGenerated(generatedSummary);
    }
  };

  // Style for scrollable textarea
  const textareaStyle = {
    minHeight: '120px',
    maxHeight: '200px',
    overflowY: 'auto',
    resize: 'vertical',
    lineHeight: '1.5',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  };

  const textareaFocusStyle = {
    ...textareaStyle,
    borderColor: '#86b7fe',
    boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
  };

  return (
    <Card className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Card.Header
        className="d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
        }}
      >
        <h5 className="mb-0" style={{ color: '#495057', fontWeight: '600' }}>
          ✨ AI Summary Generator
        </h5>
        {!showForm && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 16px',
              fontWeight: '500',
            }}
          >
            Generate with AI
          </Button>
        )}
      </Card.Header>

      <Card.Body style={{ padding: '24px' }}>
        {showForm && (
          <div className="mb-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{ fontWeight: '500', marginBottom: '8px' }}
                  >
                    Job Title *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Senior Software Developer"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange('jobTitle', e.target.value)
                    }
                    style={{ borderRadius: '6px', padding: '10px 12px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{ fontWeight: '500', marginBottom: '8px' }}
                  >
                    Years of Experience *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 5 years"
                    value={formData.yearsExperience}
                    onChange={(e) =>
                      handleInputChange('yearsExperience', e.target.value)
                    }
                    style={{ borderRadius: '6px', padding: '10px 12px' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '500', marginBottom: '8px' }}>
                Experience Level
              </Form.Label>
              <Form.Select
                value={formData.experienceLevel}
                onChange={(e) =>
                  handleInputChange('experienceLevel', e.target.value)
                }
                style={{ borderRadius: '6px', padding: '10px 12px' }}
              >
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '500', marginBottom: '8px' }}>
                Key Skills
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., React, Node.js, Python, AWS"
                value={formData.keySkills}
                onChange={(e) => handleInputChange('keySkills', e.target.value)}
                style={{ borderRadius: '6px', padding: '10px 12px' }}
              />
              <Form.Text className="text-muted">
                Separate skills with commas
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '500', marginBottom: '8px' }}>
                Career Highlights (Optional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="e.g., Led team of 10 developers, Increased performance by 40%"
                value={formData.careerHighlights}
                onChange={(e) =>
                  handleInputChange('careerHighlights', e.target.value)
                }
                style={{
                  ...textareaStyle,
                  minHeight: '60px',
                  maxHeight: '120px',
                }}
              />
            </Form.Group>

            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{
                  background: isGenerating
                    ? '#6c757d'
                    : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontWeight: '500',
                  minWidth: '140px',
                }}
              >
                {isGenerating ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Summary'
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowForm(false)}
                style={{
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontWeight: '500',
                }}
              >
                Cancel
              </Button>
            </div>

            {error && (
              <Alert
                variant="danger"
                className="mt-3"
                style={{ borderRadius: '6px' }}
              >
                <strong>Error:</strong>{' '}
                {error.message ||
                  'Failed to generate summary. Please try again.'}
              </Alert>
            )}
          </div>
        )}

        {generatedSummary && (
          <div>
            <Form.Group>
              <Form.Label
                style={{
                  fontWeight: '600',
                  marginBottom: '12px',
                  fontSize: '16px',
                }}
              >
                📝 Generated Summary
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={generatedSummary}
                onChange={(e) => setGeneratedSummary(e.target.value)}
                className="mb-3 ai-generated-summary"
                style={textareaStyle}
                onFocus={(e) => {
                  Object.assign(e.target.style, textareaFocusStyle);
                }}
                onBlur={(e) => {
                  Object.assign(e.target.style, textareaStyle);
                }}
                placeholder="Your AI-generated summary will appear here..."
              />
              <div
                style={{
                  fontSize: '12px',
                  color: '#6c757d',
                  marginBottom: '16px',
                  fontStyle: 'italic',
                }}
              >
                💡 Tip: You can edit the summary above before using it. The text
                area will scroll if content exceeds the visible area.
              </div>
            </Form.Group>
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="success"
                onClick={handleUseSummary}
                style={{
                  background:
                    'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontWeight: '500',
                }}
              >
                ✅ Use This Summary
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowForm(true)}
                style={{
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontWeight: '500',
                }}
              >
                🔄 Regenerate
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setGeneratedSummary('')}
                style={{
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontWeight: '500',
                }}
              >
                🗑️ Clear
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default AIResumeSummaryGenerator;
