// src/components/ResumeHeader.jsx

import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';

// Logout mutation function
const logoutUser = async (url) => {
  // Assuming you have a logout API endpoint
  // If logout is handled entirely by Firebase/auth store, you can skip the API call
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  return response.ok;
};

function ResumeHeader() {
  const { user, logout: logoutFromStore } = useAuthStore();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const { trigger: handleLogout, isMutating: isLoggingOut } = useSWRMutation(
    '/logout',
    logoutUser,
    {
      onSuccess: () => {
        logoutFromStore(); // Clear auth state
        mutate(() => true, undefined, { revalidate: false }); // Clear all SWR cache
        navigate('/login');
      },
    }
  );

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      <Container fluid className="px-md-4">
        <Navbar.Brand as={Link} to={isAuthenticated ? '/resumes' : '/'}>
          AI Resume Builder
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Signed in as: {user?.name}
                </Navbar.Text>
                <Button
                  variant="outline-light"
                  onClick={() => handleLogout()}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ResumeHeader;
