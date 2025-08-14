import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/auth';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      // On success, redirect to login page with a success message
      navigate('/login?signup=success');
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Card style={{ width: '24rem' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {mutation.isError && (
            <Alert variant="danger">
              {mutation.error.response?.data?.error?.message ||
                'An error occurred'}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              disabled={mutation.isPending}
              className="w-100 mt-3"
              type="submit"
            >
              {mutation.isPending ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                'Sign Up'
              )}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          Already have an account? <Link to="/login">Log In</Link>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default SignupPage;
