#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

// 支持的开发平台
const devPlatforms = {
    'h5': {
        name: 'H5网页版',
        command: 'cross-env UNI_PLATFORM=h5 vite --config vite.config.uni.js',
        port: 3000
    },
    'mp-weixin': {
        name: '微信小程序',
        command: 'cross-env UNI_PLATFORM=mp-weixin vite build --config vite.config.uni.js --watch'
    },
    'mp-alipay': {
        name: '支付宝小程序',
        command: 'cross-env UNI_PLATFORM=mp-alipay vite build --config vite.config.uni.js --watch'
    },
    'mp-baidu': {
        name: '百度小程序',
        command: 'cross-env UNI_PLATFORM=mp-baidu vite build --config vite.config.uni.js --watch'
    },
    'mp-toutiao': {
        name: '抖音小程序',
        command: 'cross-env UNI_PLATFORM=mp-toutiao vite build --config vite.config.uni.js --watch'
    }
}

// 获取命令行参数
const args = process.argv.slice(2)
const platform = args[0] || 'h5'

// 验证平台参数
if (!devPlatforms[platform]) {
    console.error(`❌ 不支持的开发平台: ${platform}`)
    console.log('支持的开发平台:')
    Object.entries(devPlatforms).forEach(([key, config]) => {
        console.log(`  ${key} - ${config.name}`)
    })
    process.exit(1)
}

const config = devPlatforms[platform]

console.log(`🚀 启动 ${config.name} 开发服务`)

// 设置环境变量
process.env.UNI_PLATFORM = platform
process.env.NODE_ENV = 'development'

// 启动开发服务
const child = spawn('npm', ['run', `dev:${platform}`], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
})

// 显示启动信息
setTimeout(() => {
    console.log('\n' + '='.repeat(50))
    console.log(`🎉 ${config.name} 开发服务已启动`)

    if (platform === 'h5') {
        console.log(`📱 访问地址: http://localhost:${config.port || 3000}`)
        console.log('🔧 支持热重载，修改代码会自动刷新')
    } else {
        console.log('📱 请使用对应的开发者工具打开项目目录:')
        console.log(`   输出目录: dist/dev/${platform}`)
        console.log('🔧 文件变化时会自动重新构建')
    }

    console.log('⌨️  按 Ctrl+C 停止服务')
    console.log('='.repeat(50) + '\n')
}, 2000)

// 优雅退出处理
process.on('SIGINT', () => {
    console.log('\n🛑 正在停止开发服务...')
    child.kill('SIGINT')
    process.exit(0)
})

process.on('SIGTERM', () => {
    console.log('\n🛑 正在停止开发服务...')
    child.kill('SIGTERM')
    process.exit(0)
}) 