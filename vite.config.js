import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs'; // 导入 Node.js 文件系统模块

export default defineConfig({
  // 临时添加，用于调试 VITE_OLLAMA_HOST 是否被正确读取
  console.log('VITE_OLLAMA_HOST in vite.config.js (inside defineConfig):', process.env.VITE_OLLAMA_HOST);
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
    // 添加一个构建钩子，将环境变量写入文件以供检查
    writeBundle(options, bundle) {
      const envValue = process.env.VITE_OLLAMA_HOST || 'VITE_OLLAMA_HOST_NOT_SET';
      fs.writeFileSync(resolve(options.dir, 'build_env_check.txt'), `VITE_OLLAMA_HOST during build: ${envValue}`);
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});