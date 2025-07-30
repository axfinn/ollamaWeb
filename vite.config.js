export default {
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: 'src/index.html'
    }
  },
  server: {
    open: true
  }
};