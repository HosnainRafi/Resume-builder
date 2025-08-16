// src/pages/create-resume-steps/Step3_Experience.jsx

import React from 'react';
import { Card } from 'react-bootstrap';
import ExperienceEditor from '../../components/ExperienceEditor';

const Step3_Experience = ({ formData, setFormData }) => {
  const handleExperienceChange = (newExperience) => {
    setFormData({
      ...formData,
      experience: newExperience,
    });
  };

  return (
    <Card>
      <Card.Header as="h5">Work Experience</Card.Header>
      <Card.Body>
        <p className="text-muted mb-4">
          Add your relevant work experience, starting with your most recent
          position.
        </p>

        <ExperienceEditor
          experience={formData.experience || []}
          setExperience={handleExperienceChange}
        />
      </Card.Body>
    </Card>
  );
};

export default Step3_Experience;
