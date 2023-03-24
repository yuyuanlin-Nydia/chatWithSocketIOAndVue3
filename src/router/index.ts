import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utilities/localStorage'
import { store } from '@/store'
import { PageName } from '@/enum/pageNameEnum'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: PageName.Login,
    component: () => import(/* webpackChunkName: "Login" */ '../views/LogIn.vue')
  },
  {
    path: '',
    component: () => import(/* webpackChunkName: "MainLayout" */ '../layout/MainLayout.vue'),
    redirect: PageName.Chat,
    children: [
      {
        path: '/chat',
        name: PageName.Chat,
        component: () => import(/* webpackChunkName: "chat" */ '../views/Chat.vue')
      },
      {
        path: '/setting',
        name: PageName.Setting,
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
