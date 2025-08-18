// src/components/ResumeScorecard.jsx

import React from 'react';
import useSWR from 'swr';
import apiClient from '../api/apiClient';

// API function to call our scoring endpoint
const fetchResumeScore = async (url) => {
  const { data } = await apiClient.get(url);
  return data.data; // This data object should contain { score, feedback }
};

function ResumeScorecard({ resumeId }) {
  const {
    data,
    error,
    isLoading,
    mutate: refetch,
  } = useSWR(
    resumeId ? `/api/resumes/${resumeId}/score` : null,
    fetchResumeScore,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    }
  );

  const handleAnalyzeResume = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to analyze resume:', error);
    }
  };

  // Get score color based on score value
  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  // Get score status text
  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="rezi-scorecard">
      {/* Score Display */}
      {data ? (
        <div className="rezi-score-section">
          <div className="rezi-score-circle-container">
            <div
              className="rezi-score-circle"
              style={{
                background: `conic-gradient(${getScoreColor(data.score)} ${data.score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
              }}
            >
              <div className="rezi-score-inner">
                <span
                  className="rezi-score-number"
                  style={{ color: getScoreColor(data.score) }}
                >
                  {data.score}
                </span>
                <span className="rezi-score-max">/100</span>
              </div>
            </div>
          </div>

          <div className="rezi-score-info">
            <h3 className="rezi-score-title">Rezi Score</h3>
            <p
              className="rezi-score-status"
              style={{ color: getScoreColor(data.score) }}
            >
              {getScoreStatus(data.score)}
            </p>
          </div>

          <button
            className="rezi-score-button"
            onClick={handleAnalyzeResume}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="rezi-spinner"></div>
                Analyzing...
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Refresh Score
              </>
            )}
          </button>

          {/* Feedback Section */}
          {data.feedback && data.feedback.length > 0 && (
            <div className="rezi-feedback-section">
              <h4 className="rezi-feedback-title">Key Improvements</h4>
              <ul className="rezi-feedback-list">
                {data.feedback.slice(0, 3).map((item, index) => (
                  <li key={index} className="rezi-feedback-item">
                    {item}
                  </li>
                ))}
              </ul>
              {data.feedback.length > 3 && (
                <button className="rezi-view-all-btn">
                  View All ({data.feedback.length}) →
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Initial State */
        <div className="rezi-score-section">
          <div className="rezi-score-placeholder">
            <div className="rezi-score-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
                opacity="0.3"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="rezi-score-title">Resume Score</h3>
            <p className="rezi-placeholder-text">
              Get instant feedback on your resume's ATS compatibility and
              overall quality.
            </p>
          </div>

          <button
            className="rezi-score-button rezi-primary"
            onClick={handleAnalyzeResume}
            disabled={isLoading || !resumeId}
          >
            {isLoading ? (
              <>
                <div className="rezi-spinner"></div>
                Analyzing...
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Analyze My Resume
              </>
            )}
          </button>

          {error && (
            <div className="rezi-error-message">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Failed to analyze. Try again.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeScorecard;
