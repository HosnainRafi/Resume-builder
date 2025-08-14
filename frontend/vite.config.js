import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the "intercom" configuration
    proxy: {
      // Any request starting with '/api' will be forwarded
      '/api': {
        // This is the address of your "Backend House"
        target: 'http://localhost:3000',
        changeOrigin: true, // This is important for it to work correctly
      },
    },
  },
});
