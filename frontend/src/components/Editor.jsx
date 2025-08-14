// frontend/src/components/Editor.jsx

import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

// Import your other components
import ResumeForm from './ResumeForm'; // Assuming you have this
import ResumePreview from './ResumePreview';

const Editor = () => {
  // 1. Create a ref for the component we want to print
  const componentRef = useRef();

  // 2. Set up the hook
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'My_Resume',
  });

  return (
    <main className="main-content editor-layout">
      <div className="editor-controls">
        <h2>Resume Controls</h2>
        <button onClick={handlePrint}>Download as PDF</button>
        {/* You could add save buttons or template selectors here */}
      </div>

      <div className="resume-form-container">
        {/* Your form for inputs goes here */}
        <ResumeForm />
      </div>

      <div className="resume-preview-container">
        {/* 3. Pass the ref to the ResumePreview component */}
        <ResumePreview ref={componentRef} />
      </div>
    </main>
  );
};

export default Editor;
