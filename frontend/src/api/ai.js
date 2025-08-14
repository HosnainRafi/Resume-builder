import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const generateDescription = async ({ jobTitle, company }) => {
  const { data } = await apiClient.post('/api/ai/generate', {
    jobTitle,
    company,
  });
  // The backend sends back { data: { description: "..." } }
  return data.data.description;
};
