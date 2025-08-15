// src/pages/ShareResumePage.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { PDFViewer } from '@react-pdf/renderer';
import ClassicTemplate from '../components/ClassicTemplate';
import ModernTemplate from '../components/ModernTemplate';

// Fetcher function for shared resume
const getSharedResume = async (token) => {
  // Add your API call here when you implement the sharing functionality
  const response = await fetch(`/api/shared/${token}`);
  if (!response.ok) throw new Error('Resume not found');
  return response.json();
};

function ShareResumePage() {
  const { token } = useParams();

  const { data, error, isLoading } = useSWR(
    token ? `/shared/${token}` : null,
    () => getSharedResume(token)
  );

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Resume not found or link expired.</p>;

  return (
    <div style={{ height: '100vh' }}>
      <PDFViewer width="100%" height="100%" showToolbar>
        {data.template === 'modern' ? (
          <ModernTemplate resumeData={data.resumeData} />
        ) : (
          <ClassicTemplate resumeData={data.resumeData} />
        )}
      </PDFViewer>
    </div>
  );
}

export default ShareResumePage;
