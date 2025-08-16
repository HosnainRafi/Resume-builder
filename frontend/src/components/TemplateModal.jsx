// src/components/TemplateModal.jsx

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { PDFViewer } from '@react-pdf/renderer';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import TechModernTemplate from './TechModernTemplate';

function TemplateModal({ show, onClose, onConfirm, template, resumeData }) {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate resumeData={resumeData} />;
      case 'tech-modern':
        return <TechModernTemplate resumeData={resumeData} />;
      case 'classic':
      default:
        return <ClassicTemplate resumeData={resumeData} />;
    }
  };

  const getTemplateName = () => {
    switch (template) {
      case 'modern':
        return 'Modern';
      case 'tech-modern':
        return 'Tech Modern';
      case 'classic':
      default:
        return 'Classic';
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Preview {getTemplateName()} Template</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: '500px' }}>
        <PDFViewer width="100%" height="100%">
          {renderTemplate()}
        </PDFViewer>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onConfirm(template)}>
          Use This Template
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TemplateModal;
