import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import viteSvgLoader from 'vite-svg-loader'

export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.includes('svg-')
                }
            }
        }),
        tailwindcss(),
        viteSvgLoader(),
    ],
    base: '/',
})