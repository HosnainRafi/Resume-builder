import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Make sure index.css is imported
import './index.css';

// Components and Pages
import ResumeHeader from './components/ResumeHeader';
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
        {/* FIX: Wrap the entire app in our new layout container */}
        <div className="app-container">
          <ResumeHeader />

          {/* FIX: Wrap the routes in a <main> tag that can grow */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/resumes" element={<ResumesPage />} />
                <Route
                  path="/resumes/:resumeId/edit"
                  element={<ResumeEditorPage />}
                />
              </Route>

              {/* Root redirect logic */}
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
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
