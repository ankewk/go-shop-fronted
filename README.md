# Gin电商平台 - Vue3前端

## 📋 项目简介

基于Vue3 + Vuex + Element Plus的现代化电商平台前端，采用前后端分离架构。

## 🛠️ 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **状态管理**: Vuex 4.1+
- **UI组件**: Element Plus 2.4+
- **构建工具**: Vite 5.0+
- **路由**: Vue Router 4.2+
- **HTTP客户端**: Axios 1.6+
- **样式**: SCSS + CSS变量
- **开发语言**: JavaScript ES2022
- **容器化**: Docker + Nginx

## 📁 项目结构

```
src/
├── api/                    # API接口封装
│   └── index.js           # Axios配置和拦截器
├── assets/                # 静态资源
│   └── styles/            # 样式文件
├── components/            # 公共组件
├── router/                # 路由配置
│   └── index.js          # Vue Router配置
├── store/                 # Vuex状态管理
│   ├── index.js          # Store入口
│   └── modules/          # 模块化Store
│       ├── user.js       # 用户状态
│       ├── products.js   # 商品状态
│       ├── cart.js       # 购物车状态
│       ├── orders.js     # 订单状态
│       └── app.js        # 应用全局状态
├── views/                 # 页面组件
│   ├── Layout.vue        # 布局组件
│   ├── Home.vue          # 首页
│   ├── Products.vue      # 商品列表
│   ├── Cart.vue          # 购物车
│   ├── Orders.vue        # 订单列表
│   ├── Checkout.vue      # 订单结算
│   └── Profile.vue       # 个人中心
├── App.vue               # 根组件
└── main.js               # 入口文件
```

## 🚀 快速开始

### 前置要求
- Node.js 18+ 
- npm 8+ 或 yarn 1.22+

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发环境
```bash
# 启动开发服务器
npm run dev

# 访问地址
http://localhost:3000
```

### 生产构建
```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### Docker部署
```bash
# 构建Docker镜像
docker build -t gin-frontend .

# 运行容器
docker run -p 3000:80 gin-frontend
```

## 🌟 功能特性

### 核心功能
- 🏠 **首页**: 平台概览和快速导航
- 📦 **商品浏览**: 商品列表、搜索、筛选
- 🛒 **购物车**: 添加商品、数量调整、价格计算
- 📋 **订单管理**: 下单、订单查询、状态跟踪
- 👤 **用户中心**: 个人信息、订单统计

### 技术特性
- ⚡ **性能优化**: 路由懒加载、组件缓存
- 📱 **响应式设计**: 支持桌面端和移动端
- 🔄 **状态管理**: Vuex模块化状态管理
- 🎨 **UI组件**: Element Plus完整组件库
- 🚦 **路由守卫**: 页面权限控制
- 📡 **API拦截**: 统一错误处理和加载状态
- 🎯 **类型安全**: 完善的数据校验

## 🔧 开发指南

### API配置
```javascript
// src/api/index.js
const api = axios.create({
  baseURL: '/api/v1',  // 代理到后端网关
  timeout: 30000
})
```

### 状态管理
```javascript
// 使用Vuex状态
import { useStore } from 'vuex'
const store = useStore()

// 获取状态
const products = computed(() => store.state.products.products)

// 触发动作
store.dispatch('products/fetchProducts')
```

### 路由配置
```javascript
// 添加新路由
{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('@/views/NewPage.vue'),
  meta: { title: '新页面' }
}
```

### 样式开发
```scss
// 使用SCSS变量
@import '@/assets/styles/variables.scss';

.component {
  color: $primary-color;
  padding: $spacing-md;
}
```

## 🔗 API接口

### 后端服务
- **API网关**: http://localhost:8080/api/v1
- **用户服务**: /users
- **商品服务**: /products  
- **购物车服务**: /cart
- **订单服务**: /orders

### 代理配置
开发环境通过Vite代理转发到后端：
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## 🎨 UI设计

### 主题配置
- **主色调**: #409EFF (Element Plus蓝)
- **成功色**: #67C23A
- **警告色**: #E6A23C  
- **危险色**: #F56C6C
- **字体**: 'Helvetica Neue', 'Microsoft YaHei'

### 响应式断点
- **移动端**: < 768px
- **平板端**: 768px - 1024px
- **桌面端**: > 1024px

## 📊 构建配置

### Vite配置
- **自动导入**: Element Plus组件按需导入
- **路径别名**: `@` 指向 `src` 目录
- **代码分割**: 自动分割第三方库
- **压缩优化**: Gzip压缩和资源优化

### Docker配置
- **多阶段构建**: Node.js构建 + Nginx部署
- **静态文件**: 缓存优化和Gzip压缩
- **代理转发**: API请求转发到后端网关

## 🚢 部署指南

### 开发部署
```bash
# 本地开发
npm run dev

# 确保后端服务运行在 localhost:8080
```

### 生产部署
```bash
# 1. 构建项目
npm run build

# 2. Docker部署
docker build -t gin-frontend .
docker run -p 3000:80 gin-frontend

# 3. 或使用Docker Compose
docker-compose up frontend
```

### 环境变量
```bash
# .env.production
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
VITE_APP_TITLE=Gin商城
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范
- 使用 ESLint 和 Prettier
- 遵循 Vue 3 Composition API 最佳实践
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

## �� 许可证

MIT License 