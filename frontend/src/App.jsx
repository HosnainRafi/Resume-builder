import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// Components and Pages
import Layout from './components/Layout'; // <-- Import the new Layout
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResumesPage from './pages/ResumesPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes have their own simple layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes are wrapped by the new Layout component */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/resumes" element={<ResumesPage />} />
              <Route
                path="/resumes/:resumeId/edit"
                element={<ResumeEditorPage />}
              />
            </Route>
          </Route>

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/resumes" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
