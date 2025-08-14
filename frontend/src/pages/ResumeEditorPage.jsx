import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResumeById, updateResume } from '../api/resumes';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { pdf } from '@react-pdf/renderer';

// --- Form Editing Components ---
import HeaderEditor from '../components/HeaderEditor';
import ExperienceEditor from '../components/ExperienceEditor';
import EducationEditor from '../components/EducationEditor';
import SkillsEditor from '../components/SkillsEditor';
import ProjectsEditor from '../components/ProjectsEditor';
import KeywordAnalyzer from '../components/KeywordAnalyzer';
import ResumeScorecard from '../components/ResumeScorecard';

// --- Import ALL PDF Generation Templates (for "Download PDF") ---
import ClassicTemplate from '../components/ClassicTemplate';
import ModernTemplate from '../components/ModernTemplate';
import TechModernTemplate from '../components/TechModernTemplate';
import ElegantMinimalistTemplate from '../components/ElegantMinimalistTemplate';
import CreativeColorSplashTemplate from '../components/CreativeColorSplashTemplate';
import ProfessionalCorporateTemplate from '../components/ProfessionalCorporateTemplate';
import StudentEntryLevelTemplate from '../components/StudentEntryLevelTemplate';
import InfographicVisualTemplate from '../components/InfographicVisualTemplate';
import ModernExecutiveTemplate from '../components/ModernExecutiveTemplate';

// --- Import ALL HTML/CSS Live Preview Templates ---

import ClassicTemplatePreview from '../components/ClassicTemplate';
import ModernTemplatePreview from '../components/ModernTemplate';
import TechModernPreview from '../components/TechModernPreview';
import ElegantMinimalistPreview from '../components/ElegantMinimalistPreview';
import CreativeColorSplashPreview from '../components/CreativeColorSplashPreview';
import ProfessionalCorporatePreview from '../components/ProfessionalCorporatePreview';
import StudentEntryLevelPreview from '../components/StudentEntryLevelPreview';
import InfographicVisualPreview from '../components/InfographicVisualPreview';
import ModernExecutivePreview from '../components/ModernExecutivePreview';

// --- Master List of All Available Templates ---
const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    component: ClassicTemplatePreview,
    pdf: ClassicTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    component: ModernTemplatePreview,
    pdf: ModernTemplate,
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    component: TechModernPreview,
    pdf: TechModernTemplate,
  },
  {
    id: 'elegant-minimalist',
    name: 'Minimalist',
    component: ElegantMinimalistPreview,
    pdf: ElegantMinimalistTemplate,
  },
  {
    id: 'creative-colorsplash',
    name: 'Creative',
    component: CreativeColorSplashPreview,
    pdf: CreativeColorSplashTemplate,
  },
  {
    id: 'professional-corporate',
    name: 'Corporate',
    component: ProfessionalCorporatePreview,
    pdf: ProfessionalCorporateTemplate,
  },
  {
    id: 'student-entry-level',
    name: 'Student',
    component: StudentEntryLevelPreview,
    pdf: StudentEntryLevelTemplate,
  },
  {
    id: 'infographic-visual',
    name: 'Infographic',
    component: InfographicVisualPreview,
    pdf: InfographicVisualTemplate,
  },
  {
    id: 'modern-executive',
    name: 'Executive',
    component: ModernExecutivePreview,
    pdf: ModernExecutiveTemplate,
  },
];

function ResumeEditorPage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic');

  const {
    data: initialResume,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResumeById(resumeId),
    enabled: !!resumeId,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (initialResume) setResumeData(initialResume);
  }, [initialResume]);
  const updateMutation = useMutation({
    mutationFn: (d) => updateResume({ resumeId, resumeData: d }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] }),
  });

  const handleSave = () => updateMutation.mutate(resumeData);
  const handleFieldChange = (field, value) =>
    setResumeData((prev) => ({ ...prev, [field]: value }));

  const handleDownloadPDF = async () => {
    if (!resumeData) return;
    const currentTemplate =
      TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
    const PdfComponent = currentTemplate.pdf;
    const doc = <PdfComponent resumeData={resumeData} />;

    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.title || 'resume'}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  //   const handleShare = async () => {
  //     /* ... same as before ... */
  //   };

  const renderPreview = () => {
    if (!resumeData) return null;
    const currentTemplate =
      TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
    const PreviewComponent = currentTemplate.component;
    return <PreviewComponent resumeData={resumeData} />;
  };

  if (isLoading) return <Spinner animation="border" className="m-5" />;
  if (isError) return <Alert variant="danger">Error loading resume.</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Editing: {resumeData?.title || 'New Resume'}</h2>
        <div>
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/resumes')}
            className="me-2"
          >
            Back to List
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="success"
            className="ms-2"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
          {/* <Button variant="info" className="ms-2" onClick={handleShare}>
            Share Resume
          </Button> */}
        </div>
      </div>

      <div className="editor-layout" style={{ display: 'flex', gap: '2rem' }}>
        <div className="editor-forms" style={{ flex: 1, minWidth: 0 }}>
          <Card className="mb-4">
            <Card.Header as="h5">Templates</Card.Header>
            <Card.Body className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
              {TEMPLATES.map((template) => (
                <Button
                  key={template.id}
                  variant={
                    selectedTemplateId === template.id
                      ? 'primary'
                      : 'outline-secondary'
                  }
                  size="sm"
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  {template.name}
                </Button>
              ))}
            </Card.Body>
          </Card>

          <ResumeScorecard resumeId={resumeId} />
          <KeywordAnalyzer resumeId={resumeId} />

          {resumeData && (
            <>
              <HeaderEditor
                header={resumeData.header}
                setHeader={(v) => handleFieldChange('header', v)}
              />
              <ExperienceEditor
                experience={resumeData.experience}
                setExperience={(v) => handleFieldChange('experience', v)}
              />
              <EducationEditor
                education={resumeData.education}
                setEducation={(v) => handleFieldChange('education', v)}
              />
              <SkillsEditor
                skills={resumeData.skills}
                setSkills={(v) => handleFieldChange('skills', v)}
              />
              <ProjectsEditor
                projects={resumeData.projects}
                setProjects={(v) => handleFieldChange('projects', v)}
              />
            </>
          )}
        </div>

        <div
          className="editor-preview-container"
          style={{
            flex: 1.2,
            backgroundColor: '#e9ecef',
            padding: '1rem',
            overflowY: 'auto',
            height: 'calc(100vh - 100px)',
          }}
        >
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}

export default ResumeEditorPage;
