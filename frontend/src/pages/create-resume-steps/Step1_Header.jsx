import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const Step1_Header = ({ formData, setFormData, onContinue }) => {
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      header: { ...prev.header, [e.target.name]: e.target.value },
    }));
  };

  return (
    <div>
      <h3>Step 1: Header</h3>
      <p>This information will appear at the top of your resume.</p>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.header?.name || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.header?.email || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.header?.phone || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Location (e.g., City, State)</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.header?.location || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button onClick={onContinue}>Continue</Button>
    </div>
  );
};

export default Step1_Header;
