import React from 'react';
import { Form, Button } from 'react-bootstrap';

const Step2_Summary = ({ formData, setFormData, onContinue, onBack }) => (
  <div>
    <h3>Step 2: Professional Summary</h3>
    <p>Write a 2-3 sentence summary about your professional self.</p>
    <Form.Group className="mb-3">
      <Form.Control
        as="textarea"
        rows={4}
        name="summary"
        value={formData.summary || ''}
        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
      />
    </Form.Group>
    <Button variant="secondary" onClick={onBack} className="me-2">
      Back
    </Button>
    <Button onClick={onContinue}>Continue</Button>
  </div>
);

export default Step2_Summary;
