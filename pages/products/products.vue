<template>
  <view class="products-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <uni-icons type="search" size="20" color="#999"></uni-icons>
        <input v-model="searchKeyword" placeholder="搜索商品" @confirm="handleSearch" />
      </view>
      <view class="filter-btn" @click="showFilter = true">
        <uni-icons type="tune" size="20"></uni-icons>
      </view>
    </view>

    <!-- 分类标签 -->
    <scroll-view scroll-x class="category-tabs">
      <view class="tab-list">
        <view 
          v-for="category in categories" 
          :key="category.id"
          :class="['tab-item', { active: selectedCategory === category.id }]"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </view>
      </view>
    </scroll-view>

    <!-- 排序方式 -->
    <view class="sort-bar">
      <view 
        v-for="sort in sortOptions" 
        :key="sort.key"
        :class="['sort-item', { active: selectedSort === sort.key }]"
        @click="selectSort(sort.key)"
      >
        {{ sort.label }}
        <uni-icons v-if="sort.key === 'price'" type="arrowupdown" size="14"></uni-icons>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="products-container">
      <view v-if="loading" class="loading">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      
      <view v-else-if="products.length === 0" class="empty">
        <uni-icons type="search" size="80" color="#ccc"></uni-icons>
        <text>暂无商品</text>
      </view>
      
      <view v-else class="products-grid">
        <view 
          v-for="product in products" 
          :key="product.id"
          class="product-card"
          @click="navigateToDetail(product.id)"
        >
          <image :src="product.image" mode="aspectFill" class="product-image" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-desc">{{ product.description }}</text>
            <view class="product-price">
              <text class="current-price">¥{{ product.price }}</text>
              <text v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</text>
            </view>
            <view class="product-actions">
              <view class="stock-info">
                <text>库存: {{ product.stock }}</text>
              </view>
              <button class="add-cart-btn" size="mini" type="primary" @click.stop="addToCart(product)">
                加入购物车
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view v-if="!loading && hasMore" class="load-more" @click="loadMore">
      <uni-load-more status="more" iconType="snow" :contentText="loadMoreText"></uni-load-more>
    </view>

    <!-- 筛选弹窗 -->
    <uni-popup ref="filterPopup" type="bottom">
      <view class="filter-content">
        <view class="filter-header">
          <text>筛选</text>
          <view class="close-btn" @click="showFilter = false">
            <uni-icons type="close" size="20"></uni-icons>
          </view>
        </view>
        <!-- 筛选内容 -->
        <view class="filter-body">
          <view class="filter-section">
            <text class="filter-title">价格区间</text>
            <view class="price-range">
              <input type="number" v-model="priceRange.min" placeholder="最低价" />
              <text>-</text>
              <input type="number" v-model="priceRange.max" placeholder="最高价" />
            </view>
          </view>
        </view>
        <view class="filter-footer">
          <button @click="resetFilter">重置</button>
          <button type="primary" @click="applyFilter">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      selectedCategory: 0,
      selectedSort: 'default',
      loading: false,
      hasMore: true,
      showFilter: false,
      page: 1,
      pageSize: 10,
      categories: [
        { id: 0, name: '全部' },
        { id: 1, name: '电子产品' },
        { id: 2, name: '服装' },
        { id: 3, name: '食品' },
        { id: 4, name: '图书' }
      ],
      sortOptions: [
        { key: 'default', label: '默认' },
        { key: 'price', label: '价格' },
        { key: 'sales', label: '销量' },
        { key: 'newest', label: '最新' }
      ],
      products: [],
      priceRange: {
        min: '',
        max: ''
      },
      loadMoreText: {
        contentdown: '点击加载更多',
        contentrefresh: '加载中...',
        contentnomore: '没有更多了'
      }
    }
  },

  onLoad(options) {
    // 处理页面参数
    if (options.category) {
      this.selectedCategory = parseInt(options.category)
    }
    if (options.hot) {
      this.selectedSort = 'sales'
    }
    
    this.loadProducts()
  },

  onPullDownRefresh() {
    this.refreshProducts()
  },

  onReachBottom() {
    this.loadMore()
  },

  watch: {
    showFilter(newVal) {
      if (newVal) {
        this.$refs.filterPopup.open()
      } else {
        this.$refs.filterPopup.close()
      }
    }
  },

  methods: {
    async loadProducts(isRefresh = false) {
      if (this.loading) return
      
      this.loading = true
      
      if (isRefresh) {
        this.page = 1
        this.products = []
        this.hasMore = true
      }
      
      try {
        // 模拟API调用
        await this.simulateApiDelay()
        
        const mockProducts = this.generateMockProducts()
        
        if (isRefresh) {
          this.products = mockProducts
        } else {
          this.products.push(...mockProducts)
        }
        
        // 模拟分页
        if (this.page >= 3) {
          this.hasMore = false
        }
        
        this.page++
        
      } catch (error) {
        console.error('加载商品失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        if (isRefresh) {
          uni.stopPullDownRefresh()
        }
      }
    },

    refreshProducts() {
      this.loadProducts(true)
    },

    loadMore() {
      if (!this.hasMore || this.loading) return
      this.loadProducts()
    },

    selectCategory(categoryId) {
      this.selectedCategory = categoryId
      this.refreshProducts()
    },

    selectSort(sortKey) {
      this.selectedSort = sortKey
      this.refreshProducts()
    },

    handleSearch() {
      this.refreshProducts()
    },

    applyFilter() {
      this.showFilter = false
      this.refreshProducts()
    },

    resetFilter() {
      this.priceRange = { min: '', max: '' }
      this.refreshProducts()
    },

    navigateToDetail(productId) {
      this.$navigation.navigateTo(`/pages/product-detail/product-detail?id=${productId}`)
    },

    addToCart(product) {
      uni.showToast({
        title: '已添加到购物车',
        icon: 'success'
      })
    },

    simulateApiDelay() {
      return new Promise(resolve => setTimeout(resolve, 1000))
    },

    generateMockProducts() {
      const products = []
      for (let i = 0; i < this.pageSize; i++) {
        const id = (this.page - 1) * this.pageSize + i + 1
        products.push({
          id,
          name: `商品 ${id}`,
          description: `这是商品 ${id} 的描述信息`,
          price: Math.floor(Math.random() * 500) + 50,
          originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 600 : null,
          image: `/static/images/product${(id % 4) + 1}.jpg`,
          stock: Math.floor(Math.random() * 100) + 1
        })
      }
      return products
    }
  }
}
</script>

