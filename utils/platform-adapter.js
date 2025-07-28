/**
 * 平台适配器 - 统一不同平台的API差异
 */

// 获取当前平台
export function getCurrentPlatform() {
    // #ifdef MP-WEIXIN
    return 'mp-weixin'
    // #endif

    // #ifdef MP-ALIPAY  
    return 'mp-alipay'
    // #endif

    // #ifdef MP-BAIDU
    return 'mp-baidu'
    // #endif

    // #ifdef MP-TOUTIAO
    return 'mp-toutiao'
    // #endif

    // #ifdef H5
    return 'h5'
    // #endif

    // #ifdef APP-PLUS
    return 'app-plus'
    // #endif

    return 'unknown'
}

// 平台判断
export const platform = {
    isWeixin: getCurrentPlatform() === 'mp-weixin',
    isAlipay: getCurrentPlatform() === 'mp-alipay',
    isBaidu: getCurrentPlatform() === 'mp-baidu',
    isToutiao: getCurrentPlatform() === 'mp-toutiao',
    isH5: getCurrentPlatform() === 'h5',
    isApp: getCurrentPlatform() === 'app-plus',
    isMiniProgram: getCurrentPlatform().startsWith('mp-')
}

// 统一存储API
export const storage = {
    set(key, value) {
        try {
            uni.setStorageSync(key, value)
        } catch (e) {
            console.error('Storage set error:', e)
        }
    },

    get(key) {
        try {
            return uni.getStorageSync(key)
        } catch (e) {
            console.error('Storage get error:', e)
            return null
        }
    },

    remove(key) {
        try {
            uni.removeStorageSync(key)
        } catch (e) {
            console.error('Storage remove error:', e)
        }
    },

    clear() {
        try {
            uni.clearStorageSync()
        } catch (e) {
            console.error('Storage clear error:', e)
        }
    }
}

// 统一网络请求API
export const request = {
    async get(url, data = {}, options = {}) {
        return this.request({ url, data, method: 'GET', ...options })
    },

    async post(url, data = {}, options = {}) {
        return this.request({ url, data, method: 'POST', ...options })
    },

    async put(url, data = {}, options = {}) {
        return this.request({ url, data, method: 'PUT', ...options })
    },

    async delete(url, data = {}, options = {}) {
        return this.request({ url, data, method: 'DELETE', ...options })
    },

    async request(options) {
        const {
            url,
            data = {},
            method = 'GET',
            header = {},
            timeout = 10000,
            ...restOptions
        } = options

        // 添加通用header
        const defaultHeader = {
            'Content-Type': 'application/json',
            ...header
        }

        // 添加token
        const token = storage.get('token')
        if (token) {
            defaultHeader.Authorization = `Bearer ${token}`
        }

        return new Promise((resolve, reject) => {
            uni.request({
                url: this.getFullUrl(url),
                data,
                method,
                header: defaultHeader,
                timeout,
                ...restOptions,
                success: (res) => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(res.data)
                    } else {
                        reject(new Error(`Request failed with status ${res.statusCode}`))
                    }
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    },

    getFullUrl(url) {
        if (url.startsWith('http')) {
            return url
        }

        // 根据平台返回不同的base URL
        const baseURL = this.getBaseURL()
        return `${baseURL}${url.startsWith('/') ? url : '/' + url}`
    },

    getBaseURL() {
        // #ifdef H5
        return process.env.NODE_ENV === 'development'
            ? 'http://localhost:8080'
            : 'https://api.ginshop.com'
        // #endif

        // #ifdef MP
        return 'https://api.ginshop.com'
        // #endif

        // #ifdef APP-PLUS
        return 'https://api.ginshop.com'
        // #endif
    }
}

// 统一导航API
export const navigation = {
    navigateTo(url, options = {}) {
        uni.navigateTo({ url, ...options })
    },

    redirectTo(url, options = {}) {
        uni.redirectTo({ url, ...options })
    },

    reLaunch(url, options = {}) {
        uni.reLaunch({ url, ...options })
    },

    switchTab(url, options = {}) {
        uni.switchTab({ url, ...options })
    },

    navigateBack(delta = 1) {
        uni.navigateBack({ delta })
    }
}

// 统一分享API
export const share = {
    share(options = {}) {
        const { title, desc, imageUrl, path } = options

        // #ifdef MP-WEIXIN
        return {
            title,
            desc,
            imageUrl,
            path
        }
        // #endif

        // #ifdef H5
        if (navigator.share) {
            navigator.share({
                title,
                text: desc,
                url: window.location.href
            })
        }
        // #endif

        // #ifdef APP-PLUS
        uni.share({
            provider: 'weixin',
            scene: 'WXSceneSession',
            type: 0,
            title,
            summary: desc,
            imageUrl
        })
        // #endif
    }
}

// 统一支付API
export const payment = {
    async pay(options = {}) {
        const { orderInfo, platform: payPlatform = 'weixin' } = options

        return new Promise((resolve, reject) => {
            // #ifdef MP-WEIXIN
            uni.requestPayment({
                ...orderInfo,
                success: resolve,
                fail: reject
            })
            // #endif

            // #ifdef MP-ALIPAY
            uni.requestPayment({
                ...orderInfo,
                success: resolve,
                fail: reject
            })
            // #endif

            // #ifdef H5
            // H5支付需要跳转到支付页面
            window.location.href = orderInfo.payUrl
            // #endif

            // #ifdef APP-PLUS
            uni.requestPayment({
                provider: payPlatform,
                ...orderInfo,
                success: resolve,
                fail: reject
            })
            // #endif
        })
    }
}

// 设置平台适配器
export function setupPlatformAdapter(app) {
    // 注册全局属性
    app.config.globalProperties.$platform = platform
    app.config.globalProperties.$storage = storage
    app.config.globalProperties.$request = request
    app.config.globalProperties.$navigation = navigation
    app.config.globalProperties.$share = share
    app.config.globalProperties.$payment = payment

    console.log('Platform adapter initialized for:', getCurrentPlatform())
} 