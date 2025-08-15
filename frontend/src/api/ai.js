// src/api/ai.js

import apiClient from './apiClient'; // <-- FIX: Import the unified client

export const enhanceText = async ({ text, context }) => {
  const { data } = await apiClient.post('/api/ai/enhance', { text, context });
  return data.data.enhancedText;
};
