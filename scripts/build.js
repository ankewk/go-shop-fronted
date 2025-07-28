#!/usr/bin/env node

const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

// 支持的平台
const platforms = {
    'h5': 'H5网页版',
    'mp-weixin': '微信小程序',
    'mp-alipay': '支付宝小程序',
    'mp-baidu': '百度小程序',
    'mp-toutiao': '抖音小程序',
    'app': 'App应用'
}

// 获取命令行参数
const args = process.argv.slice(2)
const platform = args[0] || 'h5'
const mode = args[1] || 'development'

// 验证平台参数
if (!platforms[platform]) {
    console.error(`❌ 不支持的平台: ${platform}`)
    console.log('支持的平台:')
    Object.entries(platforms).forEach(([key, name]) => {
        console.log(`  ${key} - ${name}`)
    })
    process.exit(1)
}

console.log(`🚀 开始构建 ${platforms[platform]} (${mode} 模式)`)

// 设置环境变量
process.env.UNI_PLATFORM = platform
process.env.NODE_ENV = mode === 'production' ? 'production' : 'development'

// 构建命令
const buildCommand = mode === 'production'
    ? `cross-env UNI_PLATFORM=${platform} NODE_ENV=production vite build --config vite.config.uni.js`
    : `cross-env UNI_PLATFORM=${platform} NODE_ENV=development vite build --config vite.config.uni.js --watch`

// 执行构建
const child = exec(buildCommand, { cwd: process.cwd() })

child.stdout.on('data', (data) => {
    console.log(data.toString())
})

child.stderr.on('data', (data) => {
    console.error(data.toString())
})

child.on('close', (code) => {
    if (code === 0) {
        console.log(`✅ ${platforms[platform]} 构建完成!`)

        // 显示构建结果
        showBuildResult(platform, mode)
    } else {
        console.error(`❌ 构建失败，退出码: ${code}`)
        process.exit(code)
    }
})

function showBuildResult(platform, mode) {
    const distPath = path.join(process.cwd(), 'dist', mode === 'production' ? 'build' : 'dev', platform)

    console.log('\n📦 构建结果:')
    console.log(`   平台: ${platforms[platform]}`)
    console.log(`   模式: ${mode}`)
    console.log(`   输出: ${distPath}`)

    if (platform === 'h5') {
        console.log('\n🌐 H5版本可以直接部署到Web服务器')
        console.log('   或运行 npm run serve 本地预览')
    } else if (platform.startsWith('mp-')) {
        console.log('\n📱 小程序版本构建完成')
        console.log('   请使用对应的开发者工具打开 dist 目录进行调试和上传')
        console.log('   微信小程序: 微信开发者工具')
        console.log('   支付宝小程序: 支付宝开发者工具')
        console.log('   百度小程序: 百度开发者工具')
        console.log('   抖音小程序: 抖音开发者工具')
    } else if (platform === 'app') {
        console.log('\n📱 App版本构建完成')
        console.log('   请使用 HBuilderX 导入项目进行云端打包')
        console.log('   或本地离线打包')
    }
} 