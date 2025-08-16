// src/pages/create-resume-steps/Step4_Education.jsx

import React from 'react';
import { Card } from 'react-bootstrap';
import EducationEditor from '../../components/EducationEditor';

const Step4_Education = ({ formData, setFormData }) => {
  const handleEducationChange = (newEducation) => {
    setFormData({
      ...formData,
      education: newEducation,
    });
  };

  return (
    <Card>
      <Card.Header as="h5">Education</Card.Header>
      <Card.Body>
        <p className="text-muted mb-4">
          Add your educational background, starting with your highest degree or
          most recent education.
        </p>

        <EducationEditor
          education={formData.education || []}
          setEducation={handleEducationChange}
        />
      </Card.Body>
    </Card>
  );
};

export default Step4_Education;
