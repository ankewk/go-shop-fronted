import api from '@/api'

const state = {
  products: [],
  currentProduct: null,
  loading: false,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  },
  filters: {
    category: '',
    priceRange: [0, 10000],
    inStock: true
  }
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
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
  
  ADD_PRODUCT(state, product) {
    state.products.unshift(product)
  },
  
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
  },
  
  DELETE_PRODUCT(state, productId) {
    const index = state.products.findIndex(p => p.id === productId)
    if (index !== -1) {
      state.products.splice(index, 1)
    }
  },
  
  UPDATE_PRODUCT_STOCK(state, { productId, newStock }) {
    const product = state.products.find(p => p.id === productId)
    if (product) {
      product.stock = newStock
    }
  }
}

const actions = {
  // 获取产品列表
  async fetchProducts({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const params = {
        page: state.pagination.page,
        page_size: state.pagination.pageSize
      }
      
      // 添加筛选条件
      if (state.filters.category) {
        params.category = state.filters.category
      }
      
      const response = await api.get('/products', { params })
      
      commit('SET_PRODUCTS', response.data || [])
      if (response.pagination) {
        commit('SET_PAGINATION', response.pagination)
      }
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('获取产品列表失败:', error)
      commit('SET_PRODUCTS', [])
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取单个产品详情
  async fetchProduct({ commit }, productId) {
    try {
      const response = await api.get(`/products/${productId}`)
      commit('SET_CURRENT_PRODUCT', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('获取产品详情失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 创建产品
  async createProduct({ commit }, productData) {
    try {
      const response = await api.post('/products', productData)
      commit('ADD_PRODUCT', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('创建产品失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 更新产品
  async updateProduct({ commit }, { productId, updates }) {
    try {
      const response = await api.put(`/products/${productId}`, updates)
      commit('UPDATE_PRODUCT', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('更新产品失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 删除产品
  async deleteProduct({ commit }, productId) {
    try {
      await api.delete(`/products/${productId}`)
      commit('DELETE_PRODUCT', productId)
      return { success: true }
    } catch (error) {
      console.error('删除产品失败:', error)
      return { success: false, error: error.message }
    }
  },
  
  // 更新分页
  updatePagination({ commit, dispatch }, pagination) {
    commit('SET_PAGINATION', pagination)
    return dispatch('fetchProducts')
  },
  
  // 更新筛选条件
  updateFilters({ commit, dispatch }, filters) {
    commit('SET_FILTERS', filters)
    commit('SET_PAGINATION', { page: 1 }) // 重置到第一页
    return dispatch('fetchProducts')
  },
  
  // 减少库存（下单时调用）
  reduceStock({ commit }, { productId, quantity }) {
    const product = state.products.find(p => p.id === productId)
    if (product && product.stock >= quantity) {
      const newStock = product.stock - quantity
      commit('UPDATE_PRODUCT_STOCK', { productId, newStock })
      return true
    }
    return false
  }
}

const getters = {
  // 获取可用产品（库存大于0）
  availableProducts: state => {
    return state.products.filter(product => product.stock > 0)
  },
  
  // 根据分类获取产品
  productsByCategory: state => category => {
    return state.products.filter(product => product.category === category)
  },
  
  // 根据价格范围获取产品
  productsByPriceRange: state => (min, max) => {
    return state.products.filter(product => 
      product.price >= min && product.price <= max
    )
  },
  
  // 获取产品分类列表
  categories: state => {
    const categories = [...new Set(state.products.map(p => p.category))]
    return categories.filter(Boolean)
  },
  
  // 根据ID获取产品
  getProductById: state => id => {
    return state.products.find(product => product.id === id)
  },
  
  // 获取热门产品（按价格排序）
  popularProducts: state => {
    return [...state.products]
      .sort((a, b) => b.price - a.price)
      .slice(0, 6)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 