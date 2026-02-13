import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: (process.env.GITHUB_PAGES) ? '/porto-brasil/' : '/',
    server: {
      port: 3003,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      },
      allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'localhost:3003', '127.0.0.1:3003', '0.0.0.0:3003', 'lashawn-unfound-daubingly.ngrok-free.dev', 'porto-brasil-frontend.onrender.com', 'ikazin-voeauto.github.io'],
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
