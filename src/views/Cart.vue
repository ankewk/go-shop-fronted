<template>
  <div class="cart-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>购物车</h1>
      <el-button 
        v-if="!isCartEmpty" 
        type="danger" 
        @click="handleClearCart"
      >
        <el-icon><Delete /></el-icon>
        清空购物车
      </el-button>
    </div>

    <!-- 购物车内容 -->
    <div v-loading="loading">
      <!-- 空购物车状态 -->
      <div v-if="isCartEmpty" class="empty-cart">
        <el-empty description="购物车为空">
          <el-button type="primary" @click="$router.push('/products')">
            去购物
          </el-button>
        </el-empty>
      </div>

      <!-- 购物车商品列表 -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div 
            v-for="item in cartItems" 
            :key="item.id" 
            class="cart-item"
          >
            <div class="item-image">
              <el-icon class="product-icon"><Box /></el-icon>
            </div>
            
            <div class="item-info">
              <h3 class="item-name">{{ item.product?.name || '商品' }}</h3>
              <p class="item-price">单价: ¥{{ item.price?.toFixed(2) }}</p>
            </div>
            
            <div class="item-quantity">
              <el-input-number
                :model-value="item.quantity"
                :min="1"
                :max="99"
                @change="updateQuantity(item.id, $event)"
              />
            </div>
            
            <div class="item-total">
              <span class="total-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            
            <div class="item-actions">
              <el-button 
                type="danger" 
                size="small" 
                @click="removeItem(item.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 购物车总计 -->
        <div class="cart-summary">
          <el-card>
            <template #header>
              <span>订单摘要</span>
            </template>
            
            <div class="summary-row">
              <span>商品总数:</span>
              <span>{{ cartItemCount }} 件</span>
            </div>
            
            <div class="summary-row total">
              <span>总金额:</span>
              <span class="total-amount">¥{{ cartTotal.toFixed(2) }}</span>
            </div>
            
            <el-button 
              type="primary" 
              size="large" 
              class="checkout-btn"
              @click="goToCheckout"
            >
              <el-icon><CreditCard /></el-icon>
              立即结算
            </el-button>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Box, CreditCard } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()

// 计算属性
const cartItems = computed(() => store.getters['cart/cartItems'])
const cartItemCount = computed(() => store.getters['cart/cartItemCount'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])
const isCartEmpty = computed(() => store.getters['cart/isCartEmpty'])
const loading = computed(() => store.state.cart.loading)

// 方法
const updateQuantity = async (itemId, quantity) => {
  if (!quantity || quantity < 1) {
    return
  }
  
  try {
    const result = await store.dispatch('cart/updateCartItem', {
      itemId,
      quantity
    })
    
    if (result.success) {
      ElMessage.success('数量已更新')
    } else {
      ElMessage.error(result.error || '更新失败')
    }
  } catch (error) {
    ElMessage.error('更新失败: ' + error.message)
  }
}

const removeItem = async (itemId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个商品吗？',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await store.dispatch('cart/removeFromCart', itemId)
    
    if (result.success) {
      ElMessage.success('商品已删除')
    } else {
      ElMessage.error(result.error || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败: ' + error.message)
    }
  }
}

const handleClearCart = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空购物车吗？',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await store.dispatch('cart/clearCart')
    
    if (result.success) {
      ElMessage.success('购物车已清空')
    } else {
      ElMessage.error(result.error || '清空失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空失败: ' + error.message)
    }
  }
}

const goToCheckout = () => {
  if (isCartEmpty.value) {
    ElMessage.warning('购物车为空')
    return
  }
  router.push('/checkout')
}

// 生命周期
onMounted(() => {
  store.dispatch('cart/fetchCart')
})
</script>

<style lang="scss" scoped>
.cart-page {
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    margin: 0;
    color: #303133;
  }
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 992px) {
    grid-template-columns: 1fr 320px;
    gap: 32px;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 360px;
    gap: 40px;
  }
}

.cart-items {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px 60px;
  gap: 16px;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.item-image {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .product-icon {
    font-size: 32px;
    color: white;
  }
}

.item-info {
  .item-name {
    font-weight: 600;
    margin-bottom: 4px;
    color: #303133;
  }
  
  .item-price {
    color: #606266;
    margin: 0;
  }
}

.item-total {
  text-align: right;
  
  .total-price {
    font-weight: 600;
    color: #409EFF;
    font-size: 1.1rem;
  }
}

.cart-summary {
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 1rem;
    
    &.total {
      font-size: 1.2rem;
      font-weight: bold;
      color: #409EFF;
      border-top: 1px solid #f0f0f0;
      padding-top: 12px;
      margin-top: 12px;
    }
  }
  
  .total-amount {
    font-size: 1.5rem;
  }
  
  .checkout-btn {
    width: 100%;
    margin-top: 20px;
    height: 48px;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 60px 1fr 80px;
    gap: 12px;
    
    .item-quantity,
    .item-total,
    .item-actions {
      grid-column: 2 / -1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style> 