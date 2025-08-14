import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSharedResume } from '../api/resumes';
import { PDFViewer } from '@react-pdf/renderer';
import ClassicTemplate from '../components/ClassicTemplate';
import ModernTemplate from '../components/ModernTemplate';

function ShareResumePage() {
  const { token } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sharedResume', token],
    queryFn: () => getSharedResume(token),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Resume not found or link expired.</p>;

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
