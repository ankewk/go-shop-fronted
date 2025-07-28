import api from '@/api'

const state = {
  orders: [],
  currentOrder: null,
  loading: false,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  },
  filters: {
    status: ''
  },
  orderSummary: {
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0,
    shippedOrders: 0,
    totalAmount: 0,
    todayOrders: 0,
    todayAmount: 0
  }
}

const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  },
  
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  
  SET_ORDER_SUMMARY(state, summary) {
    state.orderSummary = { ...state.orderSummary, ...summary }
  },
  
  ADD_ORDER(state, order) {
    state.orders.unshift(order)
  },
  
  UPDATE_ORDER(state, updatedOrder) {
    const index = state.orders.findIndex(o => o.id === updatedOrder.id)
    if (index !== -1) {
      state.orders.splice(index, 1, updatedOrder)
    }
    // 如果当前订单也需要更新
    if (state.currentOrder && state.currentOrder.id === updatedOrder.id) {
      state.currentOrder = updatedOrder
    }
  }
}

const actions = {
  // 获取订单列表
  async fetchOrders({ commit, state, rootGetters }) {
    commit('SET_LOADING', true)
    try {
      const userId = rootGetters['user/currentUserId']
      const params = {
        user_id: userId,
        page: state.pagination.page,
        page_size: state.pagination.pageSize
      }
      
      // 添加状态筛选
      if (state.filters.status) {
        params.status = state.filters.status
      }
      
      const response = await api.get('/orders', { params })
      
      commit('SET_ORDERS', response.data || [])
      if (response.pagination) {
        commit('SET_PAGINATION', response.pagination)
      }
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('获取订单列表失败:', error)
      commit('SET_ORDERS', [])
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取单个订单详情
  async fetchOrder({ commit, rootGetters }, orderId) {
    try {
      const userId = rootGetters['user/currentUserId']
      const response = await api.get(`/orders/${orderId}?user_id=${userId}`)
      commit('SET_CURRENT_ORDER', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('获取订单详情失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 创建订单
  async createOrder({ commit, dispatch, rootGetters }, orderData) {
    try {
      const userId = rootGetters['user/currentUserId']
      const response = await api.post('/orders', {
        ...orderData,
        user_id: userId
      })
      
      commit('ADD_ORDER', response.data)
      
      // 订单创建成功后，清空购物车并重新获取相关数据
      await dispatch('cart/fetchCart', null, { root: true })
      await dispatch('user/fetchUserStats', null, { root: true })
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('创建订单失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 更新订单状态
  async updateOrderStatus({ commit }, { orderId, status, remark = '' }) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status,
        remark
      })
      
      commit('UPDATE_ORDER', response.data)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('更新订单状态失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 取消订单
  async cancelOrder({ commit, rootGetters }, orderId) {
    try {
      const userId = rootGetters['user/currentUserId']
      await api.put(`/orders/${orderId}/cancel?user_id=${userId}`)
      
      // 重新获取订单列表
      await dispatch('fetchOrders')
      
      return { success: true }
    } catch (error) {
      console.error('取消订单失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 支付订单（模拟）
  async payOrder({ commit, dispatch }, orderId) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status: 'paid',
        remark: '模拟支付成功'
      })
      
      commit('UPDATE_ORDER', response.data)
      
      // 重新获取用户统计
      await dispatch('user/fetchUserStats', null, { root: true })
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('支付订单失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 获取订单统计
  async fetchOrderSummary({ commit, rootGetters }) {
    try {
      const userId = rootGetters['user/currentUserId']
      const response = await api.get(`/orders/summary?user_id=${userId}`)
      commit('SET_ORDER_SUMMARY', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('获取订单统计失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 更新分页
  updatePagination({ commit, dispatch }, pagination) {
    commit('SET_PAGINATION', pagination)
    return dispatch('fetchOrders')
  },
  
  // 更新筛选条件
  updateFilters({ commit, dispatch }, filters) {
    commit('SET_FILTERS', filters)
    commit('SET_PAGINATION', { page: 1 }) // 重置到第一页
    return dispatch('fetchOrders')
  }
}

const getters = {
  // 根据状态获取订单
  ordersByStatus: state => status => {
    return state.orders.filter(order => order.status === status)
  },
  
  // 获取待支付订单
  pendingOrders: state => {
    return state.orders.filter(order => order.status === 'pending')
  },
  
  // 获取已支付订单
  paidOrders: state => {
    return state.orders.filter(order => order.status === 'paid')
  },
  
  // 获取运输中订单
  shippedOrders: state => {
    return state.orders.filter(order => order.status === 'shipped')
  },
  
  // 根据ID获取订单
  getOrderById: state => id => {
    return state.orders.find(order => order.id === id)
  },
  
  // 订单状态文本映射
  getStatusText: () => status => {
    const statusMap = {
      pending: '待支付',
      paid: '已支付',
      shipped: '已发货',
      delivered: '已送达',
      cancelled: '已取消',
      refunded: '已退款'
    }
    return statusMap[status] || status
  },
  
  // 订单状态类型（用于样式）
  getStatusType: () => status => {
    const typeMap = {
      pending: 'warning',
      paid: 'success',
      shipped: 'primary',
      delivered: 'info',
      cancelled: 'danger',
      refunded: 'info'
    }
    return typeMap[status] || 'info'
  },
  
  // 最近订单（最近5个）
  recentOrders: state => {
    return [...state.orders]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 