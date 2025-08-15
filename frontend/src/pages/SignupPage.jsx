// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { useAuthStore } from '../store/authStore';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

// Signup mutation function
async function signupUser(url, { arg }) {
  const { signup, email, password } = arg;
  return await signup(email, password);
}

function SignupPage() {
  // FIX: Ensure the state correctly holds name, email, and password
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { signup } = useAuthStore(); // Get the signup function from the store

  const { trigger, isMutating, error } = useSWRMutation('/signup', signupUser, {
    onSuccess: () => {
      // Redirect to the login page on successful signup
      navigate('/login?signup=success');
    },
    onError: (error) => {
      // The store handles the error, but we can log it here if needed
      console.error('Signup failed:', error);
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    trigger({
      signup,
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
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && (
            <Alert variant="danger">
              {/* Display a user-friendly error from Firebase */}
              {error.message || 'An error occurred during signup.'}
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
                value={formData.name}
              />
            </Form.Group>
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
              {isMutating ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Sign Up'
              )}
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SignupPage;
