# 🚀 uni-app 多端兼容配置指南

## 🎯 项目概述

本项目已成功配置为支持多端平台的uni-app应用，可以一套代码编译到：

- ✅ **H5网页版** - 浏览器/微信公众号
- ✅ **微信小程序** - 微信生态
- ✅ **支付宝小程序** - 支付宝生态  
- ✅ **百度小程序** - 百度App生态
- ✅ **抖音小程序** - 抖音生态
- ✅ **App应用** - Android/iOS原生应用

## 📁 项目结构

```
gin-shop-frontend/
├── pages/                    # 页面文件
│   ├── index/               # 首页
│   ├── products/            # 商品列表
│   ├── product-detail/      # 商品详情
│   ├── cart/               # 购物车
│   ├── orders/             # 订单列表
│   ├── order-detail/       # 订单详情
│   ├── checkout/           # 结算页面
│   └── profile/            # 个人中心
├── static/                  # 静态资源
│   ├── icons/              # TabBar图标
│   └── images/             # 页面图片
├── utils/                   # 工具函数
│   └── platform-adapter.js # 平台适配器
├── store/                   # Vuex状态管理
├── components/              # 组件
├── scripts/                 # 构建脚本
├── manifest.json           # 应用配置
├── pages.json              # 页面配置
├── uni.scss               # 全局样式变量
├── App.vue                # 应用入口
├── main.js                # 主入口文件
└── vite.config.uni.js     # uni-app构建配置
```

## 🛠️ 环境准备

### 1. 安装依赖

```bash
# 安装Node.js依赖
npm install

# 如果使用yarn
yarn install
```

### 2. 开发工具

根据目标平台安装对应的开发工具：

