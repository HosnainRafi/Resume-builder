import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/auth';

function ResumeHeader() {
  const { isAuthenticated, clearAuth, user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      {/* FIX: Use a fluid container to make the navbar background span the full width */}
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
                  onClick={() => logoutMutation.mutate()}
                >
                  Logout
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
