import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 临时添加，用于调试 VITE_OLLAMA_HOST 是否被正确读取
  console.log('VITE_OLLAMA_HOST in vite.config.js:', process.env.VITE_OLLAMA_HOST);

  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_OLLAMA_HOST || 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});