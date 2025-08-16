// src/components/ResumeTabs.jsx

import React, { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import HeaderEditor from './HeaderEditor';
import SummaryEditor from './SummaryEditor';
import ExperienceEditor from './ExperienceEditor';
import EducationEditor from './EducationEditor';
import SkillsEditor from './SkillsEditor';

function ResumeTabs({ resumeData, onFieldChange, viewMode = 'split' }) {
  const [activeTab, setActiveTab] = useState('header');

  // Dynamic styles based on view mode
  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const tabContentStyle = {
    flex: 1,
    overflowY: 'auto',
    height:
      viewMode === 'edit-only' ? 'calc(100vh - 200px)' : 'calc(100vh - 170px)',
    padding: 0,
  };

  const tabPaneStyle = {
    padding: '20px',
    height: 'auto',
    minHeight: '100%',
  };

  return (
    <div style={containerStyle}>
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="resume-nav-tabs">
          <Nav.Item>
            <Nav.Link eventKey="header">Contact Info</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="summary">
              Summary ✨<span className="ai-badge ms-1">AI</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="experience">Experience</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="education">Education</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="skills">Skills</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content style={tabContentStyle}>
          <Tab.Pane eventKey="header" style={tabPaneStyle}>
            <HeaderEditor
              header={resumeData.header}
              setHeader={(data) => onFieldChange('header', data)}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="summary" style={tabPaneStyle}>
            <SummaryEditor
              summary={resumeData.summary}
              setSummary={(data) => onFieldChange('summary', data)}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="experience" style={tabPaneStyle}>
            <ExperienceEditor
              experience={resumeData.experience}
              setExperience={(data) => onFieldChange('experience', data)}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="education" style={tabPaneStyle}>
            <EducationEditor
              education={resumeData.education}
              setEducation={(data) => onFieldChange('education', data)}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="skills" style={tabPaneStyle}>
            <SkillsEditor
              skills={resumeData.skills}
              setSkills={(data) => onFieldChange('skills', data)}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default ResumeTabs;
