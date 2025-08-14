import React, { useState } from 'react';
import { Form, Card, Badge, Button } from 'react-bootstrap';

function SkillsEditor({ skills, setSkills }) {
  // State to manage the text in the input field as the user types
  const [currentInput, setCurrentInput] = useState('');

  // Function to add the current input text as a new skill
  const handleAddSkill = () => {
    const newSkill = currentInput.trim();
    // Only add the skill if it's not empty and not already in the list
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
    }
    // Clear the input field after adding
    setCurrentInput('');
  };

  // Handle key presses in the input field
  const handleKeyDown = (e) => {
    // When the user presses Enter or Comma, add the skill
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); // Prevent form submission or typing a literal comma
      handleAddSkill();
    }
  };

  // Function to remove a skill when the 'x' on a badge is clicked
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Skills</Card.Header>
      <Card.Body>
        <Form.Group>
          <Form.Label>Add your skills</Form.Label>
          {/* This div acts as our custom tag input field */}
          <div className="border p-2 rounded d-flex flex-wrap align-items-center">
            {/* Map over the existing skills and render them as badges */}
            {skills.map((skill, index) => (
              <Badge
                key={index}
                pill
                bg="primary"
                className="me-2 mb-1 d-flex align-items-center"
                style={{ fontSize: '0.9em', padding: '0.5em 0.8em' }}
              >
                {skill}
                <Button
                  variant="close"
                  aria-label="Remove"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ms-2"
                  style={{ fontSize: '0.6em' }}
                />
              </Badge>
            ))}
            {/* The actual input field for typing new skills */}
            <Form.Control
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a skill and press Enter"
              className="border-0 flex-grow-1"
              style={{ boxShadow: 'none', minWidth: '150px' }} // Prevents focus outline
            />
          </div>
          <Form.Text className="text-muted">
            Press Enter or comma to add a skill. Click the 'x' on a skill to
            remove it.
          </Form.Text>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default SkillsEditor;
