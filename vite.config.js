/*
 * @Descripttion: 
 * @Author: qiaozhen.cai
 * @Date: 2024-07-03 11:09:12
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    minify: false,
  }
})
