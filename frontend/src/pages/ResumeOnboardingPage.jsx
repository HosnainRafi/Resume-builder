// src/pages/ResumeOnboardingPage.jsx

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import toast from 'react-hot-toast';

import {
  fbCreateResume,
  fbUpdateResume,
  fbGetResume,
} from '../api/resumes.firebase';
import { useAuthStore } from '../store/authStore';

import OnboardingStepOne from '../components/onboarding/OnboardingStepOne';
import OnboardingStepTwo from '../components/onboarding/OnboardingStepTwo';
import OnboardingStepThree from '../components/onboarding/OnboardingStepThree';
import OnboardingStepFour from '../components/onboarding/OnboardingStepFour';

import StepNavigation from '../components/onboarding/StepNavigation';
import OnboardingHeader from '../components/onboarding/OnboardingHeader';

import '../styles/OnboardingPage.css';

const shallowEqual = (a, b) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
};

// Fetcher function for SWR
const fetcher = ([uid, id]) => fbGetResume(uid, id);

// Mutation functions
const createResumeFn = async (url, { arg }) => {
  const { uid, data } = arg;
  return await fbCreateResume(uid, data);
};

const updateResumeFn = async (url, { arg }) => {
  const { uid, id, data } = arg;
  return await fbUpdateResume(uid, id, data);
};

