/**
 * 环境配置管理
 */

// 获取当前环境
export function getCurrentEnv() {
    return process.env.APP_ENV || 'dev'
}

// 环境配置
export const envConfig = {
    dev: {
        name: '开发环境',
        apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
        debugMode: true,
        enableMock: true,
        enableCache: false,
        enableAnalytics: false,
        logLevel: 'debug'
    },
    uat: {
        name: '测试环境',
        apiBaseUrl: process.env.API_BASE_URL || 'https://uat-api.ginshop.com',
        debugMode: true,
        enableMock: false,
        enableCache: true,
        enableAnalytics: true,
        logLevel: 'info'
    },
    prod: {
        name: '生产环境',
        apiBaseUrl: process.env.API_BASE_URL || 'https://api.ginshop.com',
        debugMode: false,
        enableMock: false,
        enableCache: true,
        enableAnalytics: true,
        logLevel: 'error'
    }
}

// 获取当前环境配置
export function getEnvConfig() {
    const env = getCurrentEnv()
    return envConfig[env] || envConfig.dev
}

// 是否为开发环境
export function isDev() {
    return getCurrentEnv() === 'dev'
}

// 是否为测试环境
export function isUat() {
    return getCurrentEnv() === 'uat'
}

// 是否为生产环境
export function isProd() {
    return getCurrentEnv() === 'prod'
}

// 是否为生产环境(包含uat)
export function isProduction() {
    const env = getCurrentEnv()
    return env === 'prod' || env === 'uat'
}

// 获取API基础URL
export function getApiBaseUrl() {
    return getEnvConfig().apiBaseUrl
}

// 获取完整API URL
export function getApiUrl(path = '') {
    const baseUrl = getApiBaseUrl()
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${cleanPath}`
}

// 是否启用调试模式
export function isDebugMode() {
    return getEnvConfig().debugMode
}

// 是否启用Mock数据
export function isMockEnabled() {
    return getEnvConfig().enableMock
}

// 是否启用缓存
export function isCacheEnabled() {
    return getEnvConfig().enableCache
}

// 是否启用分析
export function isAnalyticsEnabled() {
    return getEnvConfig().enableAnalytics
}

// 获取日志级别
export function getLogLevel() {
    return getEnvConfig().logLevel
}

// 环境信息
export function getEnvInfo() {
    const env = getCurrentEnv()
    const config = getEnvConfig()

    return {
        environment: env,
        name: config.name,
        version: process.env.APP_VERSION || '1.0.0',
        buildTime: new Date().toISOString(),
        apiBaseUrl: config.apiBaseUrl,
        debugMode: config.debugMode,
        features: {
            mock: config.enableMock,
            cache: config.enableCache,
            analytics: config.enableAnalytics
        }
    }
}

// 控制台输出环境信息
export function logEnvInfo() {
    if (!isDebugMode()) return

    const info = getEnvInfo()
    console.group('🌐 环境信息')
    console.log('环境:', info.name)
    console.log('版本:', info.version)
    console.log('构建时间:', info.buildTime)
    console.log('API地址:', info.apiBaseUrl)
    console.log('调试模式:', info.debugMode)
    console.log('功能开关:', info.features)
    console.groupEnd()
} 