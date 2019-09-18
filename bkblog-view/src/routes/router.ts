import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes:any = []

const routerContext = require.context('./module', true, /\.ts$/)

routerContext.keys().forEach(route => {
  const routeConfig = routerContext(route)
  /**
  * 兼容 import export 和 require module.export 两种规范
  */
  routes = routes.concat(routeConfig.default || routeConfig)
  // routes = [...routes, ...(routeConfig.default || routeConfig)]
})

export default new Router({
  routes: routes
})
