import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages のサブパスでも動くように相対パスで出力する
  base: './',
});
