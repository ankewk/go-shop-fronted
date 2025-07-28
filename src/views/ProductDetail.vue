<template>
  <div class="product-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button 
            type="text" 
            @click="$router.back()"
            style="padding: 0; margin-right: 10px;"
          >
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <span>商品详情</span>
        </div>
      </template>
      
      <div v-if="loading" class="loading">
        <el-skeleton :rows="5" animated />
      </div>
      
      <div v-else-if="product" class="product-content">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <div class="product-images">
              <el-image
                :src="product.image || '/api/placeholder/400/400'"
                :preview-src-list="[product.image || '/api/placeholder/400/400']"
                fit="cover"
                class="main-image"
              />
            </div>
          </el-col>
          
          <el-col :xs="24" :md="12">
            <div class="product-info">
              <h1 class="product-title">{{ product.name }}</h1>
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="original-price">
                  ¥{{ product.originalPrice }}
                </span>
              </div>
              
              <div class="product-meta">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="库存">
                    {{ product.stock || 0 }} 件
                  </el-descriptions-item>
                  <el-descriptions-item label="分类">
                    {{ product.category || '暂无' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="品牌">
                    {{ product.brand || '暂无' }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
              
              <div class="product-actions">
                <el-input-number 
                  v-model="quantity" 
                  :min="1" 
                  :max="product.stock || 1"
                  style="margin-right: 10px;"
                />
                <el-button 
                  type="primary" 
                  @click="addToCart"
                  :disabled="!product.stock"
                >
                  加入购物车
                </el-button>
                <el-button 
                  type="danger" 
                  @click="buyNow"
                  :disabled="!product.stock"
                >
                  立即购买
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        
        <el-divider />
        
        <div class="product-description">
          <h3>商品描述</h3>
          <div class="description-content">
            {{ product.description || '暂无描述' }}
          </div>
        </div>
      </div>
      
      <el-empty v-else description="商品不存在" />
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: 'ProductDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    
    const loading = ref(true)
    const product = ref(null)
    const quantity = ref(1)
    
    const fetchProduct = async () => {
      try {
        loading.value = true
        const productId = route.params.id
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟数据
        product.value = {
          id: productId,
          name: `商品 ${productId}`,
          price: 99.99,
          originalPrice: 129.99,
          image: '/api/placeholder/400/400',
          stock: 50,
          category: '电子产品',
          brand: '示例品牌',
          description: '这是一个示例商品的详细描述。包含了商品的各种特性和优势。'
        }
      } catch (error) {
        console.error('获取商品详情失败:', error)
        ElMessage.error('获取商品详情失败')
      } finally {
        loading.value = false
      }
    }
    
    const addToCart = () => {
      store.dispatch('cart/addItem', {
        ...product.value,
        quantity: quantity.value
      })
      ElMessage.success('已添加到购物车')
    }
    
    const buyNow = () => {
      addToCart()
      router.push('/checkout')
    }
    
    onMounted(() => {
      fetchProduct()
    })
    
    return {
      loading,
      product,
      quantity,
      addToCart,
      buyNow
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
  
  @media (min-width: 1200px) {
    padding: 32px 40px;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    font-weight: bold;
  }
  
  .loading {
    padding: 20px;
  }
  
  .product-content {
    .product-images {
      .main-image {
        width: 100%;
        height: 400px;
        border-radius: 8px;
      }
    }
    
          .product-info {
        padding-left: 20px;
        
        @media (min-width: 992px) {
          padding-left: 32px;
        }
        
        @media (min-width: 1200px) {
          padding-left: 40px;
        }
        
        @media (max-width: 768px) {
          padding-left: 0;
          margin-top: 20px;
        }
      
      .product-title {
        font-size: 24px;
        margin: 0 0 20px 0;
        color: #303133;
      }
      
      .product-price {
        margin-bottom: 20px;
        
        .current-price {
          font-size: 28px;
          color: #f56c6c;
          font-weight: bold;
        }
        
        .original-price {
          margin-left: 10px;
          font-size: 16px;
          color: #909399;
          text-decoration: line-through;
        }
      }
      
      .product-meta {
        margin-bottom: 30px;
      }
      
              .product-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          
          @media (min-width: 768px) {
            gap: 16px;
          }
          
          .el-input-number {
            @media (min-width: 768px) {
              margin-right: 8px;
            }
          }
          
          .el-button {
            @media (min-width: 768px) {
              padding: 12px 20px;
            }
          }
        }
    }
    
    .product-description {
      margin-top: 30px;
      
      h3 {
        margin-bottom: 15px;
        color: #303133;
      }
      
      .description-content {
        line-height: 1.8;
        color: #606266;
      }
    }
  }
}
</style> 