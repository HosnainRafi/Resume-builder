// src/pages/ResumeEditorPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import { pdf } from '@react-pdf/renderer';
import apiClient from '../api/apiClient';

// --- Import Components ---
import '../EditorLayout.css';
import ResumeTabs from '../components/ResumeTabs';
import KeywordAnalyzer from '../components/KeywordAnalyzer';
import ResumeScorecard from '../components/ResumeScorecard';
import LivePreviewPane from '../components/LivePreviewPane'; // New component
import PreviewToolbar from '../components/PreviewToolbar'; // New component

// --- Import All Templates ---
import ClassicTemplate from '../components/ClassicTemplate';
import ModernTemplate from '../components/ModernTemplate';
import TechModernTemplate from '../components/TechModernTemplate';
import ElegantMinimalistTemplate from '../components/ElegantMinimalistTemplate';
import CreativeColorSplashTemplate from '../components/CreativeColorSplashTemplate';
import ProfessionalCorporateTemplate from '../components/ProfessionalCorporateTemplate';
import StudentEntryLevelTemplate from '../components/StudentEntryLevelTemplate';
import InfographicVisualTemplate from '../components/InfographicVisualTemplate';
import ModernExecutiveTemplate from '../components/ModernExecutiveTemplate';

const DEFAULT_RESUME_STRUCTURE = {
  title: 'Untitled Resume',
  header: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    website: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  template: 'classic',
  sectionOrder: [
    'header',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
  ], // Add section order
};

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    component: ClassicTemplate,
    pdf: ClassicTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    component: ModernTemplate,
    pdf: ModernTemplate,
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    component: TechModernTemplate,
    pdf: TechModernTemplate,
  },
  {
    id: 'elegant-minimalist',
    name: 'Elegant Minimalist',
    component: ElegantMinimalistTemplate,
    pdf: ElegantMinimalistTemplate,
  },
  {
    id: 'creative-colorsplash',
    name: 'Creative Color Splash',
    component: CreativeColorSplashTemplate,
    pdf: CreativeColorSplashTemplate,
  },
  {
    id: 'professional-corporate',
    name: 'Professional Corporate',
    component: ProfessionalCorporateTemplate,
    pdf: ProfessionalCorporateTemplate,
  },
  {
    id: 'student-entry-level',
    name: 'Student Entry Level',
    component: StudentEntryLevelTemplate,
    pdf: StudentEntryLevelTemplate,
  },
  {
    id: 'infographic-visual',
    name: 'Infographic Visual',
    component: InfographicVisualTemplate,
    pdf: InfographicVisualTemplate,
  },
  {
    id: 'modern-executive',
    name: 'Modern Executive',
    component: ModernExecutiveTemplate,
    pdf: ModernExecutiveTemplate,
  },
];

function useAsyncMutation(mutationFn, options = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async (variables) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutationFn(variables);
      if (options.onSuccess) options.onSuccess(result);
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) options.onError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: mutateAsync, isLoading, error };
}

const fetcher = (url) => apiClient.get(url).then((res) => res.data.data);

