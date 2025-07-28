# 环境配置指南

## 概述

项目支持三个环境：
- **dev** - 开发环境
- **uat** - 测试环境  
- **prod** - 生产环境

## 环境配置文件

项目使用环境变量文件来管理不同环境的配置：

```
.env          # 当前激活的环境配置
.env.dev      # 开发环境配置模板
.env.uat      # 测试环境配置模板
.env.prod     # 生产环境配置模板
```

## 创建环境文件

由于`.env`文件在gitignore中，你需要手动创建这些文件：

### 1. 创建 .env.dev (开发环境)

```bash
# 开发环境配置
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
CRASH_REPORTING=false
```

### 2. 创建 .env.uat (测试环境)

```bash
# 测试环境配置
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
API_MONITORING=true
```

### 3. 创建 .env.prod (生产环境)

```bash
# 生产环境配置
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
USER_BEHAVIOR_TRACKING=true
```

## 快速开始

### 1. 创建环境文件

```bash
# 复制开发环境模板
cp .env.dev .env
```

### 2. 查看当前环境信息

```bash
npm run env:info
```

### 3. 切换环境

```bash
# 交互式切换
npm run env:switch

# 直接切换到指定环境
npm run env:switch dev
npm run env:switch uat
npm run env:switch prod
```

## 开发命令

### 启动开发服务器

```bash
# 使用当前环境配置
npm run dev

# 指定环境启动
npm run dev:h5        # 开发环境
npm run dev:h5:uat    # 测试环境  
npm run dev:h5:prod   # 生产环境
```

### 构建项目

```bash
# 构建不同环境
npm run build:dev     # 开发环境构建
npm run build:uat     # 测试环境构建
npm run build:prod    # 生产环境构建
```

### 部署项目

```bash
# 部署到不同环境
npm run deploy:dev    # 部署到开发环境
npm run deploy:uat    # 部署到测试环境
npm run deploy:prod   # 部署到生产环境
```

## 环境管理工具

### 环境切换工具

```bash
npm run env:switch
```

功能：
- 显示当前环境状态
- 交互式环境切换
- 自动复制配置文件
- 显示环境配置信息

### 环境信息查看

```bash
# 查看当前环境详细信息
npm run env:info

# 对比所有环境配置
npm run env:info --compare

# 显示所有信息
npm run env:info --all
```

## 代码中使用环境配置

### 1. 使用环境工具函数

```javascript
import { 
  getCurrentEnv, 
  isDev, 
  isUat, 
  isProd,
  getApiBaseUrl,
  isDebugMode
} from '@config/env.config'

// 获取当前环境
const env = getCurrentEnv() // 'dev', 'uat', 'prod'

// 环境判断
if (isDev()) {
  console.log('开发环境')
}

// 获取API地址
const apiUrl = getApiBaseUrl()

// 调试模式
if (isDebugMode()) {
  console.log('调试信息')
}
```

### 2. 使用process.env

```javascript
// 应用信息
const appName = process.env.APP_NAME
const version = process.env.APP_VERSION

// API配置
const apiBaseUrl = process.env.API_BASE_URL
const timeout = process.env.API_TIMEOUT

// 功能开关
const enableMock = process.env.ENABLE_MOCK === 'true'
const enableCache = process.env.ENABLE_CACHE === 'true'
```

### 3. Vue组件中使用

```vue
<template>
  <div>
    <h1>{{ $env.APP_NAME }}</h1>
    <p>版本: {{ $env.APP_VERSION }}</p>
    <p>环境: {{ $env.APP_ENV }}</p>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log('当前环境:', this.$env.APP_ENV)
    
    if (this.$env.DEBUG_MODE) {
      console.log('调试模式已启用')
    }
  }
}
</script>
```

## 部署配置

编辑 `scripts/deploy.js` 文件配置部署服务器信息：

```javascript
const deployConfigs = {
  dev: {
    server: 'your-dev-server.com',
    user: 'deployer',
    path: '/var/www/gin-shop-dev'
  },
  uat: {
    server: 'your-uat-server.com', 
    user: 'deployer',
    path: '/var/www/gin-shop-uat'
  },
  prod: {
    server: 'your-prod-server.com',
    user: 'deployer', 
    path: '/var/www/gin-shop-prod'
  }
}
```

## 注意事项

1. **环境文件安全**：不要将包含敏感信息的`.env`文件提交到版本控制系统
2. **API地址**：确保不同环境的API地址正确配置
3. **构建优化**：生产环境会自动启用代码压缩和优化
4. **调试信息**：生产环境会自动禁用控制台日志和调试工具
5. **错误监控**：生产环境建议启用错误上报功能

## 故障排除

### 环境切换失败

```bash
# 检查文件是否存在
ls -la .env*

# 手动创建文件
touch .env.dev .env.uat .env.prod
```

### API请求失败

```bash
# 检查环境配置
npm run env:info

# 验证API地址
curl <API_BASE_URL>/health
```

### 构建错误

```bash
# 清理依赖并重新安装
rm -rf node_modules package-lock.json
npm install

# 检查环境变量
npm run env:info
``` 