import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    
    hmr:true, 
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:1570/',
            changeOrigin: true,
            rewrite: (path)=>path.replace(/^\/api/,'')
        },
  }  },
})