const ResumeOnboardingPage = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const uid = user?.id;
  const currentStep = parseInt(step || '1', 10);

  const hydratedOnce = useRef(false);
  const lastSavedHash = useRef(null);
  const firstSaveDone = useRef(false);

  const [resumeData, setResumeData] = useState({
    basicInfo: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: '',
      city: '',
      state: '',
      website: '',
    },
    jobTarget: {
      jobTitle: '',
      company: '',
      jobDescription: '',
      industry: '',
      experienceLevel: 'entry',
    },
    sections: {
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
    },
    settings: {
      templateId: 'classic',
      colorScheme: 'blue',
    },
  });

  const toBackend = useCallback(
    (data) => ({
      title: `${data.basicInfo.firstName} ${data.basicInfo.lastName} Resume`,
      header: {
        name: `${data.basicInfo.firstName} ${data.basicInfo.lastName}`.trim(),
        email: data.basicInfo.email,
        phone: data.basicInfo.phone,
        website: data.basicInfo.website,
        location: [data.basicInfo.city, data.basicInfo.state]
          .filter(Boolean)
          .join(', '),
      },
      summary: data.sections.summary,
      experience: data.sections.experience.map((exp) => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.isPresent ? undefined : exp.endDate,
        description: exp.description,
      })),
      education: data.sections.education.map((edu) => ({
        institution: edu.school,
        degree: edu.degree,
        location: edu.location,
        graduationDate: edu.graduationDate,
      })),
      skills: data.sections.skills,
      projects: data.sections.projects,
      jobTarget: data.jobTarget,
      settings: data.settings,
    }),
    []
  );

  // ID storage (local only for routing)
  const storedId = localStorage.getItem('currentResumeId');

  // Hydrate existing resume once with SWR
  const { data: existingResume } = useSWR(
    uid && storedId ? [uid, storedId] : null,
    fetcher
  );

  useEffect(() => {
    if (!existingResume || hydratedOnce.current) return;

    const hydratedPayload = {
      basicInfo: {
        firstName: existingResume.header?.name?.split(' ')[0] || '',
        lastName:
          (existingResume.header?.name || '').split(' ').slice(1).join(' ') ||
          '',
        email: existingResume.header?.email || '',
        phone: existingResume.header?.phone || '',
        city: (existingResume.header?.location || '').split(',')?.trim() || '',
        state:
          (existingResume.header?.location || '').split(',')[1]?.trim() || '',
        website: existingResume.header?.website || '',
      },
      jobTarget: existingResume.jobTarget || {
        jobTitle: '',
        company: '',
        jobDescription: '',
        industry: '',
        experienceLevel: 'entry',
      },
      sections: {
        summary: existingResume.summary || '',
        experience: existingResume.experience || [],
        education: (existingResume.education || []).map((edu) => ({
          ...edu,
          school: edu.institution,
        })),
        skills: existingResume.skills || [],
        projects: existingResume.projects || [],
        certifications: [],
      },
      settings: existingResume.settings || {
        templateId: 'classic',
        colorScheme: 'blue',
      },
    };

    if (!shallowEqual(resumeData, hydratedPayload)) {
      setResumeData(hydratedPayload);
    }
    hydratedOnce.current = true;
  }, [existingResume?.id]);

  // Mutations with SWR
  const { trigger: createResume } = useSWRMutation(
    '/create-resume',
    createResumeFn,
    {
      onSuccess: (created) => {
        localStorage.setItem('currentResumeId', created.id);
        toast.success('Resume created');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to create resume');
      },
    }
  );

  const { trigger: updateResume } = useSWRMutation(
    '/update-resume',
    updateResumeFn,
    {
      onSuccess: () => {
        toast.success('Progress saved');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to save');
      },
    }
  );

  const saveProgress = useCallback(
    async (currentData) => {
      const currentResumeId = localStorage.getItem('currentResumeId');
      if (currentResumeId) {
        await updateResume({
          uid,
          id: currentResumeId,
          data: toBackend(currentData),
        });
      } else {
        const created = await createResume({
          uid,
          data: toBackend(currentData),
        });
        const newId = created?.id;
        if (newId) localStorage.setItem('currentResumeId', newId);
      }
    },
    [createResume, updateResume, uid, toBackend]
  );

  // Build a minimal hash to detect meaningful changes
  const saveHash = useMemo(() => {
    try {
      return JSON.stringify({
        basicInfo: {
          firstName: resumeData.basicInfo.firstName,
          lastName: resumeData.basicInfo.lastName,
          email: resumeData.basicInfo.email,
          phone: resumeData.basicInfo.phone,
          city: resumeData.basicInfo.city,
          state: resumeData.basicInfo.state,
          website: resumeData.basicInfo.website,
        },
        jobTarget: resumeData.jobTarget,
        sections: {
          summary: resumeData.sections.summary,
          experience: resumeData.sections.experience,
          education: resumeData.sections.education,
          skills: resumeData.sections.skills,
        },
        settings: resumeData.settings,
        step: currentStep,
      });
    } catch {
      return '';
    }
  }, [
    resumeData.basicInfo,
    resumeData.jobTarget,
    resumeData.sections.summary,
    resumeData.sections.experience,
    resumeData.sections.education,
    resumeData.sections.skills,
    resumeData.settings,
    currentStep,
  ]);

  // Immediate first create when minimum identity present; then debounced saves
  useEffect(() => {
    if (!uid) return;

    const hasMinimum =
      !!resumeData.basicInfo.email ||
      (!!resumeData.basicInfo.firstName && !!resumeData.basicInfo.lastName);

    if (!hasMinimum) return;

    const serialized = saveHash;
    const currentResumeId = localStorage.getItem('currentResumeId');

    if (!currentResumeId && !firstSaveDone.current) {
      firstSaveDone.current = true;
      (async () => {
        try {
          await saveProgress(resumeData);
          lastSavedHash.current = serialized;
        } catch {
          // toast handled in mutation
        }
      })();
      return;
    }

    if (serialized && serialized === lastSavedHash.current) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await saveProgress(resumeData);
        lastSavedHash.current = serialized;
      } catch {
        // toast handled in mutation
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [uid, saveHash, saveProgress, resumeData]);

  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return (
          resumeData.basicInfo.firstName &&
          resumeData.basicInfo.lastName &&
          resumeData.basicInfo.email
        );
      case 2:
        return resumeData.jobTarget.jobTitle && resumeData.jobTarget.industry;
      case 3:
        return (
          resumeData.sections.experience.length > 0 ||
          resumeData.sections.education.length > 0
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const goToStep = (stepNumber) => {
    if (stepNumber < currentStep || isStepComplete(stepNumber - 1)) {
      navigate(`/api/resumes/create/${stepNumber}`);
    }
  };

  const goToNextStep = () => {
    if (currentStep < 4) {
      navigate(`/api/resumes/create/${currentStep + 1}`);
    } else {
      const id = localStorage.getItem('currentResumeId');
      if (id) navigate(`/api/resumes/${id}/edit`);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      navigate(`/api/resumes/create/${currentStep - 1}`);
    } else {
      navigate('/resumes');
    }
  };

  const updateResumeData = (section, data) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStepOne
            data={resumeData.basicInfo}
            onUpdate={(d) => updateResumeData('basicInfo', d)}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 2:
        return (
          <OnboardingStepTwo
            data={resumeData.jobTarget}
            onUpdate={(d) => updateResumeData('jobTarget', d)}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <OnboardingStepThree
            data={resumeData.sections}
            onUpdate={(d) => updateResumeData('sections', d)}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <OnboardingStepFour
            data={resumeData}
            onUpdate={setResumeData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="onboarding-page">
      <OnboardingHeader />
      <div className="onboarding-container">
        <div className="onboarding-sidebar">
          <StepNavigation
            currentStep={currentStep}
            completedSteps={[1, 2, 3, 4].filter(isStepComplete)}
            onStepClick={goToStep}
          />
        </div>
        <div className="onboarding-content">{renderStepComponent()}</div>
      </div>
    </div>
  );
};

export default ResumeOnboardingPage;
