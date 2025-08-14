import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const getResumes = async () => {
  const { data } = await apiClient.get('/api/resumes');
  return data.data;
};

export const getResumeById = async (resumeId) => {
  const { data } = await apiClient.get(`/api/resumes/${resumeId}`);
  return data.data;
};

export const createResume = async (resumeData) => {
  const { data } = await apiClient.post('/api/resumes', resumeData);
  // FIX: Return the entire 'data' object from the server's JSON response.
  // This ensures we don't lose the nested structure.
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
