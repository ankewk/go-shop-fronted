<script>
import { createSSRApp } from 'vue'
export default {
  globalData: {
    userInfo: null,
    systemInfo: null
  },
  
  onLaunch: function (options) {
    console.log('App Launch', options)
    // 获取系统信息
    this.getSystemInfo()
    // 初始化用户信息
    this.initUserInfo()
  },
  
  onShow: function (options) {
    console.log('App Show', options)
  },
  
  onHide: function () {
    console.log('App Hide')
  },
  
  onError: function (err) {
    console.error('App Error:', err)
  },
  
  methods: {
    getSystemInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync()
        this.globalData.systemInfo = systemInfo
        console.log('System Info:', systemInfo)
      } catch (e) {
        console.error('获取系统信息失败:', e)
      }
    },
    
    initUserInfo() {
      // 从本地存储获取用户信息
      try {
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo) {
          this.globalData.userInfo = userInfo
        }
      } catch (e) {
        console.error('获取用户信息失败:', e)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/uni.scss';

/* 全局样式 */
page {
  background-color: $bg-light;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  font-size: $uni-font-size-base;
  line-height: 1.6;
}

/* 通用布局类 */
.container {
  padding: $uni-spacing-col-base $uni-spacing-row-base;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

/* 通用文字类 */
.text-primary {
  color: $text-primary;
}

.text-secondary {
  color: $text-secondary;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

/* 通用间距类 */
.margin-top {
  margin-top: $uni-spacing-col-base;
}

.margin-bottom {
  margin-bottom: $uni-spacing-col-base;
}

.padding {
  padding: $uni-spacing-col-base $uni-spacing-row-base;
}

/* 通用按钮样式 */
.btn-primary {
  background-color: $primary-color;
  color: #fff;
  border: none;
  border-radius: $uni-border-radius-base;
  padding: 12rpx 24rpx;
  font-size: $uni-font-size-base;
}

.btn-secondary {
  background-color: $bg-white;
  color: $primary-color;
  border: 1rpx solid $primary-color;
  border-radius: $uni-border-radius-base;
  padding: 12rpx 24rpx;
  font-size: $uni-font-size-base;
}

/* 通用卡片样式 */
.card {
  background-color: $bg-white;
  border-radius: $uni-border-radius-lg;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  margin-bottom: $uni-spacing-col-base;
  overflow: hidden;
}

.card-header {
  padding: $uni-spacing-col-base $uni-spacing-row-base;
  border-bottom: 1rpx solid $border-light;
  font-weight: bold;
  color: $text-primary;
}

.card-content {
  padding: $uni-spacing-col-base $uni-spacing-row-base;
}

/* 通用列表样式 */
.list-item {
  padding: $uni-spacing-col-base $uni-spacing-row-base;
  border-bottom: 1rpx solid $border-light;
  background-color: $bg-white;
  
  &:last-child {
    border-bottom: none;
  }
}

/* 响应式适配 */
/* #ifdef MP */
.mp-only {
  display: block;
}

.h5-only {
  display: none;
}
/* #endif */

/* #ifdef H5 */
.mp-only {
  display: none;
}

.h5-only {
  display: block;
}
/* #endif */

/* #ifdef APP */
.app-only {
  display: block;
}

.mp-only,
.h5-only {
  display: none;
}
/* #endif */
</style> 