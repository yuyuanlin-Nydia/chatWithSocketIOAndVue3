import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Chat from '../views/Chat.vue'
import LogIn from '../views/LogIn.vue'
import store from '../store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/setting',
    name: 'Setting',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Setting.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach(async (to) => {
//   const logInStat = (store as any).state.appStore.isLogIn
//   if (!logInStat && to.name !== 'LogIn') {
//     return { name: 'LogIn' }
//   }
// })

export default router
