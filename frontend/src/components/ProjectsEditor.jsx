import React from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

// This is the clean version of the component, with no refs or state loops.
function ProjectsEditor({ projects, setProjects }) {
  const handleAddProject = () => {
    // Ensure we don't add to a null or undefined array
    const currentProjects = Array.isArray(projects) ? projects : [];
    setProjects([
      ...currentProjects,
      { name: '', description: '', technologies: '', link: '' },
    ]);
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Projects</Card.Header>
      <Card.Body>
        {/* Ensure we only map if 'projects' is an array */}
        {Array.isArray(projects) &&
          projects.map((proj, index) => (
            <div key={index} className="mb-4 p-3 border rounded">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={proj.name || ''}
                      onChange={(e) =>
                        handleProjectChange(index, 'name', e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Link</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="https://github.com/..."
                      value={proj.link || ''}
                      onChange={(e) =>
                        handleProjectChange(index, 'link', e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Technologies Used</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., React, Express, MongoDB"
                      value={proj.technologies || ''}
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          'technologies',
                          e.target.value
                        )
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={proj.description || ''}
                      onChange={(e) =>
                        handleProjectChange(
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
                onClick={() => handleRemoveProject(index)}
              >
                Remove Project
              </Button>
            </div>
          ))}
        <Button variant="secondary" onClick={handleAddProject}>
          + Add Project
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProjectsEditor;
