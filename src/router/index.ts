import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Chat from '../views/Chat.vue'
import LogIn from '../views/LogIn.vue'
import MainLayout from '../layout/MainLayout.vue'
import store from '../store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'LogIn',
    component: () => import(/* webpackChunkName: "Login" */ '../views/LogIn.vue')
  },
  {
    path: '',
    component: () => import(/* webpackChunkName: "MainLayout" */ '../layout/MainLayout.vue'),
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

router.beforeEach(async (to, from, next) => {
  const logInStat = store.state.appModule.isLogIn
  if (!logInStat && to.name !== 'LogIn') {
    return next({ name: 'LogIn' })
  }
  next()
})

export default router
