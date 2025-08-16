// src/components/ExperienceEditor.jsx

import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import apiClient from '../api/apiClient'; // Import your pre-configured apiClient

// API function to call our new bullet point generator
const generateAIBulletPoints = async ({ jobTitle, company }) => {
  // Use the imported apiClient directly, which already has the interceptor for auth headers
  const { data } = await apiClient.post('/api/ai/generate-experience', {
    jobTitle,
    company,
  });
  return data.data.bulletPoints; // Expects an array of strings
};

// Custom mutation hook for SWR (since SWR doesn't have built-in mutations)
function useAsyncMutation(mutationFn, options = {}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const performMutation = async (variables) => {
    setIsPending(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate: performMutation, isPending, error };
}

// Reusable AI Writer button component
function AIWriterButton({
  jobTitle,
  company,
  onGenerated, // This will be the handleExperienceChange from parent
  index,
  currentDescription,
}) {
  const mutation = useAsyncMutation(generateAIBulletPoints, {
    onSuccess: (newBulletPoints) => {
      // Append new bullet points to the existing description
      // Ensure newBulletPoints is an array.
      const bulletPointsArray = Array.isArray(newBulletPoints)
        ? newBulletPoints
        : [];
      const updatedDescription = [currentDescription, ...bulletPointsArray]
        .filter((line) => line) // Remove any empty lines
        .join('\n');

      // Call the onGenerated prop (which is handleExperienceChange)
      // with the correct arguments: index, field ('description'), and the new value
      onGenerated(index, 'description', updatedDescription);
    },
    onError: (error) => {
      alert(
        `AI Writer Failed: ${error.response?.data?.message || error.message}`
      );
    },
  });

  return (
    <Button
      variant="outline-primary"
      size="sm"
      onClick={() => mutation.mutate({ jobTitle, company })}
      disabled={mutation.isPending || !jobTitle || !company}
    >
      {mutation.isPending ? (
        <>
          <Spinner as="span" animation="border" size="sm" /> Generating...
        </>
      ) : (
        '✨ AI Writer'
      )}
    </Button>
  );
}

function ExperienceEditor({ experience, setExperience }) {
  // Ensure 'experience' is always an array, even if it's initially undefined or null.
  const currentExperience = experience || [];

  const handleAddExperience = () => {
    setExperience([
      ...currentExperience,
      {
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...currentExperience];
    updatedExperience[index] = {
      ...updatedExperience[index], // Preserve existing properties
      [field]: value,
    };
    setExperience(updatedExperience);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = currentExperience.filter((_, i) => i !== index);
    setExperience(updatedExperience);
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Work Experience</Card.Header>
      <Card.Body>
        {currentExperience.map((exp, index) => (
          <div key={index} className="mb-4 p-3 border rounded">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={exp.jobTitle || ''}
                    onChange={(e) =>
                      handleExperienceChange(index, 'jobTitle', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) =>
                      handleExperienceChange(index, 'company', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Jan 2022"
                    value={exp.startDate || ''}
                    onChange={(e) =>
                      handleExperienceChange(index, 'startDate', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Present"
                    value={exp.endDate || ''}
                    onChange={(e) =>
                      handleExperienceChange(index, 'endDate', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Remote"
                    value={exp.location || ''}
                    onChange={(e) =>
                      handleExperienceChange(index, 'location', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="mb-0">
                      Description / Achievements
                    </Form.Label>
                    <AIWriterButton
                      jobTitle={exp.jobTitle || ''}
                      company={exp.company || ''}
                      onGenerated={handleExperienceChange} // Correctly passes the parent's handler
                      index={index}
                      currentDescription={exp.description || ''}
                    />
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Describe your responsibilities and achievements, or use the AI Writer to generate bullet points for you."
                    value={exp.description || ''}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        'description',
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              variant="outline-danger"
              size="sm"
              className="mt-3"
              onClick={() => handleRemoveExperience(index)}
            >
              Remove Experience
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={handleAddExperience}>
          + Add Experience
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ExperienceEditor;
