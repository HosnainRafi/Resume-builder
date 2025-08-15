// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { useAuthStore } from '../store/authStore';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// Mutation function for login
async function loginUser(url, { arg }) {
  const { login, email, password } = arg;
  return await login(email, password);
}

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuthStore(); // Get the login function from the store
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const signupSuccess = searchParams.get('signup') === 'success';

  const { trigger, isMutating, error } = useSWRMutation('/login', loginUser, {
    onSuccess: () => {
      // On successful login, Firebase's onAuthStateChanged will handle
      // updating the user state. We just need to redirect.
      navigate('/resumes');
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the login function and credentials to the mutation
    trigger({
      login,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {signupSuccess && (
            <Alert variant="success">Signup successful! Please log in.</Alert>
          )}
          {error && (
            <Alert variant="danger">
              {error.message || 'Invalid login credentials. Please try again.'}
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
                value={formData.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                required
                onChange={handleChange}
                value={formData.password}
              />
            </Form.Group>
            <Button disabled={isMutating} className="w-100 mt-3" type="submit">
              {isMutating ? <Spinner animation="border" size="sm" /> : 'Log In'}
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;
