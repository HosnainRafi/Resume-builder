import React, { useState, useEffect } from 'react';
import {
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Plus,
  X,
  Wand2,
} from 'lucide-react';

const OnboardingStepThree = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    ...data,
  });

  const [activeSection, setActiveSection] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ Moved to component top level (fixes hooks violation)
  const [skillInput, setSkillInput] = useState('');

  // Update parent when form changes
  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const handleSummaryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      summary: value,
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          jobTitle: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          isPresent: false,
          description: '',
        },
      ],
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          degree: '',
          school: '',
          location: '',
          graduationDate: '',
          gpa: '',
          relevant_coursework: '',
        },
      ],
    }));
  };

  const updateEducation = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const generateAISummary = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const sampleSummary =
        'Results-driven professional with extensive experience in delivering high-quality solutions and driving business growth. Proven track record of success in collaborative environments with strong analytical and problem-solving skills.';
      handleSummaryChange(sampleSummary);
      setIsGenerating(false);
    }, 2000);
  };

  const sections = [
    {
      id: 'summary',
      name: 'Professional Summary',
      icon: FileText,
      required: false,
    },
    {
      id: 'experience',
      name: 'Work Experience',
      icon: Briefcase,
      required: true,
    },
    { id: 'education', name: 'Education', icon: GraduationCap, required: true },
    { id: 'skills', name: 'Skills', icon: Code, required: false },
  ];

  const renderSummarySection = () => (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Professional Summary</h3>
        <p className="form-section-description">
          A brief overview of your professional background and key
          qualifications.
        </p>
      </div>

      <div className="form-group full-width">
        <div className="summary-controls">
          <label className="form-label">Summary</label>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={generateAISummary}
            disabled={isGenerating}
          >
            <Wand2 size={16} />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
        <textarea
          className="form-textarea"
          value={formData.summary}
          onChange={(e) => handleSummaryChange(e.target.value)}
          placeholder="Write a compelling summary of your professional background and key achievements..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Work Experience</h3>
        <p className="form-section-description">
          Add your relevant work experience, starting with the most recent.
        </p>
      </div>

      {formData.experience.map((exp, index) => (
        <div key={exp.id} className="experience-item">
          <div className="experience-header">
            <h4>Experience #{index + 1}</h4>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => removeExperience(exp.id)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-input"
                value={exp.jobTitle}
                onChange={(e) =>
                  updateExperience(exp.id, 'jobTitle', e.target.value)
                }
                placeholder="Software Engineer"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-input"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(exp.id, 'company', e.target.value)
                }
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={exp.location}
                onChange={(e) =>
                  updateExperience(exp.id, 'location', e.target.value)
                }
                placeholder="New York, NY"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="month"
                className="form-input"
                value={exp.startDate}
                onChange={(e) =>
                  updateExperience(exp.id, 'startDate', e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="month"
                className="form-input"
                value={exp.endDate}
                onChange={(e) =>
                  updateExperience(exp.id, 'endDate', e.target.value)
                }
                disabled={exp.isPresent}
              />
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id={`present-${exp.id}`}
                  checked={exp.isPresent}
                  onChange={(e) =>
                    updateExperience(exp.id, 'isPresent', e.target.checked)
                  }
                />
                <label htmlFor={`present-${exp.id}`}>
                  I currently work here
                </label>
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Job Description</label>
            <textarea
              className="form-textarea"
              value={exp.description}
              onChange={(e) =>
                updateExperience(exp.id, 'description', e.target.value)
              }
              placeholder="Describe your key responsibilities and achievements..."
              rows={3}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        onClick={addExperience}
      >
        <Plus size={16} />
        Add Experience
      </button>
    </div>
  );

  const renderEducationSection = () => (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Education</h3>
        <p className="form-section-description">
          Add your educational background, starting with the most recent.
        </p>
      </div>

      {formData.education.map((edu, index) => (
        <div key={edu.id} className="education-item">
          <div className="education-header">
            <h4>Education #{index + 1}</h4>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => removeEducation(edu.id)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input
                type="text"
                className="form-input"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, 'degree', e.target.value)
                }
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>
            <div className="form-group">
              <label className="form-label">School</label>
              <input
                type="text"
                className="form-input"
                value={edu.school}
                onChange={(e) =>
                  updateEducation(edu.id, 'school', e.target.value)
                }
                placeholder="University Name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={edu.location}
                onChange={(e) =>
                  updateEducation(edu.id, 'location', e.target.value)
                }
                placeholder="Boston, MA"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Graduation Date</label>
              <input
                type="month"
                className="form-input"
                value={edu.graduationDate}
                onChange={(e) =>
                  updateEducation(edu.id, 'graduationDate', e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        onClick={addEducation}
      >
        <Plus size={16} />
        Add Education
      </button>
    </div>
  );

  // ✅ Clean render function - no hooks inside
  const renderSkillsSection = () => {
    const handleSkillSubmit = (e) => {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput.trim());
        setSkillInput('');
      }
    };

    const handleSkillKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        handleSkillSubmit(e);
      }
    };

    return (
      <div className="form-section">
        <div className="form-section-header">
          <h3 className="form-section-title">Skills</h3>
          <p className="form-section-description">
            Add relevant skills for your target role. Press Enter or comma to
            add each skill.
          </p>
        </div>

        <div className="form-group full-width">
          <label className="form-label">Add Skills</label>
          <input
            type="text"
            className="form-input"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleSkillKeyPress}
            placeholder="Type a skill and press Enter or comma..."
          />
        </div>

        {formData.skills.length > 0 && (
          <div className="skills-list">
            {formData.skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                {skill}
                <button
                  type="button"
                  className="skill-remove"
                  onClick={() => removeSkill(skill)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'summary':
        return renderSummarySection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      default:
        return renderSummarySection();
    }
  };

  const isStepComplete = () => {
    return formData.experience.length > 0 || formData.education.length > 0;
  };

  return (
    <div className="onboarding-form">
      <div className="section-tabs">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <section.icon size={16} />
            {section.name}
            {section.required && <span className="required-indicator">*</span>}
          </button>
        ))}
      </div>

      {renderCurrentSection()}

      <div className="onboarding-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onNext}
          disabled={!isStepComplete()}
        >
          Continue to Review →
        </button>
      </div>
    </div>
  );
};

export default OnboardingStepThree;
