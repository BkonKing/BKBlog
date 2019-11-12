import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let routes: any[] = []

const modulesRoutes = require.context('./module', true, /\.ts$/)

modulesRoutes.keys().forEach(route => {
  const modulesRoute = modulesRoutes(route)
  routes = routes.concat(modulesRoute.default || modulesRoute)
})

// console.log(routes)

const router = new VueRouter({
  routes: routes
})

export default router
