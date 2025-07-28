<template>
  <div class="home-page">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <el-card class="welcome-card">
        <div class="banner-content">
          <div class="banner-text">
            <h1>欢迎来到 Gin商城</h1>
            <p>基于Vue3 + Gin微服务架构的现代化电商平台</p>
            <div class="banner-features">
              <el-tag type="primary">微服务架构</el-tag>
              <el-tag type="success">Vue3 + Vuex</el-tag>
              <el-tag type="info">Element Plus</el-tag>
              <el-tag type="warning">响应式设计</el-tag>
            </div>
          </div>
          <div class="banner-stats">
            <el-statistic
              title="商品总数"
              :value="productCount"
              prefix="🛍️"
            />
            <el-statistic
              title="当前用户"
              :value="currentUser.name"
              prefix="👤"
            />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <h2>快速操作</h2>
      <div class="action-grid">
        <el-card class="action-card" @click="$router.push('/products')">
          <el-icon class="action-icon"><Box /></el-icon>
          <h3>浏览商品</h3>
          <p>查看所有商品</p>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/cart')">
          <el-icon class="action-icon"><ShoppingCart /></el-icon>
          <h3>购物车</h3>
          <p>{{ cartItemCount }} 件商品</p>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/orders')">
          <el-icon class="action-icon"><Document /></el-icon>
          <h3>我的订单</h3>
          <p>查看订单状态</p>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/profile')">
          <el-icon class="action-icon"><User /></el-icon>
          <h3>个人中心</h3>
          <p>管理个人信息</p>
        </el-card>
      </div>
    </div>

    <!-- 系统状态 -->
    <div class="system-status">
      <h2>系统状态</h2>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card title="服务状态">
            <div class="status-list">
              <div class="status-item">
                <span>用户服务</span>
                <el-tag type="success" size="small">运行中</el-tag>
              </div>
              <div class="status-item">
                <span>商品服务</span>
                <el-tag type="success" size="small">运行中</el-tag>
              </div>
              <div class="status-item">
                <span>购物车服务</span>
                <el-tag type="success" size="small">运行中</el-tag>
              </div>
              <div class="status-item">
                <span>订单服务</span>
                <el-tag type="success" size="small">运行中</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card title="技术栈">
            <div class="tech-stack">
              <div class="tech-item">
                <span class="tech-label">前端</span>
                <span>Vue3 + Vuex + Element Plus</span>
              </div>
              <div class="tech-item">
                <span class="tech-label">后端</span>
                <span>Gin + GORM + MySQL</span>
              </div>
              <div class="tech-item">
                <span class="tech-label">架构</span>
                <span>微服务 + API网关</span>
              </div>
              <div class="tech-item">
                <span class="tech-label">部署</span>
                <span>Docker + Docker Compose</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Box, ShoppingCart, Document, User } from '@element-plus/icons-vue'

const store = useStore()

const currentUser = computed(() => store.state.user.currentUser)
const cartItemCount = computed(() => store.getters['cart/cartItemCount'])
const productCount = computed(() => store.state.products.products.length)

onMounted(() => {
  // 确保数据已加载
  if (store.state.products.products.length === 0) {
    store.dispatch('products/fetchProducts')
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
  
  @media (min-width: 1200px) {
    padding: 32px 40px;
  }
}

.welcome-banner {
  margin-bottom: 40px;
  
  .welcome-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    
    :deep(.el-card__body) {
      padding: 40px;
    }
  }
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (min-width: 1200px) {
    padding: 20px 0;
  }
  
  h1 {
    font-size: 2.2rem;
    margin-bottom: 16px;
    font-weight: 600;
    
    @media (min-width: 768px) {
      font-size: 2.5rem;
    }
    
    @media (min-width: 1200px) {
      font-size: 3rem;
    }
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 24px;
    opacity: 0.9;
    
    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
    
    @media (min-width: 1200px) {
      font-size: 1.3rem;
    }
  }
}

.banner-features {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.banner-stats {
  display: flex;
  gap: 40px;
  
  :deep(.el-statistic) {
    .el-statistic__content {
      color: white;
    }
    
    .el-statistic__head {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.quick-actions {
  margin-bottom: 40px;
  
  h2 {
    margin-bottom: 24px;
    color: #303133;
  }
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}

.action-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .action-icon {
    font-size: 48px;
    color: #409EFF;
    margin-bottom: 16px;
  }
  
  h3 {
    margin-bottom: 8px;
    color: #303133;
  }
  
  p {
    color: #606266;
    margin: 0;
  }
}

.system-status {
  h2 {
    margin-bottom: 24px;
    color: #303133;
  }
}

.status-list {
  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.tech-stack {
  .tech-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .tech-label {
      font-weight: 600;
      color: #409EFF;
    }
  }
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
    
    .banner-stats {
      margin-top: 20px;
    }
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style> 