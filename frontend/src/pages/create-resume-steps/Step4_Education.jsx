import React from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const Step4_Education = ({ formData, setFormData, onContinue, onBack }) => {
  const handleChange = (index, e) => {
    const newEducation = [...(formData.education || [])];
    newEducation[index][e.target.name] = e.target.value;
    setFormData({ ...formData, education: newEducation });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...(formData.education || []),
        { institution: '', degree: '', fieldOfStudy: '', graduationYear: '' },
      ],
    });
  };

  const removeEducation = (index) => {
    const newEducation = [...(formData.education || [])];
    newEducation.splice(index, 1);
    setFormData({ ...formData, education: newEducation });
  };

  return (
    <div>
      <h3>Step 4: Education</h3>
      {(formData.education || []).map((edu, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Institution</Form.Label>
                  <Form.Control
                    type="text"
                    name="institution"
                    value={edu.institution}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Degree</Form.Label>
                  <Form.Control
                    type="text"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeEducation(index)}
              className="mt-2"
            >
              Remove
            </Button>
          </Card.Body>
        </Card>
      ))}
      <Button variant="outline-primary" onClick={addEducation} className="mb-3">
        Add Education
      </Button>
      <div className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default Step4_Education;
