// src/pages/create-resume-steps/Step6_Projects.jsx

import React from 'react';
import { Card } from 'react-bootstrap';
import ProjectsEditor from '../../components/ProjectsEditor';

const Step6_Projects = ({ formData, setFormData }) => {
  const handleProjectsChange = (newProjects) => {
    setFormData({
      ...formData,
      projects: newProjects,
    });
  };

  return (
    <Card>
      <Card.Header as="h5">Projects</Card.Header>
      <Card.Body>
        <p className="text-muted mb-4">
          Showcase your key projects, including personal projects, work
          projects, or academic projects that demonstrate your skills.
        </p>

        <ProjectsEditor
          projects={formData.projects || []}
          setProjects={handleProjectsChange}
        />
      </Card.Body>
    </Card>
  );
};

export default Step6_Projects;
