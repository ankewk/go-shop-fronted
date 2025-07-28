import { createRouter, createWebHistory } from 'vue-router'

// 路由组件懒加载
const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/Home.vue')
const Products = () => import('@/views/Products.vue')
const ProductDetail = () => import('@/views/ProductDetail.vue')
const Cart = () => import('@/views/Cart.vue')
const Orders = () => import('@/views/Orders.vue')
const OrderDetail = () => import('@/views/OrderDetail.vue')
const Profile = () => import('@/views/Profile.vue')
const Checkout = () => import('@/views/Checkout.vue')

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页',
          icon: 'House',
          keepAlive: true
        }
      },
      {
        path: 'products',
        name: 'Products',
        component: Products,
        meta: {
          title: '商品列表',
          icon: 'Box',
          keepAlive: true
        }
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: ProductDetail,
        meta: {
          title: '商品详情',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'cart',
        name: 'Cart',
        component: Cart,
        meta: {
          title: '购物车',
          icon: 'ShoppingCart'
        }
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: Checkout,
        meta: {
          title: '订单结算',
          hideInMenu: true
        }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: Orders,
        meta: {
          title: '我的订单',
          icon: 'Document'
        }
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: OrderDetail,
        meta: {
          title: '订单详情',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          title: '个人中心',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时的滚动行为
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Gin商城`
  } else {
    document.title = 'Gin商城'
  }
  
  // 这里可以添加权限验证
  // const token = localStorage.getItem('token')
  // if (to.meta.requiresAuth && !token) {
  //   next('/login')
  //   return
  // }
  
  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router

// 导出菜单配置（供导航组件使用）
export const menuConfig = [
  {
    path: '/home',
    name: 'Home',
    title: '首页',
    icon: 'House'
  },
  {
    path: '/products',
    name: 'Products',
    title: '商品',
    icon: 'Box'
  },
  {
    path: '/cart',
    name: 'Cart',
    title: '购物车',
    icon: 'ShoppingCart'
  },
  {
    path: '/orders',
    name: 'Orders',
    title: '订单',
    icon: 'Document'
  },
  {
    path: '/profile',
    name: 'Profile',
    title: '个人中心',
    icon: 'User'
  }
] 