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

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">✨ AI Summary Generator</h5>
        {!showForm && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            Generate with AI
          </Button>
        )}
      </Card.Header>

      <Card.Body>
        {showForm && (
          <div className="mb-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Senior Software Developer"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange('jobTitle', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Years of Experience *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 5 years"
                    value={formData.yearsExperience}
                    onChange={(e) =>
                      handleInputChange('yearsExperience', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Experience Level</Form.Label>
              <Form.Select
                value={formData.experienceLevel}
                onChange={(e) =>
                  handleInputChange('experienceLevel', e.target.value)
                }
              >
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Key Skills</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., React, Node.js, Python, AWS"
                value={formData.keySkills}
                onChange={(e) => handleInputChange('keySkills', e.target.value)}
              />
              <Form.Text className="text-muted">
                Separate skills with commas
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Career Highlights (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="e.g., Led team of 10 developers, Increased performance by 40%"
                value={formData.careerHighlights}
                onChange={(e) =>
                  handleInputChange('careerHighlights', e.target.value)
                }
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={isGenerating}
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
              >
                Cancel
              </Button>
            </div>

            {error && (
              <Alert variant="danger" className="mt-3">
                {error.message ||
                  'Failed to generate summary. Please try again.'}
              </Alert>
            )}
          </div>
        )}

        {generatedSummary && (
          <div>
            <Form.Group>
              <Form.Label>Generated Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={generatedSummary}
                onChange={(e) => setGeneratedSummary(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button variant="success" onClick={handleUseSummary}>
                Use This Summary
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default AIResumeSummaryGenerator;
