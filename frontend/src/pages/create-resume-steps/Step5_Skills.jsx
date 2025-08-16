// src/pages/create-resume-steps/Step5_Skills.jsx

import React from 'react';
import { Card } from 'react-bootstrap';
import SkillsEditor from '../../components/SkillsEditor';

const Step5_Skills = ({ formData, setFormData }) => {
  const handleSkillsChange = (newSkills) => {
    setFormData({
      ...formData,
      skills: newSkills,
    });
  };

  return (
    <Card>
      <Card.Header as="h5">Skills</Card.Header>
      <Card.Body>
        <p className="text-muted mb-4">
          Add your relevant technical and soft skills. Focus on skills that are
          most relevant to your target job.
        </p>

        <SkillsEditor
          skills={formData.skills || []}
          setSkills={handleSkillsChange}
        />
      </Card.Body>
    </Card>
  );
};

export default Step5_Skills;
