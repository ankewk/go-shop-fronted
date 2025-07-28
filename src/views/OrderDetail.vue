<template>
  <div class="order-detail">
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
          <span>订单详情</span>
        </div>
      </template>
      
      <div v-if="loading" class="loading">
        <el-skeleton :rows="8" animated />
      </div>
      
      <div v-else-if="order" class="order-content">
        <!-- 订单基本信息 -->
        <div class="order-info">
          <el-descriptions title="订单信息" :column="2" border>
            <el-descriptions-item label="订单号">
              {{ order.orderNo }}
            </el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="getStatusType(order.status)">
                {{ getStatusText(order.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="下单时间">
              {{ formatTime(order.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="支付时间">
              {{ order.paidAt ? formatTime(order.paidAt) : '未支付' }}
            </el-descriptions-item>
            <el-descriptions-item label="收货地址" :span="2">
              {{ order.address }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        
        <!-- 商品列表 -->
        <div class="order-items">
          <h3>商品信息</h3>
          <el-table :data="order.items" style="width: 100%">
            <el-table-column label="商品">
              <template #default="{ row }">
                <div class="product-info">
                  <el-image
                    :src="row.image || '/api/placeholder/60/60'"
                    style="width: 60px; height: 60px;"
                    fit="cover"
                  />
                  <div class="product-details">
                    <div class="product-name">{{ row.name }}</div>
                    <div class="product-spec">{{ row.spec || '默认规格' }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="120">
              <template #default="{ row }">
                ¥{{ row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column label="小计" width="120">
              <template #default="{ row }">
                ¥{{ (row.price * row.quantity).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 费用明细 -->
        <div class="order-summary">
          <el-row justify="end">
            <el-col :span="8">
              <div class="summary-item">
                <span>商品金额：</span>
                <span>¥{{ order.subtotal }}</span>
              </div>
              <div class="summary-item">
                <span>运费：</span>
                <span>¥{{ order.shippingFee || 0 }}</span>
              </div>
              <div class="summary-item">
                <span>优惠金额：</span>
                <span class="discount">-¥{{ order.discount || 0 }}</span>
              </div>
              <el-divider />
              <div class="summary-item total">
                <span>实付金额：</span>
                <span class="amount">¥{{ order.total }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <!-- 操作按钮 -->
        <div class="order-actions">
          <el-button 
            v-if="order.status === 'pending'" 
            type="primary"
            @click="payOrder"
          >
            立即支付
          </el-button>
          <el-button 
            v-if="order.status === 'pending'" 
            @click="cancelOrder"
          >
            取消订单
          </el-button>
          <el-button 
            v-if="order.status === 'shipped'" 
            type="success"
            @click="confirmReceive"
          >
            确认收货
          </el-button>
        </div>
      </div>
      
      <el-empty v-else description="订单不存在" />
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'OrderDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const loading = ref(true)
    const order = ref(null)
    
    const fetchOrder = async () => {
      try {
        loading.value = true
        const orderId = route.params.id
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟数据
        order.value = {
          id: orderId,
          orderNo: `ORDER${orderId}${Date.now()}`,
          status: 'paid',
          createdAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
          address: '北京市海淀区中关村软件园 18号楼 101室',
          items: [
            {
              id: 1,
              name: '示例商品1',
              image: '/api/placeholder/60/60',
              spec: '红色/XL',
              price: 99.99,
              quantity: 2
            },
            {
              id: 2,
              name: '示例商品2',
              image: '/api/placeholder/60/60',
              spec: '蓝色/L',
              price: 59.99,
              quantity: 1
            }
          ],
          subtotal: 259.97,
          shippingFee: 10.00,
          discount: 20.00,
          total: 249.97
        }
      } catch (error) {
        console.error('获取订单详情失败:', error)
        ElMessage.error('获取订单详情失败')
      } finally {
        loading.value = false
      }
    }
    
    const getStatusType = (status) => {
      const statusMap = {
        pending: 'warning',
        paid: 'success',
        shipped: 'primary',
        completed: 'success',
        cancelled: 'danger'
      }
      return statusMap[status] || 'info'
    }
    
    const getStatusText = (status) => {
      const statusMap = {
        pending: '待支付',
        paid: '已支付',
        shipped: '已发货',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || '未知状态'
    }
    
    const formatTime = (time) => {
      return new Date(time).toLocaleString()
    }
    
    const payOrder = () => {
      ElMessage.success('支付功能开发中...')
    }
    
    const cancelOrder = async () => {
      try {
        await ElMessageBox.confirm('确定要取消此订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        ElMessage.success('订单已取消')
        order.value.status = 'cancelled'
      } catch {
        // 用户取消操作
      }
    }
    
    const confirmReceive = async () => {
      try {
        await ElMessageBox.confirm('确定已收到商品吗？', '确认收货', {
          confirmButtonText: '确认收货',
          cancelButtonText: '取消',
          type: 'success'
        })
        
        ElMessage.success('确认收货成功')
        order.value.status = 'completed'
      } catch {
        // 用户取消操作
      }
    }
    
    onMounted(() => {
      fetchOrder()
    })
    
    return {
      loading,
      order,
      getStatusType,
      getStatusText,
      formatTime,
      payOrder,
      cancelOrder,
      confirmReceive
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
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
  
  .order-content {
    .order-info {
      margin-bottom: 30px;
    }
    
    .order-items {
      margin-bottom: 30px;
      
      h3 {
        margin-bottom: 15px;
        color: #303133;
      }
      
      .product-info {
        display: flex;
        align-items: center;
        
        .product-details {
          margin-left: 15px;
          
          .product-name {
            font-weight: 500;
            color: #303133;
            margin-bottom: 5px;
          }
          
          .product-spec {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
    
    .order-summary {
      margin-bottom: 30px;
      
      @media (min-width: 992px) {
        .el-row {
          justify-content: flex-end;
        }
        
        .el-col {
          max-width: 400px;
        }
      }
      
      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 15px;
        
        @media (min-width: 768px) {
          font-size: 16px;
          margin-bottom: 14px;
        }
        
        &.total {
          font-size: 16px;
          font-weight: bold;
          
          .amount {
            color: #f56c6c;
          }
        }
        
        .discount {
          color: #67c23a;
        }
      }
    }
    
    .order-actions {
      text-align: center;
      
      .el-button {
        margin: 0 10px;
      }
    }
  }
}
</style> 