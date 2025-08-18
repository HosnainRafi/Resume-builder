// src/pages/ResumeEditorPage.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import { pdf } from '@react-pdf/renderer';
import apiClient from '../api/apiClient';

// --- Import Components ---
import '../EditorLayout.css';
import ResumeTabs from '../components/ResumeTabs';
import KeywordAnalyzer from '../components/KeywordAnalyzer';
import ResumeScorecard from '../components/ResumeScorecard';

// --- Import PDF Templates (for download) ---
import ClassicTemplate from '../components/ClassicTemplate';
import ModernTemplate from '../components/ModernTemplate';
import TechModernTemplate from '../components/TechModernTemplate';
import ElegantMinimalistTemplate from '../components/ElegantMinimalistTemplate';
import CreativeColorSplashTemplate from '../components/CreativeColorSplashTemplate';
import ProfessionalCorporateTemplate from '../components/ProfessionalCorporateTemplate';
import StudentEntryLevelTemplate from '../components/StudentEntryLevelTemplate';
import InfographicVisualTemplate from '../components/InfographicVisualTemplate';
import ModernExecutiveTemplate from '../components/ModernExecutiveTemplate';

// --- Import HTML Preview Components (for editor) ---
import ClassicTemplatePreview from '../components/ClassicTemplatePreview';
import CreativeColorSplashPreview from '../components/CreativeColorSplashPreview';
import ElegantMinimalistPreview from '../components/ElegantMinimalistPreview';
import InfographicVisualPreview from '../components/InfographicVisualPreview';
import ModernExecutivePreview from '../components/ModernExecutivePreview';
import ModernTemplatePreview from '../components/ModernTemplatePreview';
import TechModernPreview from '../components/TechModernPreview';
import ProfessionalCorporatePreview from '../components/ProfessionalCorporatePreview';
import StudentEntryLevelPreview from '../components/StudentEntryLevelPreview';

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
};

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    previewComponent: ClassicTemplatePreview,
    pdfComponent: ClassicTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    previewComponent: ModernTemplatePreview,
    pdfComponent: ModernTemplate,
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    previewComponent: TechModernPreview,
    pdfComponent: TechModernTemplate,
  },
  {
    id: 'elegant-minimalist',
    name: 'Elegant Minimalist',
    previewComponent: ElegantMinimalistPreview,
    pdfComponent: ElegantMinimalistTemplate,
  },
  {
    id: 'creative-colorsplash',
    name: 'Creative Color Splash',
    previewComponent: CreativeColorSplashPreview,
    pdfComponent: CreativeColorSplashTemplate,
  },
  {
    id: 'professional-corporate',
    name: 'Professional Corporate',
    previewComponent: ProfessionalCorporatePreview,
    pdfComponent: ProfessionalCorporateTemplate,
  },
  {
    id: 'student-entry-level',
    name: 'Student Entry Level',
    previewComponent: StudentEntryLevelPreview,
    pdfComponent: StudentEntryLevelTemplate,
  },
  {
    id: 'infographic-visual',
    name: 'Infographic Visual',
    previewComponent: InfographicVisualPreview,
    pdfComponent: InfographicVisualTemplate,
  },
  {
    id: 'modern-executive',
    name: 'Modern Executive',
    previewComponent: ModernExecutivePreview,
    pdfComponent: ModernExecutiveTemplate,
  },
];

// Enhanced debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

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
      if (err.response?.status === 429) {
        console.warn('Rate limited - save will be retried automatically');
        return;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: mutateAsync, isLoading, error };
}

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
  dedupingInterval: 10000,
  errorRetryCount: 1,
  errorRetryInterval: 5000,
};

const fetcher = (url) => apiClient.get(url).then((res) => res.data.data);

