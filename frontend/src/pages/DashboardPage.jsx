// src/pages/DashboardPage.jsx

import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Button, Container } from 'react-bootstrap';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';

// Logout mutation function
const logoutUser = async (url) => {
  // If using API endpoint for logout
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  return response.ok;
};

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { trigger: handleLogout, isMutating: isLoggingOut } = useSWRMutation(
    '/logout',
    logoutUser,
    {
      onSuccess: () => {
        logout(); // Clear auth state
        mutate(() => true, undefined, { revalidate: false }); // Clear all SWR cache
        // The ProtectedRoute component will handle the redirect
      },
    }
  );

  return (
    <Container className="pt-5">
      <h1>Welcome, {user?.name}!</h1>
      <p>You have successfully logged in. This is your dashboard.</p>
      <p>Your email: {user?.email}</p>
      <Button
        variant="danger"
        onClick={() => handleLogout()}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? 'Logging out...' : 'Log Out'}
      </Button>
    </Container>
  );
}

export default DashboardPage;
