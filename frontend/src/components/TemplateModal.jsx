import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { PDFViewer } from '@react-pdf/renderer';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';

function TemplateModal({ show, onClose, onConfirm, template, resumeData }) {
  const renderTemplate = () => {
    if (template === 'modern')
      return <ModernTemplate resumeData={resumeData} />;
    return <ClassicTemplate resumeData={resumeData} />;
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      centered
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Preview {template === 'modern' ? 'Modern' : 'Classic'} Template
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: '80vh' }}>
        <PDFViewer width="100%" height="100%" showToolbar>
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
