import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const getResumes = async () => {
  const { data } = await apiClient.get('/api/resumes');
  // FIX: Return the entire response data object from the server.
  // This standardizes the response format across all API calls.
  console.log('1. Raw data from getResumes API call:', data);
  return data;
};

export const getResumeById = async (resumeId) => {
  const { data } = await apiClient.get(`/api/resumes/${resumeId}`);
  return data.data;
};

export const createResume = async (resumeData) => {
  const { data } = await apiClient.post('/api/resumes', resumeData);
  return data;
};

export const updateResume = async ({ resumeId, resumeData }) => {
  const { data } = await apiClient.patch(
    `/api/resumes/${resumeId}`,
    resumeData
  );
  return data.data;
};

export const deleteResume = async (resumeId) => {
  await apiClient.delete(`/api/resumes/${resumeId}`);
};

export const shareResume = async ({ resumeId, template }) => {
  const { data } = await axios.post(
    `/api/resumes/${resumeId}/share`,
    { template },
    { withCredentials: true }
  );
  return data;
};

export const getSharedResume = async (token) => {
  const { data } = await axios.get(`/api/resumes/shared/${token}`);
  return data;
};
