import React from 'react';
import { Button } from 'react-bootstrap';

const Step7_Finalize = ({ onSubmit, onBack }) => (
  <div>
    <h3>Step 7: Finalize</h3>
    <p>You're all set! Click the button below to create your resume.</p>
    <div className="d-flex justify-content-between">
      <Button variant="secondary" onClick={onBack}>
        Back
      </Button>
      <Button variant="primary" onClick={onSubmit}>
        Create Resume
      </Button>
    </div>
  </div>
);

export default Step7_Finalize;
