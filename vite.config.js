import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  envDir: './', // 明确指定环境变量文件目录
  root: './src',
  define: {
    'import.meta.env.VITE_OLLAMA_HOST': JSON.stringify(process.env.VITE_OLLAMA_HOST || 'http://localhost:11434'),
  },
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