import React from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const Step6_Projects = ({ formData, setFormData, onContinue, onBack }) => {
  const handleChange = (index, e) => {
    const newProjects = [...(formData.projects || [])];
    newProjects[index][e.target.name] = e.target.value;
    setFormData({ ...formData, projects: newProjects });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...(formData.projects || []),
        { name: '', description: '', url: '' },
      ],
    });
  };

  const removeProject = (index) => {
    const newProjects = [...(formData.projects || [])];
    newProjects.splice(index, 1);
    setFormData({ ...formData, projects: newProjects });
  };

  return (
    <div>
      <h3>Step 6: Projects</h3>
      {(formData.projects || []).map((proj, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Form.Group>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={proj.name}
                onChange={(e) => handleChange(index, e)}
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={proj.description}
                onChange={(e) => handleChange(index, e)}
              />
            </Form.Group>
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeProject(index)}
              className="mt-2"
            >
              Remove
            </Button>
          </Card.Body>
        </Card>
      ))}
      <Button variant="outline-primary" onClick={addProject} className="mb-3">
        Add Project
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

export default Step6_Projects;
