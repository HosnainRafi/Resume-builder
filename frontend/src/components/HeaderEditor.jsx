import React from 'react';
import { Form, Card, Row, Col } from 'react-bootstrap';

function HeaderEditor({ header, setHeader }) {
  const handleChange = (field, value) => {
    setHeader({ ...header, [field]: value });
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Header Information</Card.Header>
      <Card.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={header.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={header.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="(123) 456-7890"
                value={header.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Website/Portfolio</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://your-portfolio.com"
                value={header.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default HeaderEditor;
