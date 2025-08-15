// src/api/resumes.js

import apiClient from './apiClient'; // <-- FIX: Import the unified client

export const getResumes = async () => {
  const res = await apiClient.get('api/resumes');
  return res.data;
};

export const getResume = async (id) => {
  const res = await apiClient.get(`api/resumes/${id}`);
  return res.data;
};

export const createResume = async (payload) => {
  const res = await apiClient.post('api/resumes', payload);
  return res.data;
};

export const updateResume = async (id, payload) => {
  const res = await apiClient.patch(`api/resumes/${id}`, payload);
  return res.data;
};

export const deleteResume = async (id) => {
  const res = await apiClient.delete(`api/resumes/${id}`);
  return res.data;
};
