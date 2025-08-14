import React from 'react';
import { Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { generateDescription } from '../api/ai'; // <-- Import the new AI function

// This is a small, reusable component for the AI button
function GenerateButton({ jobTitle, company, onGenerated, index }) {
  const mutation = useMutation({
    mutationFn: generateDescription,
    onSuccess: (generatedDescription) => {
      onGenerated(index, 'description', generatedDescription);
    },
    onError: (error) => {
      alert(`AI Generation Failed: ${error.message}`);
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
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          {' Generating...'}
        </>
      ) : (
        '✨ Generate with AI'
      )}
    </Button>
  );
}

function ExperienceEditor({ experience, setExperience }) {
  const handleAddExperience = () => {
    setExperience([
      ...experience,
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
    const updatedExperience = [...experience];
    updatedExperience[index][field] = value;
    setExperience(updatedExperience);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    setExperience(updatedExperience);
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Work Experience</Card.Header>
      <Card.Body>
        {experience.map((exp, index) => (
          <div key={index} className="mb-4 p-3 border rounded">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={exp.jobTitle}
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
                    value={exp.company}
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
                    value={exp.startDate}
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
                    value={exp.endDate}
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
                    value={exp.location}
                    onChange={(e) =>
                      handleExperienceChange(index, 'location', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  {/* FIX: Add a flex container for the label and AI button */}
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="mb-0">Description</Form.Label>
                    <GenerateButton
                      jobTitle={exp.jobTitle}
                      company={exp.company}
                      onGenerated={handleExperienceChange}
                      index={index}
                    />
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Describe your responsibilities and achievements, or let our AI generate it for you!"
                    value={exp.description}
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
