<template>
  <div class="orders-page">
    <div class="page-header">
      <h1>我的订单</h1>
      <el-button type="primary" @click="refreshOrders">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>
    
    <div v-loading="loading">
      <el-empty v-if="orders.length === 0" description="暂无订单数据">
        <el-button type="primary" @click="$router.push('/products')">去购物</el-button>
      </el-empty>
      
      <div v-else class="orders-list">
        <el-card v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-number">订单号: {{ order.order_no }}</span>
            <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
          </div>
          <div class="order-total">总金额: ¥{{ order.total_amount?.toFixed(2) }}</div>
          <div class="order-date">下单时间: {{ formatDate(order.created_at) }}</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Refresh } from '@element-plus/icons-vue'

const store = useStore()

const orders = computed(() => store.state.orders.orders)
const loading = computed(() => store.state.orders.loading)

const refreshOrders = () => {
  store.dispatch('orders/fetchOrders')
}

const getStatusText = (status) => {
  const map = { pending: '待支付', paid: '已支付', shipped: '已发货', delivered: '已送达', cancelled: '已取消' }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = { pending: 'warning', paid: 'success', shipped: 'primary', delivered: 'info', cancelled: 'danger' }
  return map[status] || 'info'
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  refreshOrders()
})
</script>

<style lang="scss" scoped>
.orders-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .order-number {
    font-weight: 600;
  }
  
  .order-total {
    color: #409EFF;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .order-date {
    color: #606266;
    font-size: 14px;
  }
}
</style> 