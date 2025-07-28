import { createSSRApp } from 'vue'
import App from './App.vue'
import store from './store'
import { setupPlatformAdapter } from './utils/platform-adapter'

export function createApp() {
    const app = createSSRApp(App)

    // 配置Vuex store
    app.use(store)

    // 设置平台适配器
    setupPlatformAdapter(app)

    // 全局属性
    app.config.globalProperties.$store = store

    // 全局错误处理
    app.config.errorHandler = (err, vm, info) => {
        console.error('Global error:', err)
        console.error('Component:', vm)
        console.error('Error info:', info)
    }

    return {
        app
    }
} 