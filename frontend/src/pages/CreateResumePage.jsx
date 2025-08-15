// src/pages/CreateResumePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, ProgressBar } from 'react-bootstrap';
import { mutate } from 'swr';
import apiClient from '../api/apiClient';

// Import your step components
import Step1_Header from './create-resume-steps/Step1_Header';
import Step2_Summary from './create-resume-steps/Step2_Summary';
// ... other step imports

const TOTAL_STEPS = 7;

function CreateResumePage() {
  const { step } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(step || '1', 10);

  const [formData, setFormData] = useState({
    title: 'Untitled Resume',
    header: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isNaN(currentStep) || currentStep < 1 || currentStep > TOTAL_STEPS) {
      navigate('/resumes/create/1');
    }
  }, [currentStep, navigate]);

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      navigate(`/resumes/create/${currentStep + 1}`);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      navigate(`/resumes/create/${currentStep - 1}`);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const finalData = {
        ...formData,
        title: formData.header?.name
          ? `${formData.header.name}'s Resume`
          : 'Untitled Resume',
      };

      await apiClient.post('/resumes', finalData);

      // Revalidate the resumes cache
      mutate('/resumes');

      alert('Resume created successfully!');
      navigate('/resumes');
    } catch (error) {
      alert(`Error creating resume: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const props = {
      formData,
      setFormData,
      onContinue: handleNextStep,
      onBack: handlePrevStep,
      onSubmit: handleSubmit,
      isSubmitting,
    };

    switch (currentStep) {
      case 1:
        return <Step1_Header {...props} />;
      case 2:
        return <Step2_Summary {...props} />;
      // ... other cases
      default:
        return <Step1_Header {...props} />;
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <Container className="mt-5 mb-5">
      <Card>
        <Card.Header>
          <h4>
            Create Your Resume (Step {currentStep} of {TOTAL_STEPS})
          </h4>
          <ProgressBar now={progress} />
        </Card.Header>
        <Card.Body>{renderStepContent()}</Card.Body>
      </Card>
    </Container>
  );
}

export default CreateResumePage;