function ResumeEditorPage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'preview-only', 'edit-only'
  const [previewScale, setPreviewScale] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    data: initialResumeData,
    error,
    isLoading,
  } = useSWR(resumeId ? `/api/resumes/${resumeId}` : null, fetcher);

  useEffect(() => {
    if (initialResumeData) {
      const mergedData = {
        ...DEFAULT_RESUME_STRUCTURE,
        ...initialResumeData,
        header: {
          ...DEFAULT_RESUME_STRUCTURE.header,
          ...(initialResumeData.header || {}),
        },
        experience: initialResumeData.experience || [],
        education: initialResumeData.education || [],
        skills: initialResumeData.skills || [],
        projects: initialResumeData.projects || [],
        sectionOrder:
          initialResumeData.sectionOrder ||
          DEFAULT_RESUME_STRUCTURE.sectionOrder,
        template:
          initialResumeData.template || DEFAULT_RESUME_STRUCTURE.template,
      };
      setFormData(mergedData);
      setSelectedTemplateId(mergedData.template);
    }
  }, [initialResumeData]);

  const updateMutation = useAsyncMutation(
    (updatedData) => apiClient.patch(`/api/resumes/${resumeId}`, updatedData),
    {
      onSuccess: () => {
        mutate(`/api/resumes/${resumeId}`);
        mutate('/api/resumes');
      },
      onError: (err) => console.error('Failed to save resume:', err),
    }
  );

  // Auto-save functionality
  useEffect(() => {
    if (!formData || !resumeId) return;

    const timeoutId = setTimeout(() => {
      updateMutation.mutate({ ...formData, template: selectedTemplateId });
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, selectedTemplateId, resumeId]);

  const handleDownloadPDF = async () => {
    if (!formData) return;
    try {
      const currentTemplate =
        TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
      const PdfComponent = currentTemplate.pdf;
      const doc = <PdfComponent resumeData={formData} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.title || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleSectionReorder = (newSectionOrder) => {
    setFormData((prev) => ({ ...prev, sectionOrder: newSectionOrder }));
  };

  if (isLoading) {
    return (
      <div className="rezi-loading-container">
        <div className="rezi-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading Resume Editor...</p>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="rezi-error-container">
        <div className="rezi-error">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error loading resume</h4>
            <p>{error?.message || 'Failed to load resume data'}</p>
            <button
              className="btn btn-outline-danger"
              onClick={() => navigate('/resumes')}
            >
              Return to Resumes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentTemplate =
    TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  return (
    <div
      className={`rezi-editor-workspace ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {/* Enhanced Header */}
      <header className="rezi-editor-header">
        <div className="rezi-header-left">
          <button
            className="rezi-back-btn"
            onClick={() => navigate('/resumes')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H6m0 0l6 6m-6-6l6-6" />
            </svg>
          </button>
          <div className="rezi-title-section">
            <h1 className="rezi-title">{formData.title}</h1>
            <span className="rezi-subtitle">
              {updateMutation.isLoading ? 'Auto-saving...' : 'Saved'}
            </span>
          </div>
        </div>

        <div className="rezi-header-center">
          <div className="rezi-view-controls">
            <button
              className={`rezi-view-btn ${viewMode === 'edit-only' ? 'active' : ''}`}
              onClick={() => setViewMode('edit-only')}
            >
              📝 Edit
            </button>
            <button
              className={`rezi-view-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
            >
              📊 Split
            </button>
            <button
              className={`rezi-view-btn ${viewMode === 'preview-only' ? 'active' : ''}`}
              onClick={() => setViewMode('preview-only')}
            >
              👁️ Preview
            </button>
          </div>
        </div>

        <div className="rezi-header-right">
          <div className="rezi-actions">
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="rezi-template-select"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              className="rezi-btn rezi-btn-outline"
              onClick={handleDownloadPDF}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="rezi-editor-main">
        {viewMode === 'edit-only' && (
          <div className="rezi-edit-panel">
            <ResumeTabs
              resumeData={formData}
              onFieldChange={(field, data) => {
                setFormData((prev) => ({ ...prev, [field]: data }));
              }}
            />
            <div className="rezi-analysis-tools">
              <ResumeScorecard resumeId={resumeId} />
              <KeywordAnalyzer resumeId={resumeId} />
            </div>
          </div>
        )}

        {viewMode === 'split' && (
          <div className="rezi-split-layout">
            <div className="rezi-edit-sidebar">
              <ResumeTabs
                resumeData={formData}
                onFieldChange={(field, data) => {
                  setFormData((prev) => ({ ...prev, [field]: data }));
                }}
              />
              <div className="rezi-analysis-tools-compact">
                <ResumeScorecard resumeId={resumeId} />
                <KeywordAnalyzer resumeId={resumeId} />
              </div>
            </div>
            <div className="rezi-preview-area">
              <PreviewToolbar
                scale={previewScale}
                onScaleChange={setPreviewScale}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                template={currentTemplate}
                onTemplateChange={setSelectedTemplateId}
              />
              <LivePreviewPane
                resumeData={formData}
                template={currentTemplate}
                scale={previewScale}
                onSectionReorder={handleSectionReorder}
                isEditable={true}
              />
            </div>
          </div>
        )}

        {viewMode === 'preview-only' && (
          <div className="rezi-preview-full">
            <PreviewToolbar
              scale={previewScale}
              onScaleChange={setPreviewScale}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              template={currentTemplate}
              onTemplateChange={setSelectedTemplateId}
            />
            <LivePreviewPane
              resumeData={formData}
              template={currentTemplate}
              scale={previewScale}
              onSectionReorder={handleSectionReorder}
              isEditable={true}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default ResumeEditorPage;
