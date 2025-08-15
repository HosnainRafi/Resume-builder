import React, { useState, useEffect } from 'react';
import { Target, Briefcase, Building, FileText } from 'lucide-react';

const OnboardingStepTwo = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobDescription: '',
    industry: '',
    experienceLevel: 'entry',
    ...data,
  });

  const [errors, setErrors] = useState({});

  // Update parent when form changes
  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Engineering',
    'Design',
    'Consulting',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Non-profit',
    'Government',
    'Other',
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'executive', label: 'Executive Level (10+ years)' },
  ];

  return (
    <div className="onboarding-form">
      <div className="form-section">
        <div className="form-section-header">
          <h2 className="form-section-title">
            <Target className="inline mr-2" size={24} />
            Job Target
          </h2>
          <p className="form-section-description">
            Tell us about the role you're targeting. This helps us tailor your
            resume with the right keywords and focus.
          </p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="jobTitle" className="form-label">
              <Briefcase className="inline mr-1" size={16} />
              Target Job Title *
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              className={`form-input ${errors.jobTitle ? 'error' : ''}`}
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Software Engineer, Marketing Manager"
            />
            {errors.jobTitle && (
              <div className="form-error">{errors.jobTitle}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="company" className="form-label">
              <Building className="inline mr-1" size={16} />
              Target Company (Optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              className="form-input"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft, Startup XYZ"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="industry" className="form-label">
              Industry *
            </label>
            <select
              id="industry"
              name="industry"
              className={`form-select ${errors.industry ? 'error' : ''}`}
              value={formData.industry}
              onChange={handleChange}
            >
              <option value="">Select an industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <div className="form-error">{errors.industry}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="experienceLevel" className="form-label">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              className="form-select"
              value={formData.experienceLevel}
              onChange={handleChange}
            >
              {experienceLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="jobDescription" className="form-label">
            <FileText className="inline mr-1" size={16} />
            Job Description (Optional)
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            className="form-textarea"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste the job description here to help us optimize your resume with relevant keywords..."
            rows={8}
          />
          <div className="form-hint">
            💡 Tip: Pasting a job description helps our AI match your resume to
            the specific role requirements.
          </div>
        </div>
      </div>

      <div className="onboarding-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!formData.jobTitle || !formData.industry}
        >
          Continue to Resume Content →
        </button>
      </div>
    </div>
  );
};

export default OnboardingStepTwo;
