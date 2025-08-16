import React from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

function EducationEditor({ education, setEducation }) {
  // Ensure 'education' is always an array, even if it's initially undefined or null.
  // This prevents the "Cannot read properties of undefined (reading 'map')" error.
  const currentEducation = education || [];

  const handleAddEducation = () => {
    // When adding, use currentEducation to ensure it's an array
    setEducation([
      ...currentEducation,
      { institution: '', degree: '', location: '', graduationDate: '' },
    ]);
  };

  const handleEducationChange = (index, field, value) => {
    // When changing, use currentEducation to ensure it's an array
    const updatedEducation = [...currentEducation];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const handleRemoveEducation = (index) => {
    // When removing, use currentEducation to ensure it's an array
    const updatedEducation = currentEducation.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Education</Card.Header>
      <Card.Body>
        {/* Use currentEducation for mapping to prevent errors */}
        {currentEducation.map((edu, index) => (
          <div key={index} className="mb-4 p-3 border rounded">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Institution</Form.Label>
                  <Form.Control
                    type="text"
                    // Provide a fallback empty string for the value to avoid undefined values
                    value={edu.institution || ''}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        'institution',
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Degree</Form.Label>
                  <Form.Control
                    type="text"
                    value={edu.degree || ''} // Fallback empty string
                    onChange={(e) =>
                      handleEducationChange(index, 'degree', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Graduation Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., May 2021"
                    value={edu.graduationDate || ''} // Fallback empty string
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        'graduationDate',
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., New York, NY"
                    value={edu.location || ''} // Fallback empty string
                    onChange={(e) =>
                      handleEducationChange(index, 'location', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              variant="outline-danger"
              size="sm"
              className="mt-3"
              onClick={() => handleRemoveEducation(index)}
            >
              Remove Education
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={handleAddEducation}>
          + Add Education
        </Button>
      </Card.Body>
    </Card>
  );
}

export default EducationEditor;
