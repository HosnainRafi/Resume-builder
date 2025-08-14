import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ResumeHeader from './ResumeHeader';

function Layout() {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <ResumeHeader />
      <main className="flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
        <Container fluid className="py-5">
          {/* The Outlet will render the current page (e.g., ResumesPage) */}
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

export default Layout;
