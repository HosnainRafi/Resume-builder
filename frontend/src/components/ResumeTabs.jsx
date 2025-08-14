import React, { useState } from 'react';
import { Nav, Tab, Card } from 'react-bootstrap';

// Import all your editor components
import HeaderEditor from './HeaderEditor';
import ExperienceEditor from './ExperienceEditor';
import EducationEditor from './EducationEditor';
import SkillsEditor from './SkillsEditor';
import ProjectsEditor from './ProjectsEditor';

// Define the sections for our tabs
const SECTIONS = [
  {
    eventKey: 'contact',
    title: 'Contact',
    component: HeaderEditor,
    propName: 'header',
    setterName: 'setHeader',
  },
  {
    eventKey: 'experience',
    title: 'Experience',
    component: ExperienceEditor,
    propName: 'experience',
    setterName: 'setExperience',
  },
  {
    eventKey: 'projects',
    title: 'Projects',
    component: ProjectsEditor,
    propName: 'projects',
    setterName: 'setProjects',
  },
  {
    eventKey: 'education',
    title: 'Education',
    component: EducationEditor,
    propName: 'education',
    setterName: 'setEducation',
  },
  {
    eventKey: 'skills',
    title: 'Skills',
    component: SkillsEditor,
    propName: 'skills',
    setterName: 'setSkills',
  },
];

function ResumeTabs({ resumeData, onFieldChange }) {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    // The main card now serves as the container for the tabs
    <Card className="resume-tabs-card">
      <Tab.Container
        id="resume-editor-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Card.Header className="p-0">
          <Nav variant="tabs" className="rezi-nav-tabs">
            {SECTIONS.map((section) => (
              <Nav.Item key={section.eventKey}>
                <Nav.Link eventKey={section.eventKey}>{section.title}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Card.Header>

        <Card.Body className="p-0">
          <Tab.Content>
            {SECTIONS.map((section) => {
              const EditorComponent = section.component;
              const data = resumeData[section.propName];
              const setter = (value) => onFieldChange(section.propName, value);
              return (
                <Tab.Pane key={section.eventKey} eventKey={section.eventKey}>
                  {/* The editor component itself doesn't need its own card anymore */}
                  <EditorComponent
                    {...{
                      [section.propName]: data,
                      [section.setterName]: setter,
                    }}
                  />
                </Tab.Pane>
              );
            })}
          </Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}

export default ResumeTabs;
