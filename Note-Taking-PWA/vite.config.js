import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: './index.html'
            },
            output: {
                manualChunks: undefined
            }
        }
    },
    publicDir: 'public',
    server: {
        open: true,
        host: true
    }
});
