import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  // Configure Vite to expose environment variables prefixed with 'BACKEND_'
  // This allows `import.meta.env.BACKEND_URL` to be accessible in client-side code.
  // Vite automatically loads .env files, but only exposes VITE_ prefixed variables by default.
  envPrefix: ['VITE_', 'BACKEND_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
