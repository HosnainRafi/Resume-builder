import React, { useState } from 'react';
import { Form, Button, Badge, Stack } from 'react-bootstrap';

const Step5_Skills = ({ formData, setFormData, onContinue, onBack }) => {
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAddSkill = () => {
    if (currentSkill && !(formData.skills || []).includes(currentSkill)) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), currentSkill],
      });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: (formData.skills || []).filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  return (
    <div>
      <h3>Step 5: Skills</h3>
      <Form.Group className="mb-3">
        <Form.Label>Add your skills one by one</Form.Label>
        <div className="d-flex">
          <Form.Control
            type="text"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
          />
          <Button onClick={handleAddSkill} className="ms-2">
            Add
          </Button>
        </div>
      </Form.Group>
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        {(formData.skills || []).map((skill) => (
          <Badge
            key={skill}
            pill
            bg="primary"
            style={{ cursor: 'pointer' }}
            onClick={() => handleRemoveSkill(skill)}
          >
            {skill} &times;
          </Badge>
        ))}
      </Stack>
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default Step5_Skills;
