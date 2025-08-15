// src/pages/ResumeEditorPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import { pdf } from '@react-pdf/renderer';
import apiClient from '../api/apiClient'; // Using the consistent apiClient

// --- Import Your Components & CSS ---
import '../EditorLayout.css';
import ResumeTabs from '../components/ResumeTabs';
import KeywordAnalyzer from '../components/KeywordAnalyzer';
import ResumeScorecard from '../components/ResumeScorecard';
import DraggableTemplateWrapper from '../components/DraggableTemplateWrapper';

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

// --- Custom mutation hook for SWR ---
function useAsyncMutation(mutationFn, options = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async (variables) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: mutateAsync, isLoading, error };
}

// --- Master Template Configuration ---
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

// Fetcher function for SWR
const fetcher = (url) => apiClient.get(url).then((res) => res.data.data);

function ResumeEditorPage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  // State for the editor UI
  const [formData, setFormData] = useState(null); // Initialize as null
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic');
  const [viewMode, setViewMode] = useState('traditional'); // 'traditional' or 'draggable'

  // --- Data Fetching with SWR ---
  const {
    data: initialResumeData,
    error,
    isLoading,
  } = useSWR(resumeId ? `/api/resumes/${resumeId}` : null, fetcher);

  // --- State Synchronization ---
  // This effect runs once the initial data is fetched successfully.
  // It copies the fetched data into our local 'formData' state for editing.
  useEffect(() => {
    if (initialResumeData) {
      setFormData(initialResumeData);
      // Also set the template based on the saved resume data
      setSelectedTemplateId(initialResumeData.template || 'classic');
    }
  }, [initialResumeData]);

  // --- Data Mutation ---
  const updateMutation = useAsyncMutation(
    (updatedData) => apiClient.patch(`/api/resumes/${resumeId}`, updatedData),
    {
      onSuccess: () => {
        // Revalidate the cache for this specific resume
        mutate(`/api/resumes/${resumeId}`);
        // Also revalidate the resumes list
        mutate('/api/resumes');
        alert('Resume saved successfully!');
      },
      onError: (err) => {
        alert(`Failed to save resume: ${err.message}`);
      },
    }
  );

  // --- Event Handlers ---
  const handleSave = () => {
    if (formData) {
      // Include the selected template ID in the data to be saved
      updateMutation.mutate({ ...formData, template: selectedTemplateId });
    }
  };

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

  // --- Loading and Error States ---
  // This is the most important part: handle loading and error states *before* rendering the main UI.
  if (isLoading) {
    return <div className="rezi-loading">Loading Editor...</div>;
  }

  if (error) {
    return (
      <div className="rezi-error">Error loading resume: {error.message}</div>
    );
  }

  // If data has not yet been set to local state, show a loading message.
  // This prevents child components from receiving 'null' as a prop.
  if (!formData) {
    return <div className="rezi-loading">Initializing...</div>;
  }

  // --- Main Render ---
  // Now that we know `formData` is populated, we can safely render the editor.
  const currentTemplate =
    TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
  const PreviewComponent = currentTemplate.component;

  return (
    <div className="rezi-page-wrapper">
      <header className="rezi-header">
        <h1 className="rezi-title">Editing: {formData.title}</h1>
        <div className="rezi-actions">
          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('traditional')}
              className={`rezi-btn ${
                viewMode === 'traditional'
                  ? 'rezi-btn-primary'
                  : 'rezi-btn-secondary'
              }`}
            >
              📄 Templates
            </button>
            <button
              onClick={() => setViewMode('draggable')}
              className={`rezi-btn ${
                viewMode === 'draggable'
                  ? 'rezi-btn-primary'
                  : 'rezi-btn-secondary'
              }`}
            >
              🔄 Drag & Drop
            </button>
          </div>
          <button
            className="rezi-btn rezi-btn-primary"
            onClick={handleSave}
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Saving...' : '💾 Save'}
          </button>
          <button
            className="rezi-btn rezi-btn-success"
            onClick={handleDownloadPDF}
          >
            📥 Download PDF
          </button>
          <button
            className="rezi-btn rezi-btn-secondary"
            onClick={() => navigate('/resumes')}
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="rezi-main-content">
        {viewMode === 'traditional' ? (
          // --- Traditional Two-Panel Layout ---
          <div className="rezi-editor-container">
            <div className="rezi-editor-panel">
              {/* All your editor tools go here */}
              <ResumeTabs resumeData={formData} onFieldChange={setFormData} />
              <ResumeScorecard resumeId={resumeId} />
              <KeywordAnalyzer resumeId={resumeId} />
            </div>
            <div className="rezi-preview-panel">
              {/* Template selector and preview */}
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="template-dropdown"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="rezi-preview-document">
                <PreviewComponent resumeData={formData} />
              </div>
            </div>
          </div>
        ) : (
          // --- Draggable Full-Width Layout ---
          <div className="rezi-full-editor">
            <DraggableTemplateWrapper
              resumeData={formData}
              onResumeDataChange={setFormData}
              TemplateComponent={PreviewComponent}
              templateName={currentTemplate.name}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default ResumeEditorPage;
