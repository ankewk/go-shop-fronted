const state = {
  // 应用配置
  config: {
    title: 'Gin商城',
    version: '2.0.0',
    apiBaseUrl: '/api/v1'
  },
  
  // UI状态
  loading: false,
  sidebarCollapsed: false,
  
  // 通知消息
  notifications: [],
  
  // 主题设置
  theme: {
    mode: 'light', // light | dark
    primaryColor: '#409EFF',
    layout: 'default' // default | compact
  },
  
  // 设备信息
  device: {
    isMobile: false,
    isTablet: false,
    isDesktop: true
  }
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  TOGGLE_SIDEBAR(state) {
    state.sidebarCollapsed = !state.sidebarCollapsed
  },
  
  SET_SIDEBAR_COLLAPSED(state, collapsed) {
    state.sidebarCollapsed = collapsed
  },
  
  ADD_NOTIFICATION(state, notification) {
    const id = Date.now() + Math.random()
    state.notifications.push({
      id,
      type: 'info',
      duration: 3000,
      ...notification
    })
  },
  
  REMOVE_NOTIFICATION(state, id) {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      state.notifications.splice(index, 1)
    }
  },
  
  CLEAR_NOTIFICATIONS(state) {
    state.notifications = []
  },
  
  SET_THEME(state, theme) {
    state.theme = { ...state.theme, ...theme }
  },
  
  SET_DEVICE(state, device) {
    state.device = { ...state.device, ...device }
  },
  
  UPDATE_CONFIG(state, config) {
    state.config = { ...state.config, ...config }
  }
}

const actions = {
  // 显示加载状态
  showLoading({ commit }) {
    commit('SET_LOADING', true)
  },
  
  // 隐藏加载状态
  hideLoading({ commit }) {
    commit('SET_LOADING', false)
  },
  
  // 显示通知消息
  showNotification({ commit }, notification) {
    const id = commit('ADD_NOTIFICATION', notification)
    
    // 自动移除通知
    if (notification.duration !== 0) {
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', id)
      }, notification.duration || 3000)
    }
    
    return id
  },
  
  // 显示成功消息
  showSuccess({ dispatch }, message) {
    return dispatch('showNotification', {
      type: 'success',
      title: '成功',
      message
    })
  },
  
  // 显示错误消息
  showError({ dispatch }, message) {
    return dispatch('showNotification', {
      type: 'error',
      title: '错误',
      message,
      duration: 5000
    })
  },
  
  // 显示警告消息
  showWarning({ dispatch }, message) {
    return dispatch('showNotification', {
      type: 'warning',
      title: '警告',
      message
    })
  },
  
  // 显示信息消息
  showInfo({ dispatch }, message) {
    return dispatch('showNotification', {
      type: 'info',
      title: '提示',
      message
    })
  },
  
  // 切换侧边栏
  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  
  // 设置侧边栏状态
  setSidebarCollapsed({ commit }, collapsed) {
    commit('SET_SIDEBAR_COLLAPSED', collapsed)
  },
  
  // 设置主题
  setTheme({ commit }, theme) {
    commit('SET_THEME', theme)
    
    // 保存到本地存储
    localStorage.setItem('app_theme', JSON.stringify(theme))
  },
  
  // 初始化主题
  initTheme({ commit }) {
    try {
      const savedTheme = localStorage.getItem('app_theme')
      if (savedTheme) {
        const theme = JSON.parse(savedTheme)
        commit('SET_THEME', theme)
      }
    } catch (error) {
      console.error('初始化主题失败:', error)
    }
  },
  
  // 检测设备类型
  detectDevice({ commit }) {
    const width = window.innerWidth
    const device = {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024
    }
    commit('SET_DEVICE', device)
    return device
  },
  
  // 初始化应用
  async initApp({ dispatch }) {
    try {
      // 初始化主题
      dispatch('initTheme')
      
      // 检测设备
      dispatch('detectDevice')
      
      // 监听窗口大小变化
      window.addEventListener('resize', () => {
        dispatch('detectDevice')
      })
      
      return { success: true }
    } catch (error) {
      console.error('初始化应用失败:', error)
      return { success: false, error: error.message }
    }
  }
}

const getters = {
  // 是否显示加载状态
  isLoading: state => state.loading,
  
  // 侧边栏是否折叠
  isSidebarCollapsed: state => state.sidebarCollapsed,
  
  // 获取通知列表
  notifications: state => state.notifications,
  
  // 获取主题配置
  theme: state => state.theme,
  
  // 是否为暗色主题
  isDarkMode: state => state.theme.mode === 'dark',
  
  // 获取设备信息
  device: state => state.device,
  
  // 是否为移动设备
  isMobile: state => state.device.isMobile,
  
  // 是否为平板设备
  isTablet: state => state.device.isTablet,
  
  // 是否为桌面设备
  isDesktop: state => state.device.isDesktop,
  
  // 获取应用配置
  config: state => state.config,
  
  // 获取API基础URL
  apiBaseUrl: state => state.config.apiBaseUrl
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 