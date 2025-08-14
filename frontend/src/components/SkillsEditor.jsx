import React from 'react';
import { Form, Card } from 'react-bootstrap';

function SkillsEditor({ skills, setSkills }) {
  const skillsText = skills.join(', ');

  const handleChange = (e) => {
    const skillsArray = e.target.value
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setSkills(skillsArray);
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Skills</Card.Header>
      <Card.Body>
        <Form.Group>
          <Form.Label>Comma-separated skills</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="e.g., React, Node.js, TypeScript, SQL"
            value={skillsText}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            Enter your skills separated by commas.
          </Form.Text>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default SkillsEditor;
