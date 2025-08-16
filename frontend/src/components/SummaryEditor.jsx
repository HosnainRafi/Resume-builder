// src/components/SummaryEditor.jsx

import React from 'react';
import { Card, Form } from 'react-bootstrap';
import AIResumeSummaryGenerator from './AIResumeSummaryGenerator';

function SummaryEditor({ summary, setSummary }) {
  const handleSummaryGenerated = (generatedSummary) => {
    setSummary(generatedSummary);
  };

  return (
    <div>
      <AIResumeSummaryGenerator
        currentSummary={summary}
        onSummaryGenerated={handleSummaryGenerated}
      />

      <Card className="mb-4">
        <Card.Header as="h5">Professional Summary</Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write a brief summary of your professional background and key qualifications..."
              value={summary || ''}
              onChange={(e) => setSummary(e.target.value)}
            />
            <Form.Text className="text-muted">
              2-4 sentences highlighting your experience, skills, and career
              objectives.
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SummaryEditor;