<style lang="scss" scoped>
.products-page {
  background-color: $bg-light;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: $bg-white;
  
  .search-input {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: $bg-lighter;
    border-radius: 50rpx;
    padding: 20rpx 30rpx;
    margin-right: 20rpx;
    
    input {
      flex: 1;
      margin-left: 20rpx;
      font-size: 28rpx;
    }
  }
  
  .filter-btn {
    padding: 20rpx;
  }
}

.category-tabs {
  background-color: $bg-white;
  white-space: nowrap;
  
  .tab-list {
    display: flex;
    padding: 0 20rpx;
    
    .tab-item {
      padding: 20rpx 30rpx;
      font-size: 28rpx;
      color: $text-secondary;
      white-space: nowrap;
      
      &.active {
        color: $primary-color;
        font-weight: bold;
      }
    }
  }
}

.sort-bar {
  display: flex;
  background-color: $bg-white;
  border-top: 1rpx solid $border-light;
  
  .sort-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30rpx 20rpx;
    font-size: 28rpx;
    color: $text-secondary;
    
    &.active {
      color: $primary-color;
    }
  }
}

.products-container {
  padding: 20rpx;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: $text-secondary;
}

.products-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-card {
  display: flex;
  background-color: $bg-white;
  border-radius: $uni-border-radius-lg;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  
  .product-image {
    width: 200rpx;
    height: 200rpx;
    flex-shrink: 0;
  }
  
  .product-info {
    flex: 1;
    padding: 30rpx;
    display: flex;
    flex-direction: column;
    
    .product-name {
      font-size: 32rpx;
      font-weight: bold;
      color: $text-primary;
      margin-bottom: 10rpx;
    }
    
    .product-desc {
      font-size: 24rpx;
      color: $text-secondary;
      margin-bottom: 20rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .product-price {
      margin-bottom: 20rpx;
      
      .current-price {
        font-size: 36rpx;
        color: $primary-color;
        font-weight: bold;
      }
      
      .original-price {
        font-size: 24rpx;
        color: $text-secondary;
        text-decoration: line-through;
        margin-left: 20rpx;
      }
    }
    
    .product-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      
      .stock-info {
        font-size: 24rpx;
        color: $text-secondary;
      }
      
      .add-cart-btn {
        font-size: 24rpx;
      }
    }
  }
}

.load-more {
  padding: 40rpx 0;
}

.filter-content {
  background-color: $bg-white;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;
  
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid $border-light;
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .filter-body {
    padding: 30rpx;
    max-height: 60vh;
    overflow-y: auto;
    
    .filter-section {
      margin-bottom: 40rpx;
      
      .filter-title {
        font-size: 28rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
        display: block;
      }
      
      .price-range {
        display: flex;
        align-items: center;
        gap: 20rpx;
        
        input {
          flex: 1;
          border: 1rpx solid $border-base;
          border-radius: $uni-border-radius-base;
          padding: 20rpx;
          font-size: 28rpx;
        }
      }
    }
  }
  
  .filter-footer {
    display: flex;
    gap: 20rpx;
    padding: 30rpx;
    border-top: 1rpx solid $border-light;
    
    button {
      flex: 1;
    }
  }
}
</style> 