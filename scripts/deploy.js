#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 部署配置
const deployConfigs = {
    dev: {
        name: '开发环境',
        server: 'dev-server.ginshop.com',
        port: 22,
        user: 'deployer',
        path: '/var/www/gin-shop-dev',
        branch: 'develop',
        backup: false,
        commands: [
            'npm install --production',
            'pm2 restart gin-shop-dev || pm2 start ecosystem.config.js --env dev'
        ]
    },
    uat: {
        name: '测试环境',
        server: 'uat-server.ginshop.com',
        port: 22,
        user: 'deployer',
        path: '/var/www/gin-shop-uat',
        branch: 'release',
        backup: true,
        commands: [
            'npm install --production',
            'npm run build:uat',
            'pm2 restart gin-shop-uat || pm2 start ecosystem.config.js --env uat'
        ]
    },
    prod: {
        name: '生产环境',
        server: 'prod-server.ginshop.com',
        port: 22,
        user: 'deployer',
        path: '/var/www/gin-shop-prod',
        branch: 'main',
        backup: true,
        commands: [
            'npm install --production',
            'npm run build:prod',
            'pm2 restart gin-shop-prod || pm2 start ecosystem.config.js --env prod'
        ]
    }
}

// 获取命令行参数
const args = process.argv.slice(2)
const targetEnv = args[0]
const isDryRun = args.includes('--dry-run') || args.includes('-d')
const isForce = args.includes('--force') || args.includes('-f')

function validateEnvironment(env) {
    if (!deployConfigs[env]) {
        console.error(`❌ 不支持的环境: ${env}`)
        console.log('支持的环境:')
        Object.keys(deployConfigs).forEach(key => {
            console.log(`  ${key} - ${deployConfigs[key].name}`)
        })
        return false
    }
    return true
}

function checkBuildExists(env) {
    const distPath = path.join(process.cwd(), 'dist')
    if (!fs.existsSync(distPath)) {
        console.error('❌ 构建文件不存在，请先运行构建命令')
        console.log(`💡 运行: npm run build:${env}`)
        return false
    }
    return true
}

