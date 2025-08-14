import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResumeById, updateResume } from '../api/resumes';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print'; // <-- Import the hook

// Import editor components
import HeaderEditor from '../components/HeaderEditor';
import ExperienceEditor from '../components/ExperienceEditor';
import EducationEditor from '../components/EducationEditor';
import SkillsEditor from '../components/SkillsEditor';
import ProjectsEditor from '../components/ProjectsEditor';
import ResumeTemplate from '../components/ResumeTemplate'; // <-- Import the template

function ResumeEditorPage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [resumeData, setResumeData] = useState(null);
  const componentRef = useRef(); // <-- Create a ref for the template

  // Configure the print hook
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: () => resumeData?.title || 'resume',
  });

  const {
    data: initialResume,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResumeById(resumeId),
    enabled: !!resumeId,
  });

  useEffect(() => {
    if (initialResume) {
      setResumeData(initialResume);
    }
  }, [initialResume]);

  const updateMutation = useMutation({
    mutationFn: (updatedData) =>
      updateResume({ resumeId, resumeData: updatedData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(resumeData);
  };

  const handleFieldChange = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <Spinner animation="border" className="m-5" />;
  if (isError) return <Alert variant="danger">Error loading resume.</Alert>;
  if (!resumeData) return null;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Editing: {resumeData.title}</h2>
        <div>
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/resumes')}
            className="me-2"
          >
            Back to List
          </Button>
          {/* Add the Download PDF button */}
          <Button variant="success" onClick={handlePrint} className="me-2">
            Download PDF
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* ... All editor components remain the same ... */}
      <HeaderEditor
        header={resumeData.header}
        setHeader={(newHeader) => handleFieldChange('header', newHeader)}
      />
      <ExperienceEditor
        experience={resumeData.experience}
        setExperience={(newExperience) =>
          handleFieldChange('experience', newExperience)
        }
      />
      <EducationEditor
        education={resumeData.education}
        setEducation={(newEducation) =>
          handleFieldChange('education', newEducation)
        }
      />
      <SkillsEditor
        skills={resumeData.skills}
        setSkills={(newSkills) => handleFieldChange('skills', newSkills)}
      />
      <ProjectsEditor
        projects={resumeData.projects}
        setProjects={(newProjects) =>
          handleFieldChange('projects', newProjects)
        }
      />

      {/* Render the template component but keep it hidden */}
      <div style={{ display: 'none' }}>
        <ResumeTemplate ref={componentRef} resumeData={resumeData} />
      </div>
    </>
  );
}

export default ResumeEditorPage;
