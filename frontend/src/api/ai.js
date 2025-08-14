import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// FIX: This function now matches your backend's /api/ai/enhance endpoint
export const enhanceText = async ({ text, context }) => {
  const { data } = await apiClient.post('/api/ai/enhance', { text, context });
  // Your backend returns { data: { enhancedText: "..." } }
  return data.data.enhancedText;
};
