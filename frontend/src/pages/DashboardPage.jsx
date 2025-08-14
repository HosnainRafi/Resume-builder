import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Button, Container } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../api/auth';

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      // The ProtectedRoute component will handle the redirect
    },
  });

  return (
    <Container className="pt-5">
      <h1>Welcome, {user?.name}!</h1>
      <p>You have successfully logged in. This is your dashboard.</p>
      <p>Your email: {user?.email}</p>
      <Button variant="danger" onClick={() => mutation.mutate()}>
        Log Out
      </Button>
    </Container>
  );
}

export default DashboardPage;
