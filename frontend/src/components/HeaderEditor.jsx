import React from 'react';
import { Form, Card, Row, Col } from 'react-bootstrap';

function HeaderEditor({ header, setHeader }) {
  // Ensure header is an object, even if initially undefined
  const currentHeader = header || {};

  const handleChange = (field, value) => {
    setHeader({ ...currentHeader, [field]: value });
  };

  return (
    <Card className="mb-3">
      <Card.Header>Header Information</Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your Name"
            value={currentHeader.name || ''} // Use currentHeader and provide a fallback empty string
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="your.email@example.com"
            value={currentHeader.email || ''} // Provide fallback
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="e.g., (123) 456-7890"
            value={currentHeader.phone || ''} // Provide fallback
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Website/Portfolio</Form.Label>
          <Form.Control
            type="url"
            placeholder="e.g., https://yourportfolio.com"
            value={currentHeader.website || ''} // Provide fallback
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default HeaderEditor;