- **微信小程序**: [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- **支付宝小程序**: [支付宝开发者工具](https://opendocs.alipay.com/mini/ide/download)
- **百度小程序**: [百度开发者工具](https://smartprogram.baidu.com/docs/develop/devtools/download/)
- **抖音小程序**: [抖音开发者工具](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/developer-tool/download)
- **App打包**: [HBuilderX](https://www.dcloud.io/hbuilderx.html)

## 🚀 开发和构建

### 开发模式

```bash
# H5开发模式 (推荐用于开发调试)
npm run dev:h5

# 微信小程序开发模式
npm run dev:mp-weixin

# 支付宝小程序开发模式  
npm run dev:mp-alipay

# 百度小程序开发模式
npm run dev:mp-baidu

# 抖音小程序开发模式
npm run dev:mp-toutiao
```

### 生产构建

```bash
# H5生产构建
npm run build:h5

# 微信小程序生产构建
npm run build:mp-weixin

# 支付宝小程序生产构建
npm run build:mp-alipay

# 百度小程序生产构建
npm run build:mp-baidu

# 抖音小程序生产构建
npm run build:mp-toutiao

# App生产构建
npm run build:app
```

### 使用构建脚本

```bash
# 使用自定义构建脚本
node scripts/build.js h5 production
node scripts/build.js mp-weixin development

# 使用开发脚本
node scripts/dev.js h5
node scripts/dev.js mp-weixin
```

## 🔧 平台适配

### 1. 平台判断

```javascript
import { platform } from '@/utils/platform-adapter'

// 判断当前平台
if (platform.isWeixin) {
  // 微信小程序特定逻辑
} else if (platform.isH5) {
  // H5特定逻辑
} else if (platform.isApp) {
  // App特定逻辑
}
```

### 2. 条件编译

在代码中使用条件编译：

```vue
<template>
  <view>
    <!-- 仅在微信小程序显示 -->
    <!-- #ifdef MP-WEIXIN -->
    <button open-type="getUserInfo">获取微信用户信息</button>
    <!-- #endif -->
    
    <!-- 仅在H5显示 -->
    <!-- #ifdef H5 -->
    <button @click="webLogin">网页登录</button>
    <!-- #endif -->
    
    <!-- 排除小程序平台 -->
    <!-- #ifndef MP -->
    <div class="web-only-content">网页专用内容</div>
    <!-- #endif -->
  </view>
</template>

<style>
/* 小程序平台样式 */
/* #ifdef MP */
.mp-style {
  background: #f0f0f0;
}
/* #endif */

/* H5平台样式 */
/* #ifdef H5 */
.h5-style {
  background: #ffffff;
}
/* #endif */
</style>
```

### 3. API适配

使用平台适配器统一API：

```javascript
// 网络请求
this.$request.get('/api/products')
this.$request.post('/api/orders', orderData)

// 本地存储
this.$storage.set('token', 'your-token')
const token = this.$storage.get('token')

// 页面导航
this.$navigation.navigateTo('/pages/detail/detail?id=1')
this.$navigation.switchTab('/pages/index/index')

// 支付
this.$payment.pay({
  orderInfo: paymentData,
  platform: 'weixin'
})

// 分享
this.$share.share({
  title: '分享标题',
  desc: '分享描述',
  imageUrl: 'share-image.jpg'
})
```

## 📱 平台配置

### 1. 微信小程序

在 `manifest.json` 中配置微信小程序参数：

```json
{
  "mp-weixin": {
    "appid": "your-weixin-appid",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "minified": true
    }
  }
}
```

需要在微信公众平台申请小程序并获取AppID。

### 2. 支付宝小程序

```json
{
  "mp-alipay": {
    "appid": "your-alipay-appid",
    "usingComponents": true
  }
}
```

### 3. App应用

配置App打包参数：

```json
{
  "app-plus": {
    "modules": {
      "OAuth": {},
      "Payment": {},
      "Share": {}
    },
    "distribute": {
      "android": {
        "packagename": "com.ginshop.app"
      },
      "ios": {
        "bundleid": "com.ginshop.app"
      }
    }
  }
}
```

## 🎨 样式适配

### 1. 使用rpx单位

```scss
.container {
  width: 750rpx;        // 响应式宽度
  height: 200rpx;       // 响应式高度
  font-size: 28rpx;     // 响应式字体
}
```

### 2. 全局样式变量

在 `uni.scss` 中定义：

```scss
/* 主题色彩 */
$primary-color: #409EFF;
$success-color: #67C23A;

/* 文字颜色 */
$text-primary: #303133;
$text-secondary: #909399;

/* 间距 */
$uni-spacing-row-base: 10px;
$uni-spacing-col-base: 8px;
```

### 3. 平台特定样式

```scss
/* 通用样式 */
.button {
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
}

/* 微信小程序特定样式 */
/* #ifdef MP-WEIXIN */
.button {
  box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1);
}
/* #endif */

/* H5特定样式 */
/* #ifdef H5 */
.button {
  cursor: pointer;
  transition: all 0.3s ease;
}
/* #endif */
```

## 📦 发布部署

### 1. H5版本

```bash
# 构建H5版本
npm run build:h5

# 部署到Web服务器
# 将 dist/build/h5 目录内容上传到服务器
```

### 2. 小程序版本

```bash
# 构建小程序版本
npm run build:mp-weixin

# 使用开发者工具打开 dist/build/mp-weixin 目录
# 点击上传按钮提交审核
```

### 3. App版本

```bash
# 构建App版本
npm run build:app

# 使用HBuilderX打开项目
# 选择云端打包或本地打包
```

## 🐛 调试技巧

### 1. 多平台调试

```javascript
// 调试信息
console.log('当前平台:', process.env.UNI_PLATFORM)
console.log('系统信息:', uni.getSystemInfoSync())

// 平台特定调试
// #ifdef MP-WEIXIN
console.log('微信小程序调试信息')
// #endif

// #ifdef H5
console.log('H5调试信息')
// #endif
```

### 2. 真机调试

- **H5**: 浏览器开发者工具
- **小程序**: 各平台开发者工具的真机调试功能
- **App**: HBuilderX基座调试或自定义基座

### 3. 错误处理

```javascript
// 全局错误处理
uni.onError((error) => {
  console.error('全局错误:', error)
  // 上报错误到监控平台
})

// 未处理的Promise错误
uni.onUnhandledRejection((event) => {
  console.error('未处理的Promise错误:', event)
})
```

## ⚠️ 注意事项

### 1. API限制

- 小程序有网络请求域名白名单限制
- App需要配置网络权限
- H5受同源策略限制

### 2. 包体积

- 小程序主包限制2MB，总包限制20MB
- 使用分包和按需加载优化

### 3. 性能优化

- 避免频繁的setData操作（小程序）
- 合理使用图片懒加载
- 优化网络请求频次

### 4. 用户体验

- 考虑不同平台的交互习惯
- 适配不同屏幕尺寸
- 处理网络异常情况

## 🔗 相关链接

- [uni-app官方文档](https://uniapp.dcloud.io/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [支付宝小程序开发文档](https://opendocs.alipay.com/mini)
- [百度小程序开发文档](https://smartprogram.baidu.com/docs/introduction/enter_application/)
- [抖音小程序开发文档](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/introduction/overview)

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

🎉 **恭喜！你的Vue3项目现在已支持多端平台！**

通过以上配置，你可以：
- 一套代码维护多个平台
- 使用平台适配器统一API差异  
- 通过条件编译处理平台特性
- 享受uni-app强大的生态支持

开始你的多端开发之旅吧！ 🚀 