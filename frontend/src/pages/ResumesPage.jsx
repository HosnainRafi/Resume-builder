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
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['resumes'],
    queryFn: getResumes,
  });

  const resumes = response?.data;

  const createMutation = useMutation({
    mutationFn: () =>
      createResume({
        title: 'Untitled Resume',
        header: { name: user.name, email: user.email },
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      const newResume = response?.data;
      if (newResume && newResume.id) {
        navigate(`/resumes/${newResume.id}/edit`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  return (
    // FIX: Use a Container with vertical padding (py-5) to center the content
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header
          as="h5"
          className="p-3 d-flex justify-content-between align-items-center"
        >
          Your Resumes
          <Button
            variant="primary"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              '+ New Resume'
            )}
          </Button>
        </Card.Header>

        {isLoading && (
          <Card.Body className="text-center p-5">
            <Spinner animation="border" />
          </Card.Body>
        )}
        {isError && (
          <Alert variant="danger" className="m-3">
            Error: {error.message}
          </Alert>
        )}

        {resumes && resumes.length > 0 ? (
          <ListGroup variant="flush">
            {resumes.map((resume) => (
              <ListGroup.Item
                key={resume.id}
                className="p-3 d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{resume.title}</h6>
                  <small className="text-muted">
                    Last updated:{' '}
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </small>
                </div>
                <div>
                  <Button
                    as={Link}
                    to={`/resumes/${resume.id}/edit`}
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteMutation.mutate(resume.id)}
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
            <Card.Body className="text-muted text-center p-5">
              You don't have any resumes yet. Create one to get started!
            </Card.Body>
          )
        )}
      </Card>
    </Container>
  );
}

export default ResumesPage;
