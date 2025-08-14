import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResumeById, updateResume } from '../api/resumes';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';

function ResumeEditorPage() {
  // --- FIX: Ensure we destructure 'resumeId' to match the route parameter ---
  const { resumeId } = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  // This query now receives the correct, defined 'resumeId'
  const {
    data: resume,
    isLoading,
    isError,
    status,
  } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResumeById(resumeId),
    // Only run this query if resumeId is a valid, non-undefined value
    enabled: !!resumeId,
  });

  useEffect(() => {
    if (resume) {
      setTitle(resume.title);
    }
  }, [resume]);

  const updateMutation = useMutation({
    mutationFn: (updatedData) => {
      if (!resumeId) throw new Error('Resume ID is missing.');
      return updateResume({ resumeId, resumeData: updatedData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const handleSave = () => {
    if (!resumeId) {
      console.error('Cannot save, resume ID is missing.');
      return;
    }
    updateMutation.mutate({ title });
  };

  // Handle loading and error states more gracefully
  if (status === 'pending' || isLoading) {
    return (
      <Container className="text-center pt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (status === 'error' || isError) {
    return (
      <Container className="pt-5">
        <Alert variant="danger">
          Error loading resume. It might have been deleted or an error occurred.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Editing Resume</h2>
        <div>
          <Button
            variant="secondary"
            onClick={() => navigate('/resumes')}
            className="me-2"
          >
            Back to List
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Resume Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
      </Form>
      {/* Additional editor sections will be added here */}
    </Container>
  );
}

export default ResumeEditorPage;
