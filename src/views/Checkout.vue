<template>
  <div class="checkout-page">
    <div class="page-header">
      <h1>订单结算</h1>
    </div>
    
    <el-row :gutter="24">
      <el-col :span="16">
        <el-card title="收货信息">
          <el-form :model="orderForm" label-width="100px">
            <el-form-item label="收货地址" required>
              <el-input v-model="orderForm.shipping_address" placeholder="请输入收货地址" />
            </el-form-item>
            <el-form-item label="联系人" required>
              <el-input v-model="orderForm.contact_name" placeholder="请输入联系人姓名" />
            </el-form-item>
            <el-form-item label="联系电话" required>
              <el-input v-model="orderForm.contact_phone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="支付方式">
              <el-select v-model="orderForm.payment_method">
                <el-option label="支付宝" value="alipay" />
                <el-option label="微信支付" value="wechat" />
                <el-option label="银行卡" value="card" />
              </el-select>
            </el-form-item>
            <el-form-item label="订单备注">
              <el-input v-model="orderForm.remark" type="textarea" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card title="订单摘要">
          <div class="order-summary">
            <div class="summary-row">
              <span>商品总数:</span>
              <span>{{ cartItemCount }} 件</span>
            </div>
            <div class="summary-row total">
              <span>总金额:</span>
              <span>¥{{ cartTotal.toFixed(2) }}</span>
            </div>
            <el-button 
              type="primary" 
              size="large" 
              class="submit-btn"
              :loading="submitting"
              @click="submitOrder"
            >
              确认下单
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()

const submitting = ref(false)
const orderForm = ref({
  shipping_address: '北京市朝阳区XXX街道',
  contact_name: '',
  contact_phone: '13888888888',
  payment_method: 'alipay',
  remark: ''
})

const cartItemCount = computed(() => store.getters['cart/cartItemCount'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])
const currentUser = computed(() => store.state.user.currentUser)

const submitOrder = async () => {
  submitting.value = true
  
  try {
    const result = await store.dispatch('orders/createOrder', orderForm.value)
    
    if (result.success) {
      ElMessage.success('订单创建成功！')
      router.push('/orders')
    } else {
      ElMessage.error(result.error || '创建订单失败')
    }
  } catch (error) {
    ElMessage.error('创建订单失败: ' + error.message)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (cartItemCount.value === 0) {
    ElMessage.warning('购物车为空，请先添加商品')
    router.push('/products')
    return
  }
  
  orderForm.value.contact_name = currentUser.value.name
})
</script>

<style lang="scss" scoped>
.checkout-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.order-summary {
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    
    &.total {
      font-size: 1.2rem;
      font-weight: bold;
      color: #409EFF;
      border-top: 1px solid #f0f0f0;
      padding-top: 12px;
      margin-top: 12px;
    }
  }
  
  .submit-btn {
    width: 100%;
    margin-top: 20px;
  }
}
</style> 