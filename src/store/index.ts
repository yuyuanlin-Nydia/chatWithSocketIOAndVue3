import msgModule from '@/store/msgModule'
import appModule from '@/store/appModule'
import { createStore } from 'vuex'

export const store = createStore({
  modules: {
    appModule,
    msgModule
  }
})
