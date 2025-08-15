// src/api/apiClient.js
import axios from 'axios';
import { auth } from '../library/firebase'; // Import Firebase auth

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  // withCredentials can be false now, we are using Bearer Tokens
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
