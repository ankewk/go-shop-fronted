import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { getApiBaseUrl, isDebugMode, getLogLevel } from '@config/env.config'

// 创建axios实例
const api = axios.create({
  baseURL: getApiBaseUrl() + '/api/v1',
  timeout: parseInt(process.env.API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Version': process.env.APP_VERSION || '1.0.0',
    'X-App-Env': process.env.APP_ENV || 'dev'
  }
})

// 加载状态管理
let loading = null
let loadingCount = 0

// 显示加载
function showLoading() {
  if (loadingCount === 0) {
    loading = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  loadingCount++
}

// 隐藏加载
function hideLoading() {
  loadingCount--
  if (loadingCount <= 0) {
    loading?.close()
    loading = null
    loadingCount = 0
  }
}

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 显示加载状态（除了某些不需要显示的请求）
    if (!config.hideLoading) {
      showLoading()
    }

    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 可以在这里添加token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    // 调试日志
    if (isDebugMode()) {
      console.log('🚀 API请求:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        params: config.params,
        data: config.data,
        headers: config.headers
      })
    }

    return config
  },
  error => {
    hideLoading()
    console.error('❌ 请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    hideLoading()

    const { data, status, config } = response

    // 调试日志
    if (isDebugMode()) {
      console.log('✅ API响应:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        status: status,
        data: data
      })
    }

    // 检查业务状态码
    if (data && typeof data.code !== 'undefined') {
      if (data.code === 200) {
        return data
      } else {
        // 业务错误
        const errorMsg = data.message || data.error || '请求失败'
        if (!config.hideError) {
          ElMessage.error(errorMsg)
        }
        return Promise.reject(new Error(errorMsg))
      }
    }

    // 如果没有业务状态码，直接返回数据
    return data
  },
  error => {
    hideLoading()

    // 错误日志
    const logLevel = getLogLevel()
    if (logLevel === 'debug' || logLevel === 'info') {
      console.error('❌ API错误:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      })
    }

    // 错误上报 (生产环境)
    if (process.env.ERROR_REPORTING === 'true' && !isDebugMode()) {
      reportError(error)
    }

    let errorMessage = '网络错误，请稍后重试'

    if (error.response) {
      // 服务器响应错误
      const { status, data } = error.response

      switch (status) {
        case 400:
          errorMessage = data?.message || data?.error || '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          // 可以在这里处理登录跳转
          break
        case 403:
          errorMessage = '禁止访问'
          break
        case 404:
          errorMessage = '接口不存在'
          break
        case 422:
          errorMessage = data?.message || '数据验证失败'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 502:
        case 503:
        case 504:
          errorMessage = '服务暂时不可用'
          break
        default:
          errorMessage = data?.message || data?.error || `服务器错误 (${status})`
      }
    } else if (error.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络设置'
    } else {
      // 其他错误
      errorMessage = error.message || '未知错误'
    }

    // 显示错误消息（除非配置不显示）
    if (!error.config?.hideError) {
      ElMessage.error(errorMessage)
    }

    return Promise.reject(new Error(errorMessage))
  }
)

// 导出API方法
export default {
  // GET请求
  get(url, config = {}) {
    return api.get(url, config)
  },

  // POST请求
  post(url, data = {}, config = {}) {
    return api.post(url, data, config)
  },

  // PUT请求
  put(url, data = {}, config = {}) {
    return api.put(url, data, config)
  },

  // DELETE请求
  delete(url, config = {}) {
    return api.delete(url, config)
  },

  // PATCH请求
  patch(url, data = {}, config = {}) {
    return api.patch(url, data, config)
  },

  // 上传文件
  upload(url, formData, config = {}) {
    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      }
    })
  },

  // 下载文件
  download(url, config = {}) {
    return api.get(url, {
      ...config,
      responseType: 'blob'
    })
  },

  // 取消请求的CancelToken
  CancelToken: axios.CancelToken,

  // 创建取消令牌
  source: axios.CancelToken.source
}

// 导出axios实例（供高级用法）
export { api as axiosInstance } 