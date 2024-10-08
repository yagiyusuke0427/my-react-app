import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'], // JSXファイルを指定
            refresh: true,
        }),
        react(), // Reactプラグインを追加
    ],
    build: {
        outDir: 'public/build', // 出力先を指定
    },
});
