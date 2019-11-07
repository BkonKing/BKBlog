import Vue from 'vue'
import App from './App.vue'
import router from './routes/router'
import store from './store/store'
//
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './registerServiceWorker'
// import '@/styles/var.scss'
import '@/styles/index.scss'

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
