<template>
  <div class="products-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>商品列表</h1>
      <el-button type="primary" @click="refreshProducts">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <!-- 商品网格 -->
    <div v-loading="loading" class="products-container">
      <div v-if="products.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无商品数据">
          <el-button type="primary" @click="refreshProducts">重新加载</el-button>
        </el-empty>
      </div>
      
      <div v-else class="products-grid">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="product-card"
        >
          <div class="product-image">
            <el-icon class="product-icon">
              <Box />
            </el-icon>
          </div>
          
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description || '暂无描述' }}</p>
            <div class="product-price">¥{{ product.price?.toFixed(2) }}</div>
            <div class="product-stock">
              <el-tag :type="product.stock > 0 ? 'success' : 'danger'" size="small">
                库存: {{ product.stock }}
              </el-tag>
            </div>
            
            <div class="product-actions">
              <div class="quantity-selector">
                <el-input-number
                  v-model="productQuantities[product.id]"
                  :min="1"
                  :max="product.stock"
                  size="small"
                  :disabled="product.stock === 0"
                  @change="updateQuantity(product.id, $event)"
                />
              </div>
              <el-button
                type="primary"
                size="default"
                :disabled="product.stock === 0"
                :loading="addingToCart[product.id]"
                @click="addToCart(product)"
              >
                <el-icon><ShoppingCart /></el-icon>
                {{ product.stock === 0 ? '缺货' : '加入购物车' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { Refresh, Box, ShoppingCart } from '@element-plus/icons-vue'

const store = useStore()

// 响应式数据
const productQuantities = reactive({})
const addingToCart = reactive({})

// 计算属性
const products = computed(() => store.state.products.products)
const loading = computed(() => store.state.products.loading)

// 初始化商品数量
const initializeQuantities = () => {
  products.value.forEach(product => {
    if (!productQuantities[product.id]) {
      productQuantities[product.id] = 1
    }
  })
}

// 方法
const refreshProducts = async () => {
  try {
    await store.dispatch('products/fetchProducts')
    initializeQuantities()
    ElMessage.success('商品列表刷新成功')
  } catch (error) {
    ElMessage.error('刷新失败: ' + error.message)
  }
}

const updateQuantity = (productId, value) => {
  productQuantities[productId] = value || 1
}

const addToCart = async (product) => {
  const quantity = productQuantities[product.id] || 1
  
  if (quantity > product.stock) {
    ElMessage.warning('数量不能大于库存')
    return
  }
  
  addingToCart[product.id] = true
  
  try {
    const result = await store.dispatch('cart/addToCart', {
      productId: product.id,
      quantity
    })
    
    if (result.success) {
      ElMessage.success(`${product.name} 已添加到购物车`)
      // 重置数量
      productQuantities[product.id] = 1
    } else {
      ElMessage.error(result.error || '添加失败')
    }
  } catch (error) {
    ElMessage.error('添加到购物车失败: ' + error.message)
  } finally {
    addingToCart[product.id] = false
  }
}

// 生命周期
onMounted(() => {
  if (products.value.length === 0) {
    refreshProducts()
  } else {
    initializeQuantities()
  }
})
</script>

<style lang="scss" scoped>
.products-page {
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

.products-container {
  min-height: 400px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }
  
  @media (min-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 28px;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 32px;
  }
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.product-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .product-icon {
    font-size: 64px;
    color: white;
  }
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.product-description {
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.product-stock {
  margin-bottom: 16px;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  
  :deep(.el-input-number) {
    width: 120px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style> 