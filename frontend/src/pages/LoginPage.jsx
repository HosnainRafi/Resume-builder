import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const signupSuccess = searchParams.get('signup') === 'success';

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.data.user, data.data.accessToken);
      navigate('/dashboard'); // Redirect to a protected dashboard page on success
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
          <h2 className="text-center mb-4">Log In</h2>
          {signupSuccess && (
            <Alert variant="success">Signup successful! Please log in.</Alert>
          )}
          {mutation.isError && (
            <Alert variant="danger">
              {mutation.error.response?.data?.error?.message ||
                'An error occurred'}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
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
                'Log In'
              )}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          Need an account? <Link to="/signup">Sign Up</Link>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default LoginPage;
