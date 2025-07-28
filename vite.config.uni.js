import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        uni()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    server: {
        port: 3000,
        host: '0.0.0.0'
    },
    build: {
        target: 'es6',
        cssTarget: 'chrome61',
        rollupOptions: {
            external: ['vue', 'vue-router', 'vuex']
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/uni.scss";`
            }
        }
    },
    define: {
        __UNI_FEATURE_WX__: true,
        __UNI_FEATURE_PROMISE__: true,
        __UNI_PLATFORM__: JSON.stringify(process.env.UNI_PLATFORM)
    }
}) 