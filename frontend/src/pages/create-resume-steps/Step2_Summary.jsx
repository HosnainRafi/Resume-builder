// src/pages/create-resume-steps/Step2_Summary.jsx

import React from 'react';
import { Form, Card } from 'react-bootstrap';
import AIResumeSummaryGenerator from '../../components/AIResumeSummaryGenerator';

const Step2_Summary = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      summary: e.target.value,
    });
  };

  const handleAIGenerated = (generatedSummary) => {
    setFormData({
      ...formData,
      summary: generatedSummary,
    });
  };

  return (
    <Card>
      <Card.Header as="h5">Professional Summary</Card.Header>
      <Card.Body>
        <p className="text-muted mb-4">
          Write a compelling summary that highlights your key qualifications and
          career objectives.
        </p>

        <AIResumeSummaryGenerator
          currentSummary={formData.summary || ''}
          onSummaryGenerated={handleAIGenerated}
        />

        <Form.Group className="mt-3">
          <Form.Label>Professional Summary</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Write a brief overview of your professional background, key skills, and career goals..."
            value={formData.summary || ''}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            Aim for 2-4 sentences that capture your professional brand and value
            proposition.
          </Form.Text>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default Step2_Summary;
