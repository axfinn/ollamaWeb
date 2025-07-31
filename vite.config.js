import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs'; // 导入 Node.js 文件系统模块
import dotenv from 'dotenv'; // 导入 dotenv 库

dotenv.config(); // 显式加载 .env 文件

export default defineConfig({
  envDir: './', // 明确指定环境变量文件目录
  root: './src',
  define: {
    'import.meta.env.VITE_OLLAMA_HOST': JSON.stringify(process.env.VITE_OLLAMA_HOST || 'http://localhost:11434'),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});