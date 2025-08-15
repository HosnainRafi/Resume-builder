import React from 'react';
import { Check, Circle, Lock } from 'lucide-react';
import '../../styles/StepNavigation.css';

const StepNavigation = ({ currentStep, completedSteps, onStepClick }) => {
  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Personal details and contact info',
      icon: '👤',
    },
    {
      id: 2,
      title: 'Job Target',
      description: 'Target role and company info',
      icon: '🎯',
    },
    {
      id: 3,
      title: 'Resume Sections',
      description: 'Experience, education, and skills',
      icon: '📝',
    },
    {
      id: 4,
      title: 'Review & Score',
      description: 'Final review and optimization',
      icon: '⭐',
    },
  ];

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'active';
    if (stepId < currentStep || completedSteps.includes(stepId - 1))
      return 'available';
    return 'locked';
  };

  //   const getStepIcon = (step, status) => {
  //     if (status === 'completed') {
  //       return <Check size={16} className="step-check" />;
  //     }
  //     if (status === 'locked') {
  //       return <Lock size={16} className="step-lock" />;
  //     }
  //     return <Circle size={16} className="step-circle" />;
  //   };

  return (
    <div className="step-navigation">
      <div className="step-navigation-header">
        <h2>Create Resume</h2>
        <p>Complete each step to build your perfect resume</p>
      </div>

      <div className="step-list">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable =
            status === 'available' ||
            status === 'active' ||
            status === 'completed';

          return (
            <div key={step.id} className="step-list-item">
              <div
                className={`step-item ${status} ${isClickable ? 'clickable' : ''}`}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                <div className="step-indicator">
                  <div className="step-number">
                    {status === 'completed' ? (
                      <Check size={16} />
                    ) : status === 'locked' ? (
                      <Lock size={16} />
                    ) : (
                      step.id
                    )}
                  </div>
                </div>

                <div className="step-content">
                  <div className="step-title">
                    <span className="step-emoji">{step.icon}</span>
                    {step.title}
                  </div>
                  <div className="step-description">{step.description}</div>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`step-connector ${status === 'completed' ? 'completed' : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="step-navigation-footer">
        <div className="progress-indicator">
          <div className="progress-text">
            Step {currentStep} of {steps.length}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
