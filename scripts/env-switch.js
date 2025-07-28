#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 支持的环境
const environments = {
    dev: {
        name: '开发环境',
        description: '本地开发环境，支持热重载和调试',
        color: '\x1b[32m' // 绿色
    },
    uat: {
        name: '测试环境',
        description: '用户验收测试环境，接近生产配置',
        color: '\x1b[33m' // 黄色
    },
    prod: {
        name: '生产环境',
        description: '线上生产环境，性能和安全优化',
        color: '\x1b[31m' // 红色
    }
}

const resetColor = '\x1b[0m'

// 创建命令行接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function showCurrentEnv() {
    try {
        const envFile = path.join(process.cwd(), '.env')
        if (fs.existsSync(envFile)) {
            const content = fs.readFileSync(envFile, 'utf8')
            const match = content.match(/APP_ENV=(\w+)/)
            const currentEnv = match ? match[1] : 'unknown'
            const envInfo = environments[currentEnv]

            if (envInfo) {
                console.log(`当前环境: ${envInfo.color}${envInfo.name}${resetColor} (${currentEnv})`)
                console.log(`描述: ${envInfo.description}`)
            } else {
                console.log(`当前环境: ${currentEnv} (未知环境)`)
            }
        } else {
            console.log('当前环境: 未配置')
        }
    } catch (error) {
        console.error('读取环境配置失败:', error.message)
    }
}

function showEnvironmentMenu() {
    console.log('\n' + '='.repeat(50))
    console.log('🌐 环境切换工具')
    console.log('='.repeat(50))

    showCurrentEnv()

    console.log('\n可选环境:')
    Object.entries(environments).forEach(([key, env], index) => {
        console.log(`  ${index + 1}. ${env.color}${env.name}${resetColor} (${key})`)
        console.log(`     ${env.description}`)
    })

    console.log('  0. 退出')
    console.log('')
}

function switchEnvironment(targetEnv) {
    if (!environments[targetEnv]) {
        console.error(`❌ 不支持的环境: ${targetEnv}`)
        return false
    }

    try {
        const sourceFile = path.join(process.cwd(), `.env.${targetEnv}`)
        const targetFile = path.join(process.cwd(), '.env')

        if (!fs.existsSync(sourceFile)) {
            console.error(`❌ 环境配置文件不存在: .env.${targetEnv}`)
            return false
        }

        // 复制环境配置文件
        fs.copyFileSync(sourceFile, targetFile)

        const envInfo = environments[targetEnv]
        console.log(`✅ 已切换到 ${envInfo.color}${envInfo.name}${resetColor}`)
        console.log(`📝 配置文件: .env.${targetEnv} -> .env`)

        // 显示环境变量信息
        const content = fs.readFileSync(targetFile, 'utf8')
        const apiMatch = content.match(/API_BASE_URL=(.+)/)
        const versionMatch = content.match(/APP_VERSION=(.+)/)

        if (apiMatch) {
            console.log(`🌐 API地址: ${apiMatch[1]}`)
        }
        if (versionMatch) {
            console.log(`📦 版本: ${versionMatch[1]}`)
        }

        console.log('\n💡 提示:')
        console.log('  - 重启开发服务器以应用新配置')
        console.log('  - 运行 npm run env:info 查看详细信息')

        return true
    } catch (error) {
        console.error('❌ 切换环境失败:', error.message)
        return false
    }
}

function handleUserInput(input) {
    const choice = input.trim()

    if (choice === '0') {
        console.log('👋 再见!')
        rl.close()
        return
    }

    const envKeys = Object.keys(environments)
    const envIndex = parseInt(choice) - 1

    if (envIndex >= 0 && envIndex < envKeys.length) {
        const targetEnv = envKeys[envIndex]
        if (switchEnvironment(targetEnv)) {
            rl.close()
        } else {
            askForInput()
        }
    } else {
        console.log('❌ 无效选择，请重试')
        askForInput()
    }
}

function askForInput() {
    rl.question('请选择环境 (输入数字): ', handleUserInput)
}

function main() {
    // 检查命令行参数
    const args = process.argv.slice(2)

    if (args.length > 0) {
        const targetEnv = args[0]
        if (switchEnvironment(targetEnv)) {
            process.exit(0)
        } else {
            process.exit(1)
        }
    } else {
        // 交互式模式
        showEnvironmentMenu()
        askForInput()
    }
}

// 优雅退出处理
rl.on('close', () => {
    console.log('\n')
    process.exit(0)
})

// 错误处理
process.on('SIGINT', () => {
    console.log('\n👋 用户取消操作')
    process.exit(0)
})

main() 