function ResumeEditorPage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic');
  const [viewMode, setViewMode] = useState('split'); // 'split' or 'edit-only'
  const [saveStatus, setSaveStatus] = useState('saved');
  const [showAnalysisMenu, setShowAnalysisMenu] = useState(false);
  const [templateManuallyChanged, setTemplateManuallyChanged] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isAdjustmentMode, setIsAdjustmentMode] = useState(false);

  // Refs for tracking save state
  const lastSavedData = useRef(null);
  const saveTimeoutRef = useRef(null);
  const hasUnsavedChanges = useRef(false);

  const toggleAdjustmentMode = () => {
    setIsAdjustmentMode(!isAdjustmentMode);
  };

  const {
    data: initialResumeData,
    error,
    isLoading,
  } = useSWR(resumeId ? `/api/resumes/${resumeId}` : null, fetcher, swrConfig);

  // 10-second debounce
  const debouncedFormData = useDebounce(formData, 10000);

  useEffect(() => {
    if (initialResumeData && !initialDataLoaded) {
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
        template:
          initialResumeData.template || DEFAULT_RESUME_STRUCTURE.template,
      };

      setFormData(mergedData);

      // Only set template from server data on initial load
      if (initialResumeData.template) {
        setSelectedTemplateId(initialResumeData.template);
      }

      lastSavedData.current = JSON.stringify(mergedData);
      hasUnsavedChanges.current = false;
      setInitialDataLoaded(true);
    }
  }, [initialResumeData, initialDataLoaded]);

  const updateMutation = useAsyncMutation(
    (updatedData) => apiClient.patch(`/api/resumes/${resumeId}`, updatedData),
    {
      onSuccess: (result) => {
        setSaveStatus('saved');
        const updatedDataString = JSON.stringify({
          ...debouncedFormData,
          template: selectedTemplateId,
        });
        lastSavedData.current = updatedDataString;
        hasUnsavedChanges.current = false;
        setTemplateManuallyChanged(false);
        mutate(`/api/resumes/${resumeId}`, result, false);
      },
      onError: (err) => {
        console.error('Failed to save resume:', err);
        if (err.response?.status !== 429) {
          setSaveStatus('error');
        }
      },
    }
  );

  // Conservative auto-save with debounce protection
  useEffect(() => {
    if (!debouncedFormData || !resumeId) return;

    const currentDataString = JSON.stringify({
      ...debouncedFormData,
      template: selectedTemplateId,
    });

    if (
      currentDataString === lastSavedData.current ||
      !hasUnsavedChanges.current
    ) {
      return;
    }

    if (updateMutation.isLoading) {
      return;
    }

    // Add small delay to prevent rapid template changes
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      console.log('Auto-saving resume changes...');
      setSaveStatus('saving');
      updateMutation.mutate({
        ...debouncedFormData,
        template: selectedTemplateId,
      });
    }, 500);
  }, [debouncedFormData, selectedTemplateId, resumeId, updateMutation]);

  const handleFieldChange = useCallback((field, data) => {
    setFormData((prev) => ({ ...prev, [field]: data }));
    hasUnsavedChanges.current = true;
    setSaveStatus('unsaved');
  }, []);

  const handleManualSave = useCallback(async () => {
    if (!formData || !resumeId || updateMutation.isLoading) return;

    try {
      setSaveStatus('saving');
      await updateMutation.mutate({
        ...formData,
        template: selectedTemplateId,
      });
    } catch (error) {
      console.error('Manual save failed:', error);
    }
  }, [formData, resumeId, selectedTemplateId, updateMutation]);

  const handleDownloadPDF = async () => {
    if (!formData) return;

    try {
      if (hasUnsavedChanges.current) {
        setSaveStatus('saving');
        await updateMutation.mutate({
          ...formData,
          template: selectedTemplateId,
        });
      }

      // Dynamic imports to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Look for the resume preview element (could be any template)
      const resumeElement =
        document.querySelector('.rezi-preview-container > div') ||
        document.querySelector('.editable-resume-wrapper');

      if (resumeElement) {
        // Hide any toolbars temporarily for PDF
        const toolbar = document.querySelector('.floating-toolbar');
        if (toolbar) toolbar.style.display = 'none';

        const canvas = await html2canvas(resumeElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: resumeElement.scrollWidth,
          height: resumeElement.scrollHeight,
        });

        // Show toolbar again
        if (toolbar) toolbar.style.display = 'block';

        const imgData = canvas.toDataURL('image/png');

        // Create PDF with proper dimensions
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${formData.title || 'resume'}.pdf`);
      } else {
        // Fallback to original PDF generation
        const currentTemplate =
          TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
        const PdfComponent = currentTemplate.pdfComponent;
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
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleTemplateChange = useCallback(
    (templateId) => {
      // Optimistic update - update UI immediately
      setSelectedTemplateId(templateId);
      setTemplateManuallyChanged(true);

      // Immediately update formData to prevent reversion
      setFormData((prev) => ({
        ...prev,
        template: templateId,
      }));

      // Mark as changed and trigger save
      hasUnsavedChanges.current = true;
      setSaveStatus('unsaved');

      // Update the "last saved" reference to prevent reversion during re-renders
      const updatedData = {
        ...formData,
        template: templateId,
      };
      lastSavedData.current = JSON.stringify(updatedData);

      console.log(`Template changed to: ${templateId}`);
    },
    [formData]
  );

  const toggleAnalysisMenu = () => {
    setShowAnalysisMenu(!showAnalysisMenu);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Loading and error states
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

  // Save status display
  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <>
            <div className="rezi-btn-spinner"></div>
            <span>Saving...</span>
          </>
        );
      case 'unsaved':
        return (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Unsaved Changes</span>
          </>
        );
      case 'error':
        return (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>Save Error</span>
          </>
        );
      default:
        return (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>
            <span>Saved</span>
          </>
        );
    }
  };

  return (
    <div className="rezi-editor-workspace">
      {/* Header */}
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
            <span className={`rezi-subtitle save-status-${saveStatus}`}>
              {getSaveStatusDisplay()}
            </span>
          </div>
        </div>

        <div className="rezi-header-center">
          <div className="rezi-view-controls">
            <button
              className={`rezi-view-btn ${viewMode === 'edit-only' ? 'active' : ''}`}
              onClick={() => setViewMode('edit-only')}
            >
              📝 Edit Only
            </button>
            <button
              className={`rezi-view-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
            >
              📊 Preview + Score
            </button>
          </div>
        </div>

        <div className="rezi-header-right">
          <div className="rezi-actions">
            <button
              className={`rezi-btn rezi-btn-outline ${isAdjustmentMode ? 'active' : ''}`}
              onClick={toggleAdjustmentMode}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z" />
              </svg>
              {isAdjustmentMode ? 'EXIT ADJUSTMENTS' : 'ADJUSTMENTS'}
            </button>

            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
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
              onClick={handleManualSave}
              disabled={updateMutation.isLoading || saveStatus === 'saved'}
              title="Force Save"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17,21 17,13 7,13 7,21" />
                <polyline points="7,3 7,8 15,8" />
              </svg>
              Save
            </button>

            <button
              className="rezi-btn rezi-btn-primary"
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

      {/* Main Content */}
      <main className="rezi-editor-main">
        {viewMode === 'edit-only' && (
          <div className="rezi-split-layout view-edit-only">
            <div className="rezi-edit-sidebar">
              <ResumeTabs
                resumeData={formData}
                onFieldChange={handleFieldChange}
              />
            </div>
          </div>
        )}

        {viewMode === 'split' && (
          <div
            className="rezi-split-layout view-preview-score"
            style={{
              display: 'flex',
              height: 'calc(100vh - 120px)',
              gap: '0',
            }}
          >
            {/* Left: Preview Area - 3/4 width */}
            <div
              className="rezi-preview-area-main"
              style={{
                flex: '3 1 0%',
                overflowY: 'auto',
                padding: '20px',
                background: '#f7f8fa',
                borderRight: '1px solid #e9ecef',
              }}
            >
              <div className="rezi-preview-document">
                <div className="rezi-preview-container">
                  {/* FIXED: Dynamic template rendering */}
                  {React.createElement(currentTemplate.previewComponent, {
                    resumeData: formData,
                    isEditable: true,
                    onFieldChange: handleFieldChange,
                  })}
                </div>
              </div>
            </div>

            {/* Right: Score & Analysis - 1/4 width */}
            <aside
              className="rezi-score-analysis-sidebar"
              style={{
                flex: '1 1 0%',
                background: '#2c3e50',
                color: 'white',
                padding: '20px',
                overflowY: 'auto',
                minWidth: '300px',
              }}
            >
              <div className="rezi-sidebar-content">
                <ResumeScorecard resumeId={resumeId} />
                <div style={{ marginTop: '20px' }}>
                  <KeywordAnalyzer resumeId={resumeId} />
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default ResumeEditorPage;
