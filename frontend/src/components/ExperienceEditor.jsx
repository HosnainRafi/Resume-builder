// src/components/ExperienceEditor.jsx

import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { auth } from '../library/firebase';

// API function for generating job description
const generateJobDescriptionAPI = async (url, { arg }) => {
  const {
    jobTitle,
    company,
    industry,
    yearsExperience,
    responsibilities,
    targetSkills,
  } = arg;

  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();
  const apiClient = axios.create({ baseURL: '' });

  const { data } = await apiClient.post(
    '/api/ai/generate-job-description',
    {
      jobTitle,
      company,
      industry,
      yearsExperience,
      responsibilities,
      targetSkills,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return data.data.jobDescription;
};

function ExperienceEditor({ experience = [], setExperience }) {
  React.useEffect(() => {
    if (experience.length === 0) {
      setExperience([
        {
          jobTitle: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          industry: '', // Add industry field
          aiGenerated: false,
        },
      ]);
    }
  }, [experience.length, setExperience]);

  const {
    trigger: generateJobDescription,
    isMutating: isGenerating,
    error: aiError,
  } = useSWRMutation(
    '/api/ai/generate-job-description',
    generateJobDescriptionAPI
  );

  const handleChange = (index, field, value) => {
    const updatedExperience = [...experience];
    if (!updatedExperience[index]) {
      updatedExperience[index] = {
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        industry: '',
        aiGenerated: false,
      };
    }
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };

    // If user manually edits description, mark as not AI-generated
    if (field === 'description') {
      updatedExperience[index].aiGenerated = false;
    }

    setExperience(updatedExperience);
  };

  const handleAIGenerate = async (index) => {
    const exp = experience[index];
    if (!exp.jobTitle || !exp.company) {
      alert(
        'Please fill in Job Title and Company before generating AI description'
      );
      return;
    }

    try {
      const generatedDescription = await generateJobDescription({
        jobTitle: exp.jobTitle,
        company: exp.company,
        industry: exp.industry || '', // Optional
        yearsExperience: calculateYearsExperience(exp.startDate, exp.endDate),
        responsibilities: exp.description || '', // Use existing description as context
        targetSkills: '', // Could add this as a separate field if needed
      });

      const updatedExperience = [...experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        description: generatedDescription,
        aiGenerated: true,
      };
      setExperience(updatedExperience);
    } catch (error) {
      console.error('Failed to generate job description:', error);
    }
  };

  // Helper function to calculate years of experience
  const calculateYearsExperience = (startDate, endDate) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end =
      endDate && endDate.toLowerCase() !== 'present'
        ? new Date(endDate)
        : new Date();
    const years = Math.max(
      0,
      Math.floor((end - start) / (1000 * 60 * 60 * 24 * 365))
    );
    return years > 0 ? `${years}` : '';
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        industry: '',
        aiGenerated: false,
      },
    ]);
  };

  const removeExperience = (index) => {
    if (experience.length > 1) {
      setExperience(experience.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      {experience.map((exp, index) => (
        <Card
          key={index}
          className="mb-4"
          style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
        >
          <Card.Header
            className="d-flex justify-content-between align-items-center"
            style={{ backgroundColor: '#f8f9fa' }}
          >
            <h5 className="mb-0">🏢 Experience {index + 1}</h5>
            {experience.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeExperience(index)}
              >
                Remove
              </Button>
            )}
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Senior Software Engineer"
                    value={exp.jobTitle || ''}
                    onChange={(e) =>
                      handleChange(index, 'jobTitle', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Tech Solutions Inc."
                    value={exp.company || ''}
                    onChange={(e) =>
                      handleChange(index, 'company', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., New York, NY"
                    value={exp.location || ''}
                    onChange={(e) =>
                      handleChange(index, 'location', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Industry (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Technology, Education, Healthcare"
                    value={exp.industry || ''}
                    onChange={(e) =>
                      handleChange(index, 'industry', e.target.value)
                    }
                  />
                  <Form.Text className="text-muted">
                    Helps AI generate more relevant descriptions
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Jan 2022 or 2022-01"
                    value={exp.startDate || ''}
                    onChange={(e) =>
                      handleChange(index, 'startDate', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Present or Dec 2023"
                    value={exp.endDate || ''}
                    onChange={(e) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label style={{ fontWeight: '600' }}>
                  📝 Job Description
                  {exp.aiGenerated && (
                    <span className="badge bg-success ms-2">
                      ✨ AI Generated
                    </span>
                  )}
                </Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleAIGenerate(index)}
                  disabled={isGenerating || !exp.jobTitle || !exp.company}
                  style={{
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Spinner size="sm" className="me-1" />
                      Generating...
                    </>
                  ) : (
                    '✨ Generate Description'
                  )}
                </Button>
              </div>

              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Describe your responsibilities, achievements, and key contributions...

Example: Led development of scalable web applications using React and Node.js, improving system performance by 40% and reducing technical debt. Collaborated with cross-functional teams to deliver high-quality features that increased user engagement by 25%."
                value={exp.description || ''}
                onChange={(e) =>
                  handleChange(index, 'description', e.target.value)
                }
                style={{
                  minHeight: '150px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  resize: 'vertical',
                  backgroundColor: exp.aiGenerated ? '#f8f9ff' : 'white',
                  border: exp.aiGenerated
                    ? '2px solid #667eea'
                    : '1px solid #ced4da',
                }}
              />

              {aiError && (
                <Alert
                  variant="danger"
                  className="mt-2"
                  style={{ fontSize: '12px' }}
                >
                  Failed to generate description: {aiError.message}
                </Alert>
              )}

              <Form.Text className="text-muted">
                💡 <strong>Tip:</strong> AI will generate a professional
                description based on your job title and company. You can edit it
                afterwards to personalize it further.
              </Form.Text>

              {exp.aiGenerated && (
                <div
                  className="mt-2 p-2"
                  style={{
                    backgroundColor: '#e8f4fd',
                    border: '1px solid #b3d9f2',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  ✨ <strong>AI Generated:</strong> This description was created
                  by AI based on your job title "{exp.jobTitle}" at "
                  {exp.company}". Feel free to edit and personalize it!
                </div>
              )}
            </Form.Group>
          </Card.Body>
        </Card>
      ))}

      <Button
        variant="outline-primary"
        onClick={addExperience}
        style={{ marginBottom: '20px' }}
      >
        + Add Another Experience
      </Button>
    </div>
  );
}

export default ExperienceEditor;
