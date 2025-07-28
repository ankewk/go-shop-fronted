<template>
  <view class="index-page">
    <!-- 轮播图 -->
    <swiper class="banner-swiper" indicator-dots circular autoplay>
      <swiper-item v-for="(banner, index) in banners" :key="index">
        <image :src="banner.image" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 快速导航 -->
    <view class="quick-nav">
      <view 
        v-for="nav in quickNavs" 
        :key="nav.id"
        class="nav-item"
        @click="handleNavClick(nav)"
      >
        <view class="nav-icon">{{ nav.icon }}</view>
        <text class="nav-text">{{ nav.text }}</text>
      </view>
    </view>

    <!-- 商品推荐 -->
    <view class="recommend-section">
      <view class="section-header">
        <text class="section-title">推荐商品</text>
        <text class="more-btn" @click="navigateToProducts">更多 ></text>
      </view>
      
      <view class="product-grid">
        <view 
          v-for="product in recommendProducts" 
          :key="product.id"
          class="product-item"
          @click="navigateToDetail(product.id)"
        >
          <image :src="product.image" mode="aspectFill" class="product-image" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <view class="product-price">
              <text class="price">¥{{ product.price }}</text>
              <text v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部间距 -->
    <view class="bottom-spacing"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      banners: [
        { image: '/static/images/banner1.jpg', link: '' },
        { image: '/static/images/banner2.jpg', link: '' },
        { image: '/static/images/banner3.jpg', link: '' }
      ],
      quickNavs: [
        { id: 1, icon: '🛍️', text: '全部商品', path: '/pages/products/products' },
        { id: 2, icon: '🔥', text: '热门推荐', path: '/pages/products/products?hot=1' },
        { id: 3, icon: '💰', text: '优惠专区', path: '/pages/products/products?sale=1' },
        { id: 4, icon: '⭐', text: '精选好物', path: '/pages/products/products?featured=1' }
      ],
      recommendProducts: []
    }
  },

  onLoad() {
    this.loadRecommendProducts()
  },

  onPullDownRefresh() {
    this.loadRecommendProducts()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },

  methods: {
    async loadRecommendProducts() {
      try {
        // 模拟数据
        this.recommendProducts = [
          {
            id: 1,
            name: '精选商品1',
            price: 99.99,
            originalPrice: 129.99,
            image: '/static/images/product1.jpg'
          },
          {
            id: 2,
            name: '热门商品2',
            price: 199.99,
            image: '/static/images/product2.jpg'
          },
          {
            id: 3,
            name: '推荐商品3',
            price: 299.99,
            originalPrice: 399.99,
            image: '/static/images/product3.jpg'
          },
          {
            id: 4,
            name: '优质商品4',
            price: 159.99,
            image: '/static/images/product4.jpg'
          }
        ]
      } catch (error) {
        console.error('加载推荐商品失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },

    handleNavClick(nav) {
      this.$navigation.navigateTo(nav.path)
    },

    navigateToProducts() {
      this.$navigation.switchTab('/pages/products/products')
    },

    navigateToDetail(productId) {
      this.$navigation.navigateTo(`/pages/product-detail/product-detail?id=${productId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.index-page {
  background-color: $bg-light;
}

.banner-swiper {
  width: 100%;
  height: 400rpx;
  
  image {
    width: 100%;
    height: 100%;
  }
}

.quick-nav {
  display: flex;
  background-color: $bg-white;
  padding: 40rpx 20rpx;
  margin-bottom: 20rpx;
  
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .nav-icon {
      font-size: 60rpx;
      margin-bottom: 10rpx;
    }
    
    .nav-text {
      font-size: 24rpx;
      color: $text-secondary;
    }
  }
}

.recommend-section {
  background-color: $bg-white;
  padding: 30rpx 20rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $text-primary;
    }
    
    .more-btn {
      font-size: 28rpx;
      color: $primary-color;
    }
  }
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  
  .product-item {
    width: calc(50% - 10rpx);
    border-radius: $uni-border-radius-lg;
    overflow: hidden;
    background-color: $bg-white;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    .product-image {
      width: 100%;
      height: 200rpx;
    }
    
    .product-info {
      padding: 20rpx;
      
      .product-name {
        font-size: 28rpx;
        color: $text-primary;
        display: block;
        margin-bottom: 10rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .product-price {
        display: flex;
        align-items: center;
        
        .price {
          font-size: 32rpx;
          color: $primary-color;
          font-weight: bold;
        }
        
        .original-price {
          font-size: 24rpx;
          color: $text-secondary;
          text-decoration: line-through;
          margin-left: 10rpx;
        }
      }
    }
  }
}

.bottom-spacing {
  height: 40rpx;
}
</style> 