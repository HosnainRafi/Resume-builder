import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResumeById, updateResume, shareResume } from '../api/resumes';
import { Button, Spinner, Alert, Card } from 'react-bootstrap';
import { pdf } from '@react-pdf/renderer';

// --- Import NEW Layout CSS ---
import '../EditorLayout.css'; // This controls the new Rezi-style layout

// --- Import the Tabbed Editor Component ---
import ResumeTabs from '../components/ResumeTabs';

// --- Import Other Helper Components ---
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
import ClassicTemplatePreview from '../components/ClassicTemplate';
import ModernTemplatePreview from '../components/ModernTemplate';
import TechModernPreview from '../components/TechModernPreview';
import ElegantMinimalistPreview from '../components/ElegantMinimalistPreview';
import CreativeColorSplashPreview from '../components/CreativeColorSplashPreview';
import ProfessionalCorporatePreview from '../components/ProfessionalCorporatePreview';
import StudentEntryLevelPreview from '../components/StudentEntryLevelPreview';
import InfographicVisualPreview from '../components/InfographicVisualPreview';
import ModernExecutivePreview from '../components/ModernExecutivePreview';

// --- Import ALL HTML/CSS Live Preview Templates ---

// --- Master List of All Available Templates ---
const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    component: ClassicTemplate, // HTML preview
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

  const handleShare = async () => {
    if (!resumeData) return;
    try {
      const { link } = await shareResume({
        resumeId,
        template: selectedTemplateId,
      });
      await navigator.clipboard.writeText(link);
      alert(`Share link copied to clipboard:\n${link}`);
    } catch (err) {
      alert('Failed to create share link.', err);
    }
  };

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
    <div className="editor-page-wrapper">
      <header className="editor-header">
        <h2>Editing: {resumeData?.title || 'New Resume'}</h2>
        <div>
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/resumes')}
            className="me-2"
          >
            Back
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="success"
            className="ms-2"
            onClick={handleDownloadPDF}
          >
            Download
          </Button>
          <Button variant="info" className="ms-2" onClick={handleShare}>
            Share
          </Button>
        </div>
      </header>

      <main className="editor-main-layout">
        {/* Left Panel: Editor */}
        <div className="editor-forms-panel">
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

          {/* The New Tabbed Editing Interface */}
          {resumeData && (
            <ResumeTabs
              resumeData={resumeData}
              onFieldChange={handleFieldChange}
            />
          )}
        </div>

        {/* Right Panel: Live HTML Preview */}
        <aside className="editor-preview-panel">{renderPreview()}</aside>
      </main>
    </div>
  );
}

export default ResumeEditorPage;
