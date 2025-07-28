import { createStore } from 'vuex'
import user from './modules/user'
import products from './modules/products'
import cart from './modules/cart'
import orders from './modules/orders'
import app from './modules/app'

const store = createStore({
  modules: {
    user,
    products,
    cart,
    orders,
    app
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store 