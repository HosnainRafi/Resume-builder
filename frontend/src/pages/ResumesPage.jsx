import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResumes, createResume, deleteResume } from '../api/resumes';
import {
  Container,
  Button,
  Card,
  Spinner,
  Alert,
  ListGroup,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function ResumesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const {
    data: resumes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['resumes'],
    queryFn: getResumes,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createResume({
        title: 'Untitled Resume',
        header: { name: user.name, email: user.email },
      }),
    onSuccess: (newResume) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      // --- FIX: Add a guard to ensure we have an ID before navigating ---
      if (newResume && newResume._id) {
        navigate(`/resumes/${newResume._id}/edit`);
      } else {
        // Handle the case where the new resume object or its ID is missing
        console.error(
          'Failed to create resume or get a valid ID from the server.',
          newResume
        );
        alert(
          'Sorry, something went wrong while creating your resume. Please try again.'
        );
      }
    },
    onError: (error) => {
      // --- NEW: Explicitly handle API errors ---
      console.error('Error creating resume:', error);
      alert(
        `Could not create resume: ${error.message || 'Please check the server and try again.'}`
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  return (
    <Container className="pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Your Resumes</h1>
        <Button
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : '+ New Resume'}
        </Button>
      </div>

      {isLoading && <Spinner animation="border" />}
      {isError && <Alert variant="danger">Error: {error.message}</Alert>}

      {resumes && resumes.length > 0 ? (
        <ListGroup>
          {resumes.map((resume) => (
            <ListGroup.Item
              key={resume._id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{resume.title}</h5>
                <small className="text-muted">
                  Last updated:{' '}
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </small>
              </div>
              <div>
                <Button
                  as={Link}
                  to={`/resumes/${resume._id}/edit`}
                  variant="primary"
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteMutation.mutate(resume._id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        !isLoading && (
          <Card body>
            You don't have any resumes yet. Create one to get started!
          </Card>
        )
      )}
    </Container>
  );
}

export default ResumesPage;
