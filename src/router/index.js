import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'app',
    redirect: '/release',
    component: () => import('../views/index.vue'),
    children: [
      {
        path: 'release',
        name: 'release',
        component: () => import('../views/components/modules/releaseManager.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
