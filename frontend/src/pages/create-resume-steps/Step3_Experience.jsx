import React from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const Step3_Experience = ({ formData, setFormData, onContinue, onBack }) => {
  const handleChange = (index, e) => {
    const newExperience = [...(formData.experience || [])];
    newExperience[index][e.target.name] = e.target.value;
    setFormData({ ...formData, experience: newExperience });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...(formData.experience || []),
        { company: '', role: '', startDate: '', endDate: '', description: '' },
      ],
    });
  };

  const removeExperience = (index) => {
    const newExperience = [...(formData.experience || [])];
    newExperience.splice(index, 1);
    setFormData({ ...formData, experience: newExperience });
  };

  return (
    <div>
      <h3>Step 3: Work Experience</h3>
      {(formData.experience || []).map((exp, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={exp.role}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="startDate"
                    value={exp.startDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="endDate"
                    value={exp.endDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={exp.description}
                onChange={(e) => handleChange(index, e)}
              />
            </Form.Group>
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeExperience(index)}
              className="mt-2"
            >
              Remove
            </Button>
          </Card.Body>
        </Card>
      ))}
      <Button
        variant="outline-primary"
        onClick={addExperience}
        className="mb-3"
      >
        Add Experience
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

export default Step3_Experience;
