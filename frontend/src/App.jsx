// src/App.jsx

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { SWRConfig } from 'swr';
import { useAuthStore } from './store/authStore';

// Styles
import './styles/global.css';
import './styles/navigation.css';
import './styles/resume-page.css';

// Components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResumesPage from './pages/ResumesPage';
import CreateResumePage from './pages/CreateResumePage';
import ResumeEditorPage from './pages/ResumeEditorPage';

// SWR configuration
const swrConfig = {
  revalidateOnFocus: false,
  retry: 1,
  dedupingInterval: 2000,
};

// Loading Component
const LoadingScreen = () => (
  <div className="rezi-loading-state">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <Navigate to="/resumes" replace /> : children;
};

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Check if initializeAuth is actually a function
    if (typeof initializeAuth !== 'function') {
      console.error('initializeAuth is not a function. Check your auth store.');
      return;
    }

    const unsubscribe = initializeAuth();

    // Cleanup function
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initializeAuth]);

  return (
    <SWRConfig value={swrConfig}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/resumes"
              element={
                <ProtectedRoute>
                  <ResumesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes/create/:step"
              element={
                <ProtectedRoute>
                  <CreateResumePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes/:resumeId/edit"
              element={
                <ProtectedRoute>
                  <ResumeEditorPage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/resumes" replace />} />
          </Routes>
        </div>
      </Router>
    </SWRConfig>
  );
}

export default App;
