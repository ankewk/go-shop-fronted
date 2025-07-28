#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// 颜色定义
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
}

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`
}

function parseEnvFile(envPath) {
    if (!fs.existsSync(envPath)) {
        return null
    }

    const content = fs.readFileSync(envPath, 'utf8')
    const envVars = {}

    content.split('\n').forEach(line => {
        line = line.trim()
        if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=')
            if (key && valueParts.length > 0) {
                envVars[key.trim()] = valueParts.join('=').trim()
            }
        }
    })

    return envVars
}

function getEnvironmentInfo() {
    const currentEnvPath = path.join(process.cwd(), '.env')
    const currentEnv = parseEnvFile(currentEnvPath)

    if (!currentEnv) {
        return {
            error: '未找到环境配置文件 .env'
        }
    }

    const appEnv = currentEnv.APP_ENV || 'unknown'

    // 读取对应的环境配置文件
    const specificEnvPath = path.join(process.cwd(), `.env.${appEnv}`)
    const specificEnv = parseEnvFile(specificEnvPath)

    return {
        current: currentEnv,
        specific: specificEnv,
        appEnv: appEnv,
        envFile: currentEnvPath,
        specificEnvFile: specificEnvPath
    }
}

function displayEnvironmentInfo() {
    const info = getEnvironmentInfo()

    if (info.error) {
        console.log(colorize(`❌ ${info.error}`, 'red'))
        return
    }

    const env = info.current
    const appEnv = info.appEnv

    // 环境名称映射
    const envNames = {
        dev: { name: '开发环境', color: 'green' },
        uat: { name: '测试环境', color: 'yellow' },
        prod: { name: '生产环境', color: 'red' }
    }

    const envInfo = envNames[appEnv] || { name: '未知环境', color: 'magenta' }

    console.log('\n' + '='.repeat(60))
    console.log(colorize('🌐 当前环境信息', 'cyan'))
    console.log('='.repeat(60))

    // 基本信息
    console.log(colorize('📋 基本信息:', 'blue'))
    console.log(`   环境: ${colorize(envInfo.name, envInfo.color)} (${appEnv})`)
    console.log(`   应用名称: ${env.APP_NAME || 'N/A'}`)
    console.log(`   版本: ${env.APP_VERSION || 'N/A'}`)
    console.log(`   描述: ${env.APP_DESCRIPTION || 'N/A'}`)

    // API配置
    console.log(`\n${colorize('🌐 API配置:', 'blue')}`)
    console.log(`   基础URL: ${colorize(env.API_BASE_URL || 'N/A', 'cyan')}`)
    console.log(`   超时时间: ${env.API_TIMEOUT || 'N/A'}ms`)

    // 调试配置
    console.log(`\n${colorize('🐛 调试配置:', 'blue')}`)
    console.log(`   调试模式: ${env.DEBUG_MODE === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
    console.log(`   控制台日志: ${env.CONSOLE_LOG === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
    console.log(`   源码映射: ${env.SOURCE_MAP === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)

    // 功能开关
    console.log(`\n${colorize('🎛️  功能开关:', 'blue')}`)
    console.log(`   Mock数据: ${env.ENABLE_MOCK === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
    console.log(`   缓存: ${env.ENABLE_CACHE === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
    console.log(`   分析: ${env.ENABLE_ANALYTICS === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
    console.log(`   热重载: ${env.ENABLE_HOT_RELOAD === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)

    // 错误处理
    if (env.ERROR_REPORTING || env.CRASH_REPORTING) {
        console.log(`\n${colorize('🚨 错误处理:', 'blue')}`)
        console.log(`   错误上报: ${env.ERROR_REPORTING === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
        console.log(`   崩溃上报: ${env.CRASH_REPORTING === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
    }

    // 性能配置
    if (env.PERFORMANCE_MONITORING || env.API_MONITORING) {
        console.log(`\n${colorize('📊 性能监控:', 'blue')}`)
        console.log(`   性能监控: ${env.PERFORMANCE_MONITORING === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
        console.log(`   API监控: ${env.API_MONITORING === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
    }

    // 文件信息
    console.log(`\n${colorize('📁 配置文件:', 'blue')}`)
    console.log(`   当前配置: ${info.envFile}`)
    if (info.specific) {
        console.log(`   源配置: ${info.specificEnvFile}`)
    }

    // 构建信息
    console.log(`\n${colorize('🔨 构建信息:', 'blue')}`)
    console.log(`   Node环境: ${env.NODE_ENV || process.env.NODE_ENV || 'N/A'}`)
    console.log(`   应用环境: ${appEnv}`)
    console.log(`   构建时间: ${new Date().toLocaleString()}`)

    console.log('\n' + '='.repeat(60))

    // 快速操作提示
    console.log(colorize('💡 快速操作:', 'yellow'))
    console.log('   切换环境: npm run env:switch')
    console.log('   开发模式: npm run dev:h5')
    console.log('   构建应用: npm run build:prod')
    console.log('')
}

function compareEnvironments() {
    const envs = ['dev', 'uat', 'prod']
    const configs = {}

    envs.forEach(env => {
        const envPath = path.join(process.cwd(), `.env.${env}`)
        configs[env] = parseEnvFile(envPath)
    })

    console.log('\n' + '='.repeat(80))
    console.log(colorize('📊 环境对比', 'cyan'))
    console.log('='.repeat(80))

    const compareKeys = ['API_BASE_URL', 'DEBUG_MODE', 'ENABLE_MOCK', 'ENABLE_CACHE', 'ENABLE_ANALYTICS']

    console.log(`${colorize('配置项', 'blue').padEnd(25)} ${colorize('开发环境', 'green').padEnd(25)} ${colorize('测试环境', 'yellow').padEnd(25)} ${colorize('生产环境', 'red')}`)
    console.log('-'.repeat(80))

    compareKeys.forEach(key => {
        const dev = configs.dev?.[key] || 'N/A'
        const uat = configs.uat?.[key] || 'N/A'
        const prod = configs.prod?.[key] || 'N/A'

        console.log(`${key.padEnd(20)} ${dev.padEnd(20)} ${uat.padEnd(20)} ${prod}`)
    })

    console.log('')
}

function main() {
    const args = process.argv.slice(2)

    if (args.includes('--compare') || args.includes('-c')) {
        compareEnvironments()
    } else {
        displayEnvironmentInfo()
    }

    if (args.includes('--all') || args.includes('-a')) {
        compareEnvironments()
    }
}

main() 