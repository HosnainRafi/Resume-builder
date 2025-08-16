// src/components/ResumeTabs.jsx

import React, { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import HeaderEditor from './HeaderEditor';
import SummaryEditor from './SummaryEditor'; // Updated with AI generator
import ExperienceEditor from './ExperienceEditor';
import EducationEditor from './EducationEditor';
import SkillsEditor from './SkillsEditor';

function ResumeTabs({ resumeData, onFieldChange }) {
  const [activeTab, setActiveTab] = useState('header');

  return (
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

      <Tab.Content>
        <Tab.Pane eventKey="header">
          <HeaderEditor
            header={resumeData.header}
            setHeader={(data) => onFieldChange('header', data)}
          />
        </Tab.Pane>
        <Tab.Pane eventKey="summary">
          <SummaryEditor
            summary={resumeData.summary}
            setSummary={(data) => onFieldChange('summary', data)}
          />
        </Tab.Pane>
        <Tab.Pane eventKey="experience">
          <ExperienceEditor
            experience={resumeData.experience}
            setExperience={(data) => onFieldChange('experience', data)}
          />
        </Tab.Pane>
        <Tab.Pane eventKey="education">
          <EducationEditor
            education={resumeData.education}
            setEducation={(data) => onFieldChange('education', data)}
          />
        </Tab.Pane>
        <Tab.Pane eventKey="skills">
          <SkillsEditor
            skills={resumeData.skills}
            setSkills={(data) => onFieldChange('skills', data)}
          />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
}

export default ResumeTabs;
