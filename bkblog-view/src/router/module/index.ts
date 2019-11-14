const index = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '@/views/user/login.vue')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
    meta: { hidden: true }
  }
  // {
  //   path: '/add',
  //   name: 'add',
  //   component: () => import(/* webpackChunkName: "add" */ '@/views/user/add.vue')
  // }
]

export default index
