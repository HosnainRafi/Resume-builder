import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Star,
  FileText,
  Download,
  Edit,
} from 'lucide-react';

const OnboardingStepFour = ({ data, onNext, onBack }) => {
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    // Simulate score calculation
    calculateResumeScore();
  }, [data]);

  const calculateResumeScore = () => {
    setIsCalculating(true);

    // Simulate API call
    setTimeout(() => {
      let baseScore = 60;
      const newFeedback = [];

      // Check basic info completeness
      if (
        data.basicInfo?.firstName &&
        data.basicInfo?.lastName &&
        data.basicInfo?.email
      ) {
        baseScore += 10;
      } else {
        newFeedback.push({
          type: 'error',
          message: 'Complete your contact information',
          action: 'Go back to Step 1 and fill in missing details',
        });
      }

      // Check job target
      if (data.jobTarget?.jobTitle && data.jobTarget?.industry) {
        baseScore += 15;
      } else {
        newFeedback.push({
          type: 'warning',
          message: 'Add a clear job target',
          action:
            'Specify your target role and industry for better ATS matching',
        });
      }

      // Check experience
      if (data.sections?.experience?.length > 0) {
        baseScore += 20;
        if (
          data.sections.experience.some((exp) => exp.description?.length > 50)
        ) {
          baseScore += 10;
        } else {
          newFeedback.push({
            type: 'warning',
            message: 'Add detailed job descriptions',
            action: 'Include specific achievements and responsibilities',
          });
        }
      } else {
        newFeedback.push({
          type: 'error',
          message: 'Add work experience',
          action: 'Include at least one work experience entry',
        });
      }

      // Check education
      if (data.sections?.education?.length > 0) {
        baseScore += 10;
      }

      // Check summary
      if (data.sections?.summary?.length > 50) {
        baseScore += 15;
        newFeedback.push({
          type: 'success',
          message: 'Great professional summary',
          action: 'Your summary effectively highlights your key qualifications',
        });
      } else {
        newFeedback.push({
          type: 'warning',
          message: 'Add a professional summary',
          action: 'A compelling summary increases recruiter interest by 40%',
        });
      }

      // Check skills
      if (data.sections?.skills?.length >= 5) {
        baseScore += 10;
        newFeedback.push({
          type: 'success',
          message: 'Good skills variety',
          action: 'You have a comprehensive skills section',
        });
      } else {
        newFeedback.push({
          type: 'warning',
          message: 'Add more relevant skills',
          action: 'Include 5-10 skills relevant to your target role',
        });
      }

      // Job description matching
      if (data.jobTarget?.jobDescription?.length > 100) {
        baseScore += 10;
        newFeedback.push({
          type: 'success',
          message: 'Job description provided',
          action: 'We can optimize your resume for ATS keyword matching',
        });
      } else {
        newFeedback.push({
          type: 'info',
          message: 'Consider adding target job description',
          action: 'This helps optimize your resume for specific roles',
        });
      }

      setScore(Math.min(baseScore, 100));
      setFeedback(newFeedback);
      setIsCalculating(false);
    }, 2500);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981'; // Green
    if (score >= 70) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const renderScoreSection = () => {
    if (isCalculating) {
      return (
        <div className="score-calculating">
          <div className="loading-spinner"></div>
          <h3>Analyzing your resume...</h3>
          <p>
            Our AI is reviewing your content for ATS optimization and best
            practices.
          </p>
        </div>
      );
    }

    return (
      <div className="score-display">
        <div
          className="score-circle"
          style={{ '--score-color': getScoreColor(score) }}
        >
          <div className="score-number">{score}</div>
          <div className="score-label">{getScoreLabel(score)}</div>
        </div>
        <div className="score-description">
          <h3>Your Resume Score</h3>
          <p>
            Your resume scores <strong>{score}/100</strong> based on ATS
            optimization, content quality, and industry best practices.
          </p>
        </div>
      </div>
    );
  };

  const renderFeedbackSection = () => (
    <div className="feedback-section">
      <h3>Recommendations</h3>
      <div className="feedback-list">
        {feedback.map((item, index) => (
          <div key={index} className={`feedback-item ${item.type}`}>
            <div className="feedback-icon">
              {item.type === 'success' && <CheckCircle size={20} />}
              {item.type === 'warning' && <AlertCircle size={20} />}
              {item.type === 'error' && <AlertCircle size={20} />}
              {item.type === 'info' && <FileText size={20} />}
            </div>
            <div className="feedback-content">
              <div className="feedback-message">{item.message}</div>
              <div className="feedback-action">{item.action}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResumePreview = () => (
    <div className="resume-preview">
      <h3>Resume Preview</h3>
      <div className="preview-card">
        <div className="preview-header">
          <h4>
            {data.basicInfo?.firstName} {data.basicInfo?.lastName}
          </h4>
          <p>
            {data.basicInfo?.email} • {data.basicInfo?.phone}
          </p>
          <p>
            {data.basicInfo?.city}, {data.basicInfo?.state}
          </p>
        </div>

        {data.sections?.summary && (
          <div className="preview-section">
            <h5>Professional Summary</h5>
            <p>{data.sections.summary}</p>
          </div>
        )}

        {data.sections?.experience?.length > 0 && (
          <div className="preview-section">
            <h5>Work Experience</h5>
            {data.sections.experience.slice(0, 2).map((exp, index) => (
              <div key={index} className="preview-experience">
                <h6>
                  {exp.jobTitle} at {exp.company}
                </h6>
                <p className="preview-dates">
                  {exp.startDate} - {exp.isPresent ? 'Present' : exp.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        {data.sections?.education?.length > 0 && (
          <div className="preview-section">
            <h5>Education</h5>
            {data.sections.education.slice(0, 1).map((edu, index) => (
              <div key={index} className="preview-education">
                <h6>{edu.degree}</h6>
                <p>{edu.school}</p>
              </div>
            ))}
          </div>
        )}

        {data.sections?.skills?.length > 0 && (
          <div className="preview-section">
            <h5>Skills</h5>
            <div className="preview-skills">
              {data.sections.skills.slice(0, 6).map((skill, index) => (
                <span key={index} className="preview-skill">
                  {skill}
                </span>
              ))}
              {data.sections.skills.length > 6 && (
                <span>+{data.sections.skills.length - 6} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="onboarding-form">
      <div className="form-section">
        <div className="form-section-header">
          <h2 className="form-section-title">
            <Star className="inline mr-2" size={24} />
            Resume Review & Score
          </h2>
          <p className="form-section-description">
            Review your resume and see how it scores against ATS systems and
            industry standards.
          </p>
        </div>

        {renderScoreSection()}
      </div>

      <div className="review-content">
        <div className="review-left">{renderFeedbackSection()}</div>
        <div className="review-right">{renderResumePreview()}</div>
      </div>

      <div className="onboarding-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          ← Back to Edit
        </button>

        <div className="final-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => window.print()}
          >
            <Download size={16} />
            Quick Download
          </button>

          <button type="button" className="btn btn-primary" onClick={onNext}>
            <Edit size={16} />
            Open Full Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepFour;
