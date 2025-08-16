// src/pages/create-resume-steps/Step7_Finalize.jsx

import React from 'react';
import { Button, Card, Row, Col, Alert } from 'react-bootstrap';

const Step7_Finalize = ({ formData, onSubmit, onBack, isSubmitting }) => {
  return (
    <Card>
      <Card.Header as="h5">Review & Finalize</Card.Header>
      <Card.Body>
        <p className="text-muted mb-4">
          Review your resume information below and click "Create Resume" when
          you're ready to finish.
        </p>

        <Alert variant="info">
          <strong>Almost done!</strong> Your resume will be created and you'll
          be able to edit it further, choose templates, and download it as a
          PDF.
        </Alert>

        <Row>
          <Col md={6}>
            <h6>Personal Information</h6>
            <p>
              <strong>Name:</strong> {formData.header?.name || 'Not provided'}
            </p>
            <p>
              <strong>Email:</strong> {formData.header?.email || 'Not provided'}
            </p>
            <p>
              <strong>Phone:</strong> {formData.header?.phone || 'Not provided'}
            </p>
          </Col>
          <Col md={6}>
            <h6>Summary</h6>
            <p>{formData.summary || 'No summary provided'}</p>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <h6>Experience</h6>
            <p>{formData.experience?.length || 0} experience entries</p>
          </Col>
          <Col md={6}>
            <h6>Education</h6>
            <p>{formData.education?.length || 0} education entries</p>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <h6>Skills</h6>
            <p>{formData.skills?.length || 0} skills listed</p>
          </Col>
          <Col md={6}>
            <h6>Projects</h6>
            <p>{formData.projects?.length || 0} projects listed</p>
          </Col>
        </Row>

        <div className="mt-4 text-center">
          <Button
            variant="success"
            size="lg"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Resume...' : 'Create My Resume'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Step7_Finalize;
