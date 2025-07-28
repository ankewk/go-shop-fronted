import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据mode加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  // 根据APP_ENV设置实际环境
  const appEnv = env.APP_ENV || mode || 'dev'

  return {
    plugins: [vue()],

    // 环境变量配置
    define: {
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'development'),
      'process.env.APP_ENV': JSON.stringify(appEnv),
      'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL),
      'process.env.APP_NAME': JSON.stringify(env.APP_NAME),
      'process.env.APP_VERSION': JSON.stringify(env.APP_VERSION),
      'process.env.DEBUG_MODE': JSON.stringify(env.DEBUG_MODE),
      'process.env.ENABLE_MOCK': JSON.stringify(env.ENABLE_MOCK),
      'process.env.ENABLE_CACHE': JSON.stringify(env.ENABLE_CACHE),
      'process.env.ENABLE_ANALYTICS': JSON.stringify(env.ENABLE_ANALYTICS),
    },

    // 路径别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@config': path.resolve(__dirname, 'config'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@views': path.resolve(__dirname, 'src/views'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@api': path.resolve(__dirname, 'src/api'),
      }
    },

    // 开发服务器配置
    server: {
      host: env.DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(env.DEV_SERVER_PORT) || 3000,
      open: env.DEV_SERVER_OPEN === 'true',
      cors: true,
      proxy: {
        '/api': {
          target: env.API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },

    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: env.SOURCE_MAP === 'true',
      minify: appEnv === 'prod' ? 'esbuild' : false,

      // 分包策略
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            elementPlus: ['element-plus'],
            utils: ['axios', 'dayjs']
          }
        }
      },

      // 包大小警告阈值
      chunkSizeWarningLimit: appEnv === 'prod' ? 500 : 1000,
    },

    // CSS配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/variables.scss";`
        }
      },
      devSourcemap: env.SOURCE_MAP === 'true'
    },

    // 优化配置
    optimizeDeps: {
      include: ['vue', 'vue-router', 'vuex', 'element-plus', 'axios']
    },

    // 环境特定配置
    ...(appEnv === 'prod' && {
      base: '/gin-shop/',
      build: {
        ...this.build,
        reportCompressedSize: false,
        rollupOptions: {
          ...this.build?.rollupOptions,
          external: env.ENABLE_CDN === 'true' ? ['vue', 'element-plus'] : []
        }
      }
    }),

    ...(appEnv === 'dev' && {
      clearScreen: false,
      logLevel: 'info'
    })
  }
}) 