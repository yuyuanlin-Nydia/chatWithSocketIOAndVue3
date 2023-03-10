import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getToken } from '../util/localStorage'
import { store } from '@/store'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/LogIn.vue')
  },
  {
    path: '',
    component: () => import(/* webpackChunkName: "MainLayout" */ '../layout/MainLayout.vue'),
    redirect: '/chat',
    children: [
      {
        path: '/chat',
        name: 'Chat',
        component: () => import(/* webpackChunkName: "chat" */ '../views/Chat.vue')
      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "setting" */ '../views/Setting.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (!getToken() && to.name !== 'Login') {
    store.dispatch('appModule/checkAuth')
  }
})

export default router
