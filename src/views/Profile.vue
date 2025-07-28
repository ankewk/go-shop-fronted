<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>个人中心</h1>
    </div>
    
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card title="用户信息">
          <div class="user-info">
            <div class="avatar">
              <el-icon size="64"><User /></el-icon>
            </div>
            <h3>{{ currentUser.name }}</h3>
            <p>{{ currentUser.email }}</p>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card title="订单统计">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ userStats.totalOrders }}</div>
              <div class="stat-label">总订单数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">¥{{ userStats.totalAmount?.toFixed(2) }}</div>
              <div class="stat-label">总消费</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ userStats.pendingOrders }}</div>
              <div class="stat-label">待支付</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ userStats.shippedOrders }}</div>
              <div class="stat-label">运输中</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { User } from '@element-plus/icons-vue'

const store = useStore()

const currentUser = computed(() => store.state.user.currentUser)
const userStats = computed(() => store.state.user.userStats)

onMounted(() => {
  store.dispatch('user/fetchUserStats')
})
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.user-info {
  text-align: center;
  
  .avatar {
    margin-bottom: 16px;
    color: #409EFF;
  }
  
  h3 {
    margin-bottom: 8px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #409EFF;
    margin-bottom: 8px;
  }
  
  .stat-label {
    color: #606266;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 