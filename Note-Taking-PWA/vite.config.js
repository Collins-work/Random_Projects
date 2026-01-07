import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        copyPublicDir: true,
        rollupOptions: {
            input: {
                main: './index.html'
            }
        }
    },
    server: {
        open: true,
        host: true
    }
});
