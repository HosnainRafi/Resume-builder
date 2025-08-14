import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies
});

export const signup = async (userData) => {
  const { data } = await apiClient.post('/api/auth/signup', userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await apiClient.post('/api/auth/login', credentials);
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post('/api/auth/logout');
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get('/api/auth/me');
  return data;
};
