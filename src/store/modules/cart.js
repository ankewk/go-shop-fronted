import api from '@/api'

const state = {
  cart: {
    id: null,
    items: [],
    total: 0,
    itemCount: 0
  },
  loading: false
}

const mutations = {
  SET_CART(state, cart) {
    state.cart = cart || {
      id: null,
      items: [],
      total: 0,
      itemCount: 0
    }
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  ADD_CART_ITEM(state, item) {
    const existingItem = state.cart.items.find(i => i.product_id === item.product_id)
    if (existingItem) {
      existingItem.quantity += item.quantity
      existingItem.total = existingItem.price * existingItem.quantity
    } else {
      state.cart.items.push({
        ...item,
        total: item.price * item.quantity
      })
    }
    calculateCartTotals(state.cart)
  },
  
  UPDATE_CART_ITEM(state, { itemId, quantity }) {
    const item = state.cart.items.find(i => i.id === itemId)
    if (item) {
      if (quantity <= 0) {
        // 删除商品
        const index = state.cart.items.findIndex(i => i.id === itemId)
        state.cart.items.splice(index, 1)
      } else {
        // 更新数量
        item.quantity = quantity
        item.total = item.price * quantity
      }
      calculateCartTotals(state.cart)
    }
  },
  
  REMOVE_CART_ITEM(state, itemId) {
    const index = state.cart.items.findIndex(i => i.id === itemId)
    if (index !== -1) {
      state.cart.items.splice(index, 1)
      calculateCartTotals(state.cart)
    }
  },
  
  CLEAR_CART(state) {
    state.cart.items = []
    state.cart.total = 0
    state.cart.itemCount = 0
  }
}

// 计算购物车总计的辅助函数
function calculateCartTotals(cart) {
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
}

const actions = {
  // 获取购物车
  async fetchCart({ commit, rootGetters }) {
    commit('SET_LOADING', true)
    try {
      const userId = rootGetters['user/currentUserId']
      const response = await api.get(`/cart?user_id=${userId}`)
      
      // 计算每个商品的小计
      if (response.data && response.data.items) {
        response.data.items.forEach(item => {
          item.total = item.price * item.quantity
        })
        calculateCartTotals(response.data)
      }
      
      commit('SET_CART', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('获取购物车失败:', error)
      commit('SET_CART', null)
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 添加商品到购物车
  async addToCart({ commit, dispatch, rootGetters }, { productId, quantity = 1 }) {
    try {
      const userId = rootGetters['user/currentUserId']
      const response = await api.post(`/cart/items?user_id=${userId}`, {
        product_id: productId,
        quantity: quantity
      })
      
      // 重新获取购物车数据
      await dispatch('fetchCart')
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('添加到购物车失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 更新购物车商品数量
  async updateCartItem({ commit, dispatch, rootGetters }, { itemId, quantity }) {
    try {
      const userId = rootGetters['user/currentUserId']
      
      if (quantity <= 0) {
        // 删除商品
        await api.delete(`/cart/items/${itemId}?user_id=${userId}`)
      } else {
        // 更新数量
        await api.put(`/cart/items/${itemId}?user_id=${userId}`, {
          quantity: quantity
        })
      }
      
      // 重新获取购物车数据
      await dispatch('fetchCart')
      
      return { success: true }
    } catch (error) {
      console.error('更新购物车失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 删除购物车商品
  async removeFromCart({ commit, dispatch, rootGetters }, itemId) {
    try {
      const userId = rootGetters['user/currentUserId']
      await api.delete(`/cart/items/${itemId}?user_id=${userId}`)
      
      // 重新获取购物车数据
      await dispatch('fetchCart')
      
      return { success: true }
    } catch (error) {
      console.error('删除购物车商品失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 清空购物车
  async clearCart({ commit, rootGetters }) {
    try {
      const userId = rootGetters['user/currentUserId']
      await api.delete(`/cart?user_id=${userId}`)
      
      commit('CLEAR_CART')
      
      return { success: true }
    } catch (error) {
      console.error('清空购物车失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 获取购物车摘要
  async getCartSummary({ rootGetters }) {
    try {
      const userId = rootGetters['user/currentUserId']
      const response = await api.get(`/cart/summary?user_id=${userId}`)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('获取购物车摘要失败:', error)
      return { success: false, error: error.message }
    }
  }
}

const getters = {
  // 购物车商品数量
  cartItemCount: state => state.cart.itemCount,
  
  // 购物车总金额
  cartTotal: state => state.cart.total,
  
  // 购物车是否为空
  isCartEmpty: state => state.cart.items.length === 0,
  
  // 获取购物车商品列表
  cartItems: state => state.cart.items,
  
  // 根据商品ID检查是否在购物车中
  isInCart: state => productId => {
    return state.cart.items.some(item => item.product_id === productId)
  },
  
  // 获取购物车中某个商品的数量
  getItemQuantity: state => productId => {
    const item = state.cart.items.find(item => item.product_id === productId)
    return item ? item.quantity : 0
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 