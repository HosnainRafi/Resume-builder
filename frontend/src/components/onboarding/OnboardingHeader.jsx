import React from 'react';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const OnboardingHeader = () => {
  return (
    <div className="onboarding-header">
      <div className="header-left">
        <Link to="/resumes" className="back-link">
          <ArrowLeft size={20} />
          Back to Resumes
        </Link>
        <h1>Create New Resume</h1>
      </div>

      <div className="header-right">
        <div className="save-indicator saved">
          <Save size={16} />
          All changes saved
        </div>
        <div className="user-menu">
          <User size={20} />
        </div>
      </div>
    </div>
  );
};

export default OnboardingHeader;
