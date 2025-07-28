#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 环境配置模板
const envTemplates = {
    dev: `# 开发环境配置
NODE_ENV=development
APP_ENV=dev

# 应用信息
APP_NAME=Gin商城(开发版)
APP_VERSION=1.0.0-dev
APP_DESCRIPTION=基于Vue3+Gin的现代电商平台 - 开发环境

# API配置
API_BASE_URL=http://localhost:8080
API_TIMEOUT=10000

# 开发服务器配置
DEV_SERVER_PORT=3000
DEV_SERVER_HOST=0.0.0.0
DEV_SERVER_OPEN=true

# 调试配置
DEBUG_MODE=true
CONSOLE_LOG=true
SOURCE_MAP=true

# 功能开关
ENABLE_MOCK=true
ENABLE_CACHE=false
ENABLE_ANALYTICS=false
ENABLE_HOT_RELOAD=true

# 开发工具
ENABLE_DEVTOOLS=true
SHOW_PERFORMANCE=true

# 错误处理
ERROR_REPORTING=false
CRASH_REPORTING=false`,

    uat: `# 测试环境配置
NODE_ENV=production
APP_ENV=uat

# 应用信息
APP_NAME=Gin商城(测试版)
APP_VERSION=1.0.0-uat
APP_DESCRIPTION=基于Vue3+Gin的现代电商平台 - 测试环境

# API配置
API_BASE_URL=https://uat-api.ginshop.com
API_TIMEOUT=15000

# 调试配置
DEBUG_MODE=true
CONSOLE_LOG=true
SOURCE_MAP=true

# 功能开关
ENABLE_MOCK=false
ENABLE_CACHE=true
ENABLE_ANALYTICS=true
ENABLE_HOT_RELOAD=false

# 开发工具
ENABLE_DEVTOOLS=true
SHOW_PERFORMANCE=false

# 错误处理
ERROR_REPORTING=true
CRASH_REPORTING=true

# 测试配置
ENABLE_E2E_TEST=true
TEST_DATA_RESET=true

# 性能监控
PERFORMANCE_MONITORING=true
API_MONITORING=true`,

    prod: `# 生产环境配置
NODE_ENV=production
APP_ENV=prod

# 应用信息
APP_NAME=Gin商城
APP_VERSION=1.0.0
APP_DESCRIPTION=基于Vue3+Gin的现代电商平台

# API配置
API_BASE_URL=https://api.ginshop.com
API_TIMEOUT=20000

# 调试配置
DEBUG_MODE=false
CONSOLE_LOG=false
SOURCE_MAP=false

# 功能开关
ENABLE_MOCK=false
ENABLE_CACHE=true
ENABLE_ANALYTICS=true
ENABLE_HOT_RELOAD=false

# 开发工具
ENABLE_DEVTOOLS=false
SHOW_PERFORMANCE=false

# 错误处理
ERROR_REPORTING=true
CRASH_REPORTING=true

# 性能优化
ENABLE_GZIP=true
ENABLE_CDN=true
BUNDLE_ANALYZER=false

# 安全配置
ENABLE_CSP=true
SECURE_COOKIES=true

# 监控配置
PERFORMANCE_MONITORING=true
API_MONITORING=true
USER_BEHAVIOR_TRACKING=true`
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function createEnvFile(env, content) {
    const filePath = path.join(process.cwd(), `.env.${env}`)

    try {
        fs.writeFileSync(filePath, content)
        console.log(`✅ 创建环境文件: .env.${env}`)
        return true
    } catch (error) {
        console.error(`❌ 创建文件失败 .env.${env}:`, error.message)
        return false
    }
}

function createDefaultEnvFile(env = 'dev') {
    const defaultPath = path.join(process.cwd(), '.env')
    const sourcePath = path.join(process.cwd(), `.env.${env}`)

    try {
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, defaultPath)
            console.log(`✅ 设置默认环境: .env (${env})`)
        } else {
            fs.writeFileSync(defaultPath, envTemplates[env])
            console.log(`✅ 创建默认环境文件: .env (${env})`)
        }
        return true
    } catch (error) {
        console.error('❌ 创建默认环境文件失败:', error.message)
        return false
    }
}

function checkExistingFiles() {
    const existingFiles = []

    Object.keys(envTemplates).forEach(env => {
        const filePath = path.join(process.cwd(), `.env.${env}`)
        if (fs.existsSync(filePath)) {
            existingFiles.push(env)
        }
    })

    const defaultPath = path.join(process.cwd(), '.env')
    const hasDefault = fs.existsSync(defaultPath)

    return { existingFiles, hasDefault }
}

function askForConfirmation(message) {
    return new Promise((resolve) => {
        rl.question(`${message} (y/N): `, (answer) => {
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
        })
    })
}

function askForDefaultEnv() {
    return new Promise((resolve) => {
        rl.question('选择默认环境 (dev/uat/prod) [dev]: ', (answer) => {
            const env = answer.trim() || 'dev'
            if (envTemplates[env]) {
                resolve(env)
            } else {
                console.log('❌ 无效环境，使用默认值: dev')
                resolve('dev')
            }
        })
    })
}

async function main() {
    console.log('🌐 环境文件创建工具')
    console.log('='.repeat(40))

    const { existingFiles, hasDefault } = checkExistingFiles()

    // 显示现有文件状态
    if (existingFiles.length > 0) {
        console.log('📁 现有环境文件:')
        existingFiles.forEach(env => {
            console.log(`   .env.${env}`)
        })
    }

    if (hasDefault) {
        console.log('📁 默认环境文件: .env')
    }

    // 检查是否需要覆盖
    const needsOverwrite = existingFiles.length > 0
    if (needsOverwrite) {
        const shouldOverwrite = await askForConfirmation('⚠️  发现现有文件，是否覆盖?')
        if (!shouldOverwrite) {
            console.log('❌ 操作已取消')
            rl.close()
            return
        }
    }

    // 创建环境文件
    console.log('\n📝 创建环境配置文件...')
    let success = true

    Object.entries(envTemplates).forEach(([env, content]) => {
        if (!createEnvFile(env, content)) {
            success = false
        }
    })

    if (!success) {
        console.log('❌ 部分文件创建失败')
        rl.close()
        return
    }

    // 设置默认环境
    console.log('')
    const defaultEnv = await askForDefaultEnv()
    createDefaultEnvFile(defaultEnv)

    // 完成提示
    console.log('')
    console.log('🎉 环境配置文件创建完成!')
    console.log('')
    console.log('📋 后续步骤:')
    console.log('   1. 根据实际情况修改环境配置文件')
    console.log('   2. 运行 npm run env:info 查看环境信息')
    console.log('   3. 运行 npm run dev 启动开发服务器')
    console.log('')
    console.log('💡 常用命令:')
    console.log('   npm run env:switch    # 切换环境')
    console.log('   npm run env:info      # 查看环境信息')
    console.log('   npm run dev:h5        # 启动开发服务器')
    console.log('   npm run build:prod    # 构建生产版本')

    rl.close()
}

// 错误处理
process.on('SIGINT', () => {
    console.log('\n👋 操作已取消')
    process.exit(0)
})

rl.on('close', () => {
    process.exit(0)
})

main().catch(error => {
    console.error('❌ 脚本执行失败:', error.message)
    process.exit(1)
}) 