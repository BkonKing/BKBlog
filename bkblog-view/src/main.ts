import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import './permission'
import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.config.errorHandler = function (err) {
  Vue.nextTick(() => {
    console.error(err)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
