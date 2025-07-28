import api from '@/api'

const state = {
  currentUser: {
    id: 1,
    name: '用户1',
    email: 'user1@example.com',
    phone: '13888888888',
    avatar: '',
    status: 1
  },
  userList: [
    { id: 1, name: '用户1', email: 'user1@example.com' },
    { id: 2, name: '用户2', email: 'user2@example.com' },
    { id: 3, name: '用户3', email: 'user3@example.com' },
    { id: 4, name: '用户4', email: 'user4@example.com' }
  ],
  userStats: {
    totalOrders: 0,
    totalAmount: 0,
    pendingOrders: 0,
    shippedOrders: 0
  }
}

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  
  SET_USER_LIST(state, users) {
    state.userList = users
  },
  
  SET_USER_STATS(state, stats) {
    state.userStats = stats
  },
  
  UPDATE_CURRENT_USER(state, updates) {
    state.currentUser = { ...state.currentUser, ...updates }
  }
}

const actions = {
  // 初始化当前用户
  initCurrentUser({ commit, state }) {
    const savedUserId = localStorage.getItem('currentUserId')
    if (savedUserId) {
      const userId = parseInt(savedUserId)
      const user = state.userList.find(u => u.id === userId)
      if (user) {
        commit('SET_CURRENT_USER', { ...state.currentUser, ...user })
      }
    }
  },
  
  // 切换用户
  async switchUser({ commit, dispatch }, userId) {
    try {
      const user = state.userList.find(u => u.id === userId)
      if (user) {
        commit('SET_CURRENT_USER', { ...state.currentUser, ...user })
        localStorage.setItem('currentUserId', userId.toString())
        
        // 切换用户后重新加载相关数据
        await dispatch('cart/fetchCart', null, { root: true })
        await dispatch('orders/fetchOrders', null, { root: true })
        await dispatch('user/fetchUserStats')
        
        return { success: true }
      } else {
        throw new Error('用户不存在')
      }
    } catch (error) {
      console.error('切换用户失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 获取用户统计信息
  async fetchUserStats({ commit, state }) {
    try {
      const response = await api.get(`/orders/summary?user_id=${state.currentUser.id}`)
      commit('SET_USER_STATS', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('获取用户统计失败:', error)
      // 如果API调用失败，使用默认值
      commit('SET_USER_STATS', {
        totalOrders: 0,
        totalAmount: 0,
        pendingOrders: 0,
        shippedOrders: 0
      })
      return { success: false, error: error.message }
    }
  },
  
  // 获取用户列表
  async fetchUsers({ commit }) {
    try {
      const response = await api.get('/users')
      commit('SET_USER_LIST', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 更新用户信息
  async updateUser({ commit, state }, updates) {
    try {
      const response = await api.put(`/users/${state.currentUser.id}`, updates)
      commit('UPDATE_CURRENT_USER', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return { success: false, error: error.message }
    }
  }
}

const getters = {
  currentUserId: state => state.currentUser.id,
  currentUserName: state => state.currentUser.name,
  currentUserEmail: state => state.currentUser.email,
  isCurrentUser: state => id => state.currentUser.id === id
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 