function createDeployPackage(env) {
    console.log('📦 创建部署包...')

    try {
        // 创建部署包目录
        const deployDir = path.join(process.cwd(), 'deploy')
        if (!fs.existsSync(deployDir)) {
            fs.mkdirSync(deployDir)
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const packageName = `gin-shop-${env}-${timestamp}.tar.gz`
        const packagePath = path.join(deployDir, packageName)

        // 打包文件
        execSync(`tar -czf ${packagePath} dist/ package.json package-lock.json`, {
            stdio: 'inherit'
        })

        console.log(`✅ 部署包创建成功: ${packageName}`)
        return packagePath
    } catch (error) {
        console.error('❌ 创建部署包失败:', error.message)
        return null
    }
}

function deployToServer(env, packagePath) {
    const config = deployConfigs[env]
    console.log(`🚀 部署到 ${config.name}...`)

    if (isDryRun) {
        console.log('🔍 预演模式 - 以下是将要执行的操作:')
        console.log(`1. 上传包到 ${config.server}:${config.path}`)
        console.log(`2. 解压并安装依赖`)
        console.log(`3. 执行部署命令:`)
        config.commands.forEach((cmd, index) => {
            console.log(`   ${index + 1}. ${cmd}`)
        })
        return true
    }

    try {
        const packageName = path.basename(packagePath)
        const remotePath = `${config.user}@${config.server}:${config.path}`

        // 备份当前版本
        if (config.backup) {
            console.log('💾 备份当前版本...')
            execSync(`ssh ${config.user}@${config.server} "cd ${config.path} && tar -czf backup/backup-$(date +%Y%m%d-%H%M%S).tar.gz dist/ || true"`, {
                stdio: 'inherit'
            })
        }

        // 上传文件
        console.log('📤 上传部署包...')
        execSync(`scp -P ${config.port} ${packagePath} ${remotePath}/`, {
            stdio: 'inherit'
        })

        // 远程部署
        console.log('🔧 执行远程部署...')
        const remoteCommands = [
            `cd ${config.path}`,
            `tar -xzf ${packageName}`,
            `rm ${packageName}`,
            ...config.commands
        ].join(' && ')

        execSync(`ssh -p ${config.port} ${config.user}@${config.server} "${remoteCommands}"`, {
            stdio: 'inherit'
        })

        console.log(`✅ ${config.name} 部署成功!`)
        return true
    } catch (error) {
        console.error(`❌ 部署到 ${config.name} 失败:`, error.message)
        return false
    }
}

function deployLocal(env) {
    console.log(`🏠 本地部署到 ${env} 环境...`)

    try {
        // 启动本地服务
        const port = env === 'dev' ? 3000 : env === 'uat' ? 3001 : 3002

        if (isDryRun) {
            console.log('🔍 预演模式 - 将要执行:')
            console.log(`启动本地服务器在端口 ${port}`)
            return true
        }

        console.log(`🌐 启动服务器在端口 ${port}...`)
        execSync(`npm run serve -- --port ${port}`, {
            stdio: 'inherit'
        })

        return true
    } catch (error) {
        console.error('❌ 本地部署失败:', error.message)
        return false
    }
}

function showDeployInfo(env) {
    const config = deployConfigs[env]

    console.log('\n' + '='.repeat(50))
    console.log(`🚀 ${config.name} 部署信息`)
    console.log('='.repeat(50))
    console.log(`服务器: ${config.server}`)
    console.log(`用户: ${config.user}`)
    console.log(`路径: ${config.path}`)
    console.log(`分支: ${config.branch}`)
    console.log(`备份: ${config.backup ? '是' : '否'}`)
    console.log('\n执行命令:')
    config.commands.forEach((cmd, index) => {
        console.log(`  ${index + 1}. ${cmd}`)
    })
    console.log('')
}

function confirmDeploy(env) {
    if (isForce) return true

    const config = deployConfigs[env]

    console.log(`⚠️  即将部署到 ${config.name}`)
    console.log(`服务器: ${config.server}`)

    if (env === 'prod') {
        console.log('🚨 这是生产环境部署，请确认!')
    }

    // 简单确认（在实际项目中可以使用更复杂的确认机制）
    return true
}

function main() {
    if (!targetEnv) {
        console.error('❌ 请指定部署环境')
        console.log('用法: npm run deploy:[env] 或 node scripts/deploy.js [env]')
        console.log('选项:')
        console.log('  --dry-run, -d  预演模式，不执行实际部署')
        console.log('  --force, -f    跳过确认直接部署')
        console.log('  --local        本地部署')
        console.log('  --info         显示部署信息')
        process.exit(1)
    }

    if (!validateEnvironment(targetEnv)) {
        process.exit(1)
    }

    if (args.includes('--info')) {
        showDeployInfo(targetEnv)
        return
    }

    console.log(`🎯 准备部署到 ${deployConfigs[targetEnv].name}`)

    if (!confirmDeploy(targetEnv)) {
        console.log('❌ 部署已取消')
        process.exit(1)
    }

    if (!checkBuildExists(targetEnv)) {
        process.exit(1)
    }

    // 本地部署
    if (args.includes('--local')) {
        if (deployLocal(targetEnv)) {
            console.log('✅ 本地部署完成')
        } else {
            process.exit(1)
        }
        return
    }

    // 远程部署
    const packagePath = createDeployPackage(targetEnv)
    if (!packagePath) {
        process.exit(1)
    }

    if (deployToServer(targetEnv, packagePath)) {
        console.log('🎉 部署完成!')

        // 清理部署包
        fs.unlinkSync(packagePath)
        console.log('🧹 清理临时文件')
    } else {
        process.exit(1)
    }
}

main() 