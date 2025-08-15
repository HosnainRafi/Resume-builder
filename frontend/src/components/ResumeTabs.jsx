import React, { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import './ReziForms.css';

// Import your editor components
import HeaderEditor from './HeaderEditor';
import ExperienceEditor from './ExperienceEditor';
import EducationEditor from './EducationEditor';
import SkillsEditor from './SkillsEditor';
import ProjectsEditor from './ProjectsEditor';

const SECTIONS = [
  {
    eventKey: 'contact',
    title: '👤 Contact',
    icon: '👤',
    component: HeaderEditor,
    propName: 'header',
    setterName: 'setHeader',
  },
  {
    eventKey: 'experience',
    title: '💼 Experience',
    icon: '💼',
    component: ExperienceEditor,
    propName: 'experience',
    setterName: 'setExperience',
  },
  {
    eventKey: 'education',
    title: '🎓 Education',
    icon: '🎓',
    component: EducationEditor,
    propName: 'education',
    setterName: 'setEducation',
  },
  {
    eventKey: 'skills',
    title: '⚡ Skills',
    icon: '⚡',
    component: SkillsEditor,
    propName: 'skills',
    setterName: 'setSkills',
  },
  {
    eventKey: 'projects',
    title: '🚀 Projects',
    icon: '🚀',
    component: ProjectsEditor,
    propName: 'projects',
    setterName: 'setProjects',
  },
];

function ResumeTabs({ resumeData, onFieldChange }) {
  const [activeTab, setActiveTab] = useState('contact');
  const [completedSections, setCompletedSections] = useState(new Set());

  // Check if section is completed based on data
  const isSectionCompleted = (section) => {
    if (!resumeData) return false;
    const data = resumeData[section.propName];

    switch (section.propName) {
      case 'header':
        return data && data.name && data.email;
      case 'experience':
      case 'education':
      case 'projects':
        return Array.isArray(data) && data.length > 0;
      case 'skills':
        return Array.isArray(data) && data.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="rezi-card">
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <div className="rezi-tabs-header">
          <Nav variant="pills" className="rezi-nav-tabs">
            {SECTIONS.map((section) => {
              const isCompleted = isSectionCompleted(section);
              return (
                <Nav.Item key={section.eventKey}>
                  <Nav.Link
                    eventKey={section.eventKey}
                    className={`rezi-tab-link ${isCompleted ? 'completed' : ''}`}
                  >
                    <span className="rezi-tab-icon">{section.icon}</span>
                    <span className="rezi-tab-text">
                      {section.title.replace(/^[^\s]+ /, '')}
                    </span>
                    {isCompleted && <span className="rezi-tab-check">✓</span>}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
          <div className="rezi-progress-bar">
            <div
              className="rezi-progress-fill"
              style={{
                width: `${(completedSections.size / SECTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <Tab.Content className="rezi-tab-content">
          {SECTIONS.map((section) => {
            const EditorComponent = section.component;
            const data = resumeData?.[section.propName];
            const setter = (value) => onFieldChange(section.propName, value);

            return (
              <Tab.Pane key={section.eventKey} eventKey={section.eventKey}>
                <div className="rezi-section-content">
                  <EditorComponent
                    {...{
                      [section.propName]: data,
                      [section.setterName]: setter,
                    }}
                  />
                </div>
              </Tab.Pane>
            );
          })}
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default ResumeTabs;
