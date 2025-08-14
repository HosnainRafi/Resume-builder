import React from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

function EducationEditor({ education, setEducation }) {
  const handleAddEducation = () => {
    setEducation([
      ...education,
      { institution: '', degree: '', location: '', graduationDate: '' },
    ]);
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Education</Card.Header>
      <Card.Body>
        {education.map((edu, index) => (
          <div key={index} className="mb-4 p-3 border rounded">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Institution</Form.Label>
                  <Form.Control
                    type="text"
                    value={edu.institution}
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
                    value={edu.degree}
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
                    value={edu.graduationDate}
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
                    value={edu.location}
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
