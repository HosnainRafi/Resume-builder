// src/api/auth.js
import apiClient from './apiClient';

export const signup = async (userData) => {
  const { data } = await apiClient.post('/api/auth/signup', userData);
  return data;
};

// This function expects 'credentials' to be { email: '...', password: '...' }
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
