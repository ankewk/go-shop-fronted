<template>
  <el-container class="app-container">
    <!-- 头部导航 -->
    <el-header class="app-header">
      <div class="header-content">
        <!-- Logo和标题 -->
        <div class="brand">
          <el-icon class="brand-icon"><Shop /></el-icon>
          <span class="brand-title">Gin商城</span>
        </div>
        
        <!-- 导航菜单 -->
        <el-menu
          :default-active="$route.path"
          mode="horizontal"
          @select="handleMenuSelect"
          class="header-menu"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.path"
            :index="item.path"
            :class="{ active: $route.path === item.path }"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
            <el-badge
              v-if="item.path === '/cart' && cartItemCount > 0"
              :value="cartItemCount"
              class="cart-badge"
            />
          </el-menu-item>
        </el-menu>
        
        <!-- 用户选择器 -->
        <div class="user-selector">
          <el-select
            :model-value="currentUser.id"
            @change="handleUserChange"
            placeholder="选择用户"
            size="default"
          >
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </div>
      </div>
    </el-header>
    
    <!-- 主体内容 -->
    <el-main class="app-main">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </el-main>
    
    <!-- 底部 -->
    <el-footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 Gin商城. 基于Vue3 + Gin微服务架构的现代电商平台</p>
        <div class="footer-links">
          <a href="#" @click.prevent>关于我们</a>
          <a href="#" @click.prevent>联系我们</a>
          <a href="#" @click.prevent>帮助中心</a>
        </div>
      </div>
    </el-footer>
  </el-container>
  
  <!-- 全局通知 -->
  <Teleport to="body">
    <div class="global-notifications">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', `notification-${notification.type}`]"
        >
          <el-icon class="notification-icon">
            <SuccessFilled v-if="notification.type === 'success'" />
            <CircleCloseFilled v-else-if="notification.type === 'error'" />
            <WarningFilled v-else-if="notification.type === 'warning'" />
            <InfoFilled v-else />
          </el-icon>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
          </div>
          <el-button
            type="text"
            @click="removeNotification(notification.id)"
            class="notification-close"
          >
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { menuConfig } from '@/router'
import {
  Shop,
  House,
  Box,
  ShoppingCart,
  Document,
  User,
  SuccessFilled,
  CircleCloseFilled,
  WarningFilled,
  InfoFilled,
  Close
} from '@element-plus/icons-vue'

const router = useRouter()
const store = useStore()

// 计算属性
const currentUser = computed(() => store.state.user.currentUser)
const userList = computed(() => store.state.user.userList)
const cartItemCount = computed(() => store.getters['cart/cartItemCount'])
const notifications = computed(() => store.getters['app/notifications'])

// 菜单项
const menuItems = computed(() => {
  return menuConfig.map(item => ({
    ...item,
    badge: item.path === '/cart' ? cartItemCount.value : 0
  }))
})

// 方法
const handleMenuSelect = (index) => {
  router.push(index)
}

const handleUserChange = (userId) => {
  store.dispatch('user/switchUser', userId).then(result => {
    if (result.success) {
      store.dispatch('app/showSuccess', `已切换到${userList.value.find(u => u.id === userId)?.name}`)
    } else {
      store.dispatch('app/showError', result.error || '切换用户失败')
    }
  })
}

const removeNotification = (id) => {
  store.commit('app/REMOVE_NOTIFICATION', id)
}

// 生命周期
onMounted(() => {
  // 初始化应用
  store.dispatch('app/initApp')
})
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0;
  height: 64px;
  line-height: 64px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  
  @media (min-width: 992px) {
    padding: 0 32px;
  }
  
  @media (min-width: 1400px) {
    padding: 0 48px;
  }
}

.brand {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #409EFF;
  
  .brand-icon {
    font-size: 28px;
    margin-right: 8px;
  }
}

.header-menu {
  flex: 1;
  margin: 0 40px;
  border-bottom: none;
  
  @media (min-width: 1200px) {
    margin: 0 60px;
  }
  
  :deep(.el-menu-item) {
    position: relative;
    border-bottom: 2px solid transparent;
    font-size: 15px;
    font-weight: 500;
    
    @media (min-width: 1200px) {
      font-size: 16px;
      padding: 0 24px;
    }
    
    &:hover,
    &.is-active {
      color: #409EFF;
      border-bottom-color: #409EFF;
      background: rgba(64, 158, 255, 0.04);
    }
    
    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}

.cart-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.user-selector {
  :deep(.el-select) {
    width: 120px;
  }
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 124px);
  
  @media (min-width: 768px) {
    padding: 24px;
  }
  
  @media (min-width: 992px) {
    padding: 32px;
  }
  
  @media (min-width: 1200px) {
    padding: 40px;
  }
  
  @media (min-width: 1400px) {
    padding: 48px;
  }
}

.app-footer {
  background: #fff;
  border-top: 1px solid #e4e7ed;
  height: 60px;
  line-height: 60px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 14px;
  color: #909399;
  
  @media (min-width: 992px) {
    padding: 0 32px;
  }
  
  @media (min-width: 1400px) {
    padding: 0 48px;
  }
}

.footer-links {
  display: flex;
  gap: 20px;
  
  a {
    color: #909399;
    text-decoration: none;
    
    &:hover {
      color: #409EFF;
    }
  }
}

// 全局通知样式
.global-notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: flex-start;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  margin-bottom: 16px;
  border-left: 4px solid;
  
  &.notification-success {
    border-left-color: #67C23A;
  }
  
  &.notification-error {
    border-left-color: #F56C6C;
  }
  
  &.notification-warning {
    border-left-color: #E6A23C;
  }
  
  &.notification-info {
    border-left-color: #409EFF;
  }
}

.notification-icon {
  font-size: 20px;
  margin-right: 12px;
  margin-top: 2px;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #303133;
}

.notification-message {
  color: #606266;
  font-size: 14px;
}

.notification-close {
  padding: 0;
  margin-left: 8px;
  color: #909399;
  
  &:hover {
    color: #606266;
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

// 响应式设计
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .brand {
    font-size: 18px;
    
    .brand-title {
      display: none;
    }
  }
  
  .header-menu {
    margin: 0 20px;
    
    :deep(.el-menu-item span) {
      display: none;
    }
  }
  
  .user-selector {
    :deep(.el-select) {
      width: 80px;
    }
  }
  
  .app-main {
    padding: 16px;
  }
  
  .footer-content {
    flex-direction: column;
    height: auto;
    padding: 16px;
    
    .footer-links {
      margin-top: 8px;
    }
  }
}
</style